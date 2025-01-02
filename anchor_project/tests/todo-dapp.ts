import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoProgram } from "../target/types/todo_program";
import { expect } from "chai";
import { PublicKey } from "@solana/web3.js";

describe("todo-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoProgram as Program<TodoProgram>;
  const wallet = provider.wallet as anchor.Wallet;

  // Helper function to get PDA
  async function getTodoAccountPDA(authority: PublicKey): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from("todo"), authority.toBuffer()],
      program.programId
    );
  }

  describe("initialize", () => {
    it("should successfully initialize a new todo account", async () => {
      // Get PDA for todo account
      const [todoAccountPDA, _] = await getTodoAccountPDA(wallet.publicKey);

      // Initialize the todo account
      const tx = await program.methods
        .initializeAccount()
        .accounts({
          todoAccount: todoAccountPDA,
          authority: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Fetch the created account
      const todoAccount = await program.account.todoAccount.fetch(todoAccountPDA);

      expect(todoAccount.authority.toString()).to.equal(wallet.publicKey.toString());
      expect(todoAccount.tasks).to.be.empty;
    });

    it("should fail when trying to initialize twice", async () => {
      const [todoAccountPDA, _] = await getTodoAccountPDA(wallet.publicKey);

      try {
        await program.methods
          .initializeAccount()
          .accounts({
            todoAccount: todoAccountPDA,
            authority: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have failed");
      } catch (error) {
        expect(error.message).to.include("already in use");
      }
    });
  });

  describe("add_task", () => {
    it("should successfully add a task", async () => {
      const [todoAccountPDA, _] = await getTodoAccountPDA(wallet.publicKey);
      const taskContent = "Complete Solana tutorial";

      await program.methods
        .addingTask(taskContent)
        .accounts({
          todoAccount: todoAccountPDA,
          authority: wallet.publicKey,
        })
        .rpc();

      const todoAccount = await program.account.todoAccount.fetch(todoAccountPDA);
      expect(todoAccount.tasks).to.have.lengthOf(1);
      expect(todoAccount.tasks[0].content).to.equal(taskContent);
      expect(todoAccount.tasks[0].completed).to.be.false;
    });

    it("should fail when content is too long", async () => {
      const [todoAccountPDA, _] = await getTodoAccountPDA(wallet.publicKey);
      const longContent = "a".repeat(200); // Create a string that's too long

      try {
        await program.methods
          .addingTask(longContent)
          .accounts({
            todoAccount: todoAccountPDA,
            authority: wallet.publicKey,
          })
          .rpc();
        expect.fail("Should have failed");
      } catch (error) {
        expect(error.message).to.include("ContentTooLong");
      }
    });

    it("should fail with wrong authority", async () => {
      const [todoAccountPDA, _] = await getTodoAccountPDA(wallet.publicKey);
      const wrongWallet = anchor.web3.Keypair.generate();

      try {
        await program.methods
          .addingTask("Test task")
          .accounts({
            todoAccount: todoAccountPDA,
            authority: wrongWallet.publicKey,
          })
          .signers([wrongWallet])
          .rpc();
        expect.fail("Should have failed");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: ConstraintSeeds")
          .and.to.include("A seeds constraint was violated");
      }
    });
  });

  describe("remove_task", () => {
    it("should successfully remove a task", async () => {
      // Create a new wallet for a clean test
      const newWallet = anchor.web3.Keypair.generate();

      // Airdrop some SOL to the new wallet
      const signature = await provider.connection.requestAirdrop(
        newWallet.publicKey,
        1000000000
      );
      await provider.connection.confirmTransaction(signature);

      // Get PDA for the new wallet
      const [todoAccountPDA, _] = await getTodoAccountPDA(newWallet.publicKey);

      // Initialize a new todo account
      await program.methods
        .initializeAccount()
        .accounts({
          todoAccount: todoAccountPDA,
          authority: newWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([newWallet])
        .rpc();

      // Add a task
      await program.methods
        .addingTask("Task to remove")
        .accounts({
          todoAccount: todoAccountPDA,
          authority: newWallet.publicKey,
        })
        .signers([newWallet])
        .rpc();

      // Verify task was added
      let todoAccount = await program.account.todoAccount.fetch(todoAccountPDA);
      console.log("Tasks after adding:", todoAccount.tasks);
      expect(todoAccount.tasks).to.have.lengthOf(1);

      // Remove the task
      const tx = await program.methods
        .removingTask(0)
        .accounts({
          todoAccount: todoAccountPDA,
          authority: newWallet.publicKey,
        })
        .signers([newWallet])
        .rpc();

      // Wait for confirmation
      await provider.connection.confirmTransaction(tx);

      // Verify task was removed
      todoAccount = await program.account.todoAccount.fetch(todoAccountPDA);
      console.log("Tasks after removing:", todoAccount.tasks);
      expect(todoAccount.tasks).to.have.lengthOf(0);
    });

    it("should fail when removing non-existent task", async () => {
      const [todoAccountPDA, _] = await getTodoAccountPDA(wallet.publicKey);

      try {
        await program.methods
          .removingTask(99) // Try to remove non-existent task
          .accounts({
            todoAccount: todoAccountPDA,
            authority: wallet.publicKey,
          })
          .rpc();
        expect.fail("Should have failed");
      } catch (error) {
        expect(error.message).to.include("InvalidTaskIndex");
      }
    });
  });

  describe("toggle_task", () => {
    it("should successfully toggle task completion", async () => {
      const [todoAccountPDA, _] = await getTodoAccountPDA(wallet.publicKey);

      // Add a task
      await program.methods
        .addingTask("Task to toggle")
        .accounts({
          todoAccount: todoAccountPDA,
          authority: wallet.publicKey,
        })
        .rpc();

      // Toggle it
      await program.methods
        .togglingTask(0)
        .accounts({
          todoAccount: todoAccountPDA,
          authority: wallet.publicKey,
        })
        .rpc();

      // Verify it's toggled
      let todoAccount = await program.account.todoAccount.fetch(todoAccountPDA);
      expect(todoAccount.tasks[0].completed).to.be.true;

      // Toggle it back
      await program.methods
        .togglingTask(0)
        .accounts({
          todoAccount: todoAccountPDA,
          authority: wallet.publicKey,
        })
        .rpc();

      // Verify it's toggled back
      todoAccount = await program.account.todoAccount.fetch(todoAccountPDA);
      expect(todoAccount.tasks[0].completed).to.be.false;
    });

    it("should fail when toggling non-existent task", async () => {
      const [todoAccountPDA, _] = await getTodoAccountPDA(wallet.publicKey);

      try {
        await program.methods
          .togglingTask(99)
          .accounts({
            todoAccount: todoAccountPDA,
            authority: wallet.publicKey,
          })
          .rpc();
        expect.fail("Should have failed");
      } catch (error) {
        expect(error.message).to.include("InvalidTaskIndex");
      }
    });
  });
});