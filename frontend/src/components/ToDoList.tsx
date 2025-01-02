// TODO: SignMessage
// @ts-nocheck
import { verify } from '@noble/ed25519';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { FC, useCallback, useState } from 'react';
import { notify } from "../utils/notifications";

import { Program, AnchorProvider, web3, utils, BN, setProvider } from "@coral-xyz/anchor";
import idl from "./todo_program.json"
import { TodoProgram } from './todo_program';

import { PublicKey } from '@solana/web3.js';
import { Toaster, toast } from 'sonner';
import React, { useEffect } from "react";
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils';

const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)
const programID = new PublicKey(idl.address)

export const ToDoList: FC = () => {
    const ourWallet = useWallet();
    const { connection } = useConnection()

    const [tasks, setTasks] = useState([]);  // State to hold current task
    const [allTasks, setAllTasks] = useState([]); // State to hold all tasks
    const [taskName, setTaskName] = useState("Default Task Name");

    const getProvider = () => {
        const provider = new AnchorProvider(connection, ourWallet, AnchorProvider.defaultOptions())
        setProvider(provider)
        return provider
    }

    const initializeTodoAccount = async () => {
        try {
            const anchProvider = getProvider()
            const program = new Program<TodoProgram>(idl_object, anchProvider)

            // Derive the PDA for the todo account
            const [todoAccountPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("todo"), anchProvider.publicKey.toBuffer()],
                program.programId
            );

            // Initialize the account
            await program.methods.initializeAccount()
                .accounts({
                    todoAccount: todoAccountPda,
                    authority: anchProvider.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            console.log("Todo account initialized at:", todoAccountPda.toString());
            return todoAccountPda;
        } catch (error) {
            console.error("Error initializing todo account:", error);
            throw error;
        }
    }
    const addTask = async (content: string) => {
        try {
            if (!ourWallet.publicKey) {
                toast.error("Wallet is not connected!");
                throw new Error("Wallet is not connected");
            }
            console.log("Todo account status:", await connection.getAccountInfo(ourWallet.publicKey));
            console.log("Content to add:", content);

            const anchProvider = getProvider()
            const program = new Program<TodoProgram>(idl_object, anchProvider)

            // Derive the PDA for the todo account
            const [todoAccountPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("todo"), anchProvider.publicKey.toBuffer()],
                program.programId
            );

            // Check if the account exists
            const accountInfo = await connection.getAccountInfo(todoAccountPda);

            //Initialize if the account exists
            if (!accountInfo) {
                console.log("Initializing new todo account...");
                await initializeTodoAccount(); // Call the initialization function
            }

            // Add the new task
            await program.methods.addingTask(content).accounts({
                todoAccount: todoAccountPda,
                authority: anchProvider.publicKey
            }).rpc()

            // Append the new task to the current state
            setTasks(prevTasks => {
                const newTask = { content, completed: false, createdAt: Date.now() / 1000 };

                // Add the new task just below all pending tasks
                const updatedTasks = [...prevTasks, newTask];

                // Sort tasks: Pending tasks at the top, new tasks below them, completed tasks at the bottom
                updatedTasks.sort((a, b) => {
                    if (a.completed === b.completed) {
                        return b.createdAt - a.createdAt; // Sort by createdAt if statuses are the same
                    }
                    return a.completed ? 1 : -1; // Move completed tasks to the bottom
                });

                return updatedTasks;
            });

            console.log("New task was added");
            toast.success("Successfully added a new task")
            fetchTasks();
        } catch (error) {
            console.error("Error while adding a task: " + error)
            toast.error("Failed to add task!");
        }

    }

    const handleNewTask = (event) => {
        const inputValue = event.target.value;
        console.log("New value = ", inputValue);
        setTaskName(inputValue);
    };


    const fetchTasks = async () => {
        try {
            const anchProvider = getProvider();
            const program = new Program(idl_object, anchProvider);

            // Derive the PDA for the todo account
            const [todoAccountPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("todo"), anchProvider.publicKey.toBuffer()],
                program.programId
            );

            // Fetch the tasks from the todo account
            const tasksData = await program.account.todoAccount.fetch(todoAccountPda);
            const fetchedTasks = tasksData.tasks.map(task => ({
                ...task,
                completed: task.completed || false,
            }));

            // Merge fetched tasks with current state to preserve completed status
            setTasks(prevTasks => {
                const taskMap = new Map(prevTasks.map(task => [task.content, task]));
                fetchedTasks.forEach(task => {
                    if (!taskMap.has(task.content)) {
                        taskMap.set(task.content, task);
                    }
                });
                return Array.from(taskMap.values());
            });

        } catch (error) {
            console.error("Error while fetching tasks: " + error)
            toast.error('Failed to fetch tasks!');
        }
    }

    useEffect(() => {
        fetchTasks(); // Fetch tasks when the component mounts
    }, []);


    const closeTask = async (publicKey, index) => {
        try {
            const anchorProvider = getProvider();
            const program = new Program<TodoProgram>(idl_object, anchorProvider);

            // Call the method to remove the task
            await program.methods.removingTask(index).accounts({
                todoAccount: publicKey,
                authority: anchorProvider.publicKey,
            }).rpc();

            // Update the local state to reflect the change and sort tasks
            setTasks(prevTasks => {
                // Mark the task as completed
                const updatedTasks = prevTasks.map((task, i) =>
                    i === index ? { ...task, completed: true } : task
                );

                // Sort tasks: Pending tasks at the top, completed tasks at the bottom
                updatedTasks.sort((a, b) => {
                    if (a.completed === b.completed) {
                        return b.createdAt - a.createdAt; // Sort by createdAt if statuses are the same
                    }
                    return a.completed ? 1 : -1; // Move completed tasks to the bottom
                });

                return updatedTasks;
            });

            console.log("Task closed successfully");
            toast.success("Task closed successfully!");

        } catch (error) {
            console.error("Error while closing task: " + error);
            toast.error("Error while closing task");
        }
    }

    return (
        <div>
            <hr />
            <input type="text"
                placeholder='Add a task'
                value={taskName}
                onChange={handleNewTask}
                style={{
                    padding: "10px",
                    flex: "7",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    width: "100%",
                    color: "black",
                    marginBottom: "10px",
                }}
            />
            <div className="flex flex-row justify-center">
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                    rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                        onClick={() => addTask(taskName)}
                    >
                        <div className="hidden group-disabled:block">
                            Wallet not connected
                        </div>
                        <span className="block group-disabled:hidden" >
                            Add task
                        </span>
                    </button>
                </div>
            </div>
            <hr />
            <h2 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">All Tasks</h2>
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Task</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Created At</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index} className={`border border-gray-300`}>
                            <td className="border border-gray-300 p-2">{task.content.toString()}</td>
                            <td className="border border-gray-300 p-2">{task.completed ? 'Completed' : 'Pending'}</td>
                            <td className="border border-gray-300 p-2">
                                {task.createdAt ?
                                    new Date(task.createdAt * 1000).toLocaleString()
                                    : 'N/A'}
                            </td>
                            <td className="border border-gray-300 p-2">
                                <button
                                    onClick={() => closeTask(task.pubkey, index)}
                                    className="text-green-500"
                                >
                                    Complete task
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div> // Closing main div
    ); // Closing return statement
}; // Closing ToDoList component