# BlockHero

BlockHero is a secure, decentralized file management application built on the Internet Computer. It provides a robust platform for user authentication, encrypted file storage, and detailed activity logging, making it suitable for handling sensitive data.

## ✨ Features

*   **Decentralized Identity**: Users are identified by their Internet Identity `Principal`.
*   **Secure User Management**: Robust registration and login system.
*   **Encrypted File Storage**: Files are uploaded and stored securely on-chain.
*   **Access Control**: Only authorized users can access specific files.
*   **Audit Trails**: Comprehensive logging of all significant actions (e.g., file uploads, reads) for transparency and security.
*   **VETKD Integration**: Utilizes `vetKD` for advanced cryptographic operations, enabling features like threshold decryption.

## 🛠️ Tech Stack

*   **Backend Canister**: Rust
*   **Frontend**: React (with Vite)
*   **Blockchain**: Internet Computer Protocol
*   **SDK**: DFINITY Canister SDK (`dfx`)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

*   Node.js (v16.x or later)
*   DFINITY Canister SDK (`dfx`)
*   Rust with the `wasm32-unknown-unknown` target:
    ```bash
    rustup target add wasm32-unknown-unknown
    ```

## 🚀 Getting Started

Follow these steps to get your local development environment up and running.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd BlockHero
```

### 2. Install Dependencies

Install the npm packages for the frontend and project tooling:

```bash
npm install
```

### 3. Start the Local Replica

In a separate terminal, start a local instance of the Internet Computer. The `--clean` flag is recommended for a fresh start.

```bash
dfx start --clean --background
```

### 4. Deploy the Canisters

Build and deploy your backend and frontend canisters to the local replica:

```bash
dfx deploy
```

After a successful deployment, `dfx` will output the URL for your frontend canister.

### 5. Access the Application

Open the frontend URL provided by the `dfx deploy` command in your web browser.

## 💻 Frontend Development

For a better frontend development experience with hot-reloading, you can run the Vite development server after deploying your canisters.

```bash
npm start
```

> **Note**: If you make changes to the backend canister (`src/BlockHero_backend/src/lib.rs`), you must run `dfx deploy` again to apply them.