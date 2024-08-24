import { CryptoWorkConfigT, WorkerMessageT } from "@/workers/types";

let pricesWs: WebSocket | null = null;

self.onmessage = (e) => {
  const BASE_URL = "wss://ws.coincap.io/prices";
  switch (e.data.type) {
    case "init":
      const message: WorkerMessageT<CryptoWorkConfigT> = e.data;

      // Initialize the WebSocket connection
      pricesWs = new WebSocket(
        `${BASE_URL}?assets=${message.payload?.data.assets}`
      );

      const initSubscription = () => {
        pricesWs?.addEventListener("message", function (event) {
          self.postMessage(JSON.parse(event.data));
        });
      };

      initSubscription();

      break;

    default:
      // Handle any cases that are not explicitly mentioned
      console.error("Unhandled message type:", e.data.type);
  }
};
