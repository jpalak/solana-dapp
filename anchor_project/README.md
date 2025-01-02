# ToDo DApp Backend

## Overview

This project is a backend implementation of a ToDo application built on the Solana blockchain using the Anchor framework. It allows users to create, manage, and track tasks with features such as adding, removing, and toggling task completion status.

## Features

- Create new tasks.
- Remove tasks (mark as completed).
- Toggle task completion status.
- Store tasks securely on the Solana blockchain.

## Prerequisites

- [Rust installed](https://www.rust-lang.org/tools/install)
    - Make sure to use stable version:
    ```bash
    rustup default stable
    ```
- [Solana installed](https://docs.solana.com/cli/install-solana-cli-tools)
    - Use v1.18.18
    - After you have Solana-CLI installed, you can switch between versions using:
    ```bash
    solana-install init 1.18.18
    ```

- [Anchor installed](https://www.anchor-lang.com/docs/installation)
    - Use v0.30.1
    - After you have Anchor installed, you can switch between versions using:
    ```bash
    avm use 0.30.1
    ```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/School-of-Solana/program-jpalak.git
   ```
   The source code of the on-chain program is stored within the `program-jpalak/anchor_project` folder

2. **Set up your Solana environment:**

   Make sure you have the Solana CLI installed and configured. You can set the environment to Devnet:

   ```bash
   solana config set --url d
   ```

3. **Create a wallet:**

   If you don't have a wallet, create one using:

   ```bash
   solana-keygen new -o id.json
   ```

4. **Airdrop SOL for testing:**

   Request some SOL to your wallet for testing:

   ```bash
   solana airdrop 1 id.json
   ```
   
   As the airdrop amount is limited (1SOL for a day), you can use a Solana faucet:

   ```bash
   https://faucet.solana.com/
   ```

## Usage

With the setup described above, you should be able to run the following commands.

- You should have **Yarn** installed as it is one of the steps during **Anchor** installation, so once you clone the repo, you should be able to run:
    ```
    yarn install
    ```

1. **Build the program:**

    To build the project, run:
    ```bash
    anchor build
    ```

2. **Deploy the program:**

   Deploy the smart contract to the Solana blockchain:

   ```bash
   anchor deploy
   ```

3. **Interact with the program:**

   You can interact with the deployed program using the Solana CLI or through a frontend application. The program exposes the following methods:

   - `initialize_account`: Initializes a new ToDo account.
   - `adding_task`: Adds a new task to the ToDo account.
   - `removing_task`: Removes a task from the ToDo account.
   - `toggling_task`: Toggles the completion status of a task.

## Testing

To test the project, run:
   ```bash
   anchor test
   ```
