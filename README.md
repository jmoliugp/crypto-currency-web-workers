# 🛠️ Harnessing the Power of Web Workers with Next.js ⚡

This project demonstrates how to efficiently manage real-time cryptocurrency data in a Next.js application by leveraging Web Workers. Web Workers allow you to run scripts in background threads, preventing the main thread from becoming overloaded and ensuring that your UI remains responsive.

## ✨ Features

- **🚀 Web Worker Integration**: The project shows how to integrate Web Workers into a Next.js application to handle real-time data, such as cryptocurrency prices, without affecting the performance of the main thread.
- **💻 TypeScript Support**: The project is fully written in TypeScript, including type definitions for Web Worker messages.
- **🗂️ Modular Configuration**: Separate `tsconfig.worker.json` for compiling Web Worker files, ensuring that the main project configuration remains clean and unaffected.

## 📂 Project Structure

- **`/public/workers`**: This directory contains the compiled Web Worker files that can be accessed by any component in the application.
- **`/workers`**: The TypeScript source files for the Web Workers are stored here.
- **`/types`**: Contains TypeScript types for structuring Web Worker messages and configurations.
- **`/pages`**: Contains the main UI components that interact with the Web Workers.

## 🚀 Getting Started

### 🛠️ Prerequisites

- Node.js (v14 or higher)
- npm

### 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/nextjs-web-workers.git
   cd nextjs-web-workers
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### ▶️ Running the Application

To start the development server with Web Worker support:

1. Build the Web Worker files:

   ```bash
   npm run build:workers
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   This command will run the Next.js development server along with a watcher that rebuilds the Web Worker files on save.

### 📜 Available Scripts

- `npm run build:workers`: Compiles the Web Worker TypeScript files into JavaScript and places them in the `/public/workers` directory.
- `npm run watch:workers`: Watches the `/workers` directory for changes and recompiles the Web Worker files on save.
- `npm run dev`: Starts the Next.js development server on `127.0.0.1:3111`.

### 🛠️ Project Configuration

- **`tsconfig.worker.json`**:
  This configuration file extends the main `tsconfig.json` and specifies output settings for Web Worker files. All worker files are compiled into the `/public/workers` directory.

  ```json
  {
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "outDir": "./public/workers",
      "module": "ES6",
      "noEmit": false
    },
    "include": ["workers/**/*.ts"]
  }
  ```

### 🧠 Web Worker API

The Web Workers are set up to communicate with the main thread using `postMessage` and `onmessage`. Here’s a brief overview of the methods and properties used:

- **🔧 Methods**:

  - `postMessage()`: Sends a message from the main thread to the worker or vice versa.
  - `terminate()`: Immediately stops the worker.
  - `addEventListener()`: Listens for messages or errors in the worker.
  - `removeEventListener()`: Removes an event listener.

- **📋 Properties**:
  - `onmessage`: Handles incoming messages from the worker.
  - `onerror`: Handles errors that occur within the worker.

### 🔍 Example Usage

The `crypto.ts` worker file handles real-time cryptocurrency prices using a WebSocket connection to the CoinCap API. It listens for `init` and `stop` messages to start or stop the WebSocket connection, and it broadcasts the received data to the main thread.

```ts
self.onmessage = (e) => {
  // WebSocket setup and message handling logic
  ...
}
```

The main `page.ts` file demonstrates how to interact with the worker, start and stop the data stream, and update the UI with the latest prices.

```ts
useEffect(() => {
  workerRef.current = new Worker('/workers/crypto/crypto.js', {
    type: 'module',
  })
  ...
}, [])
```

### 🎯 Conclusion

This project showcases the integration of Web Workers with a Next.js application, providing a scalable solution for handling real-time data. While this example focuses on cryptocurrency prices, the same approach can be applied to other use cases where background processing is required.
