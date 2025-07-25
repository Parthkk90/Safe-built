
# 🛡️ BlockHero — Decentralized File Management System on the Internet Computer

BlockHero is a secure, trustless, and decentralized file management system built on the Internet Computer (IC) blockchain. It empowers users with full control over their data, strong cryptographic authentication, hierarchical access control, and immutable audit logging — all without relying on any centralized authority.

---

## 🚨 Problem Statement

🔒 Traditional file systems suffer from:
- Centralized storage vulnerabilities
- Lack of user data ownership
- Weak, centralized access control
- No transparent or verifiable audit trails

---

## 🚀 Solution Overview

BlockHero solves this by offering:
- ✅ **Decentralized File Storage** using IC canisters
- ✅ **Principal-based Identity Authentication** (no username-password leaks)
- ✅ **Role-based Access Control (RBAC)** with 256 permission levels
- ✅ **Immutable On-chain Audit Logs**
- ✅ **Fully Decentralized Architecture** (no central server)
- ✅ **Modern Web UI** built using React + Vite

---

## 🔧 Tech Stack

| Layer     | Stack                                                                 |
|-----------|-----------------------------------------------------------------------|
| 🧠 Backend | Rust, Candid, Internet Computer SDK (CDK), SHA2, Chrono               |
| 🧊 Blockchain | Internet Computer (IC), Canisters                                  |
| 💻 Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Lucide React           |
| 🔐 Identity | @dfinity/agent, @dfinity/auth-client, @dfinity/principal, candid    |

---

## 🧪 Core Features

### 🧍 User Management
- Register users with IC Principal
- Assign authority levels (0-255)
- Secure hashed password verification

### 📁 File Operations
- Upload files with assigned access levels
- Read/download based on authority
- Modify or delete by privileged users

### 🔐 Access Control
- Hierarchical permissions (0 = highest)
- Users only access files ≤ their authority
- Each file's access level is enforced server-side

### 📜 Audit Logging
- Immutable logs of every file operation
- Includes actor principal, timestamp, operation, and file metadata

### 🎨 Frontend UI
- Responsive, animated dashboard with:
  - Login/Signup using Internet Identity
  - File upload/download interface
  - Visual access-level indicators
  - Audit log viewer (admin only)

---

## 📊 Architecture

```
┌──────────────┐      ┌──────────────────────┐      ┌───────────────┐
│ React Frontend│ <──>│ Internet Computer SDK│ <──> │ Rust Canister │
└──────────────┘      └──────────────────────┘      └───────────────┘
      │                        │                           │
      ▼                        ▼                           ▼
User Interface       Identity Verification           File Storage & Logs
```

---

## ✅ MVP Summary

| Feature                    | Status |
|---------------------------|--------|
| Internet Identity Auth     | ✅     |
| File Upload/Download       | ✅     |
| RBAC (0–255 Levels)        | ✅     |
| Immutable Audit Logging    | ✅     |
| React + Vite Frontend      | ✅     |
| Real-time Notifications    | ✅     |

---

## 🔐 Security Highlights

- SHA2 Password Hashing
- IC Principal Authentication
- Zero-Trust Authorization Model
- End-to-End Permission Checks
- On-Chain Logs (Tamper-proof)

---

## 🌐 Live Demo (Optional)

⚠️ Coming Soon on Internet Computer Mainnet  
Or test locally with:

```bash
dfx start --background && dfx deploy
```
