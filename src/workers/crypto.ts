import { CryptoWorkConfigT, WorkerMessageT } from "@/workers/types";

interface CryptoWebWorkerGlobalScope extends ServiceWorkerGlobalScope {
  currencyWs: WebSocket | null;
}
declare const self: CryptoWebWorkerGlobalScope;

self.onmessage = (event) => {
  const BASE_URL = "wss://ws.coincap.io/prices";

  switch (event.data.type) {
    case "init":
      if (!!self.currencyWs) return;

      const message: WorkerMessageT<CryptoWorkConfigT> = event.data;

      self.currencyWs = new WebSocket(
        `${BASE_URL}?assets=${message.payload?.data.assets}`
      );

      const initSubscription = () => {
        self.currencyWs?.addEventListener("message", (event) =>
          postMessage(JSON.parse(event.data))
        );
      };
      initSubscription();
      break;

    case "stop":
      console.log(`Closing WebSocket connection...`);
      const removeSubscription = () => {
        self.currencyWs?.removeEventListener(
          "message",
          (event) => postMessage(JSON.parse(event.data))!
        );
      };
      removeSubscription();

      self.currencyWs?.close();
      self.currencyWs = null;
      break;

    case "error":
      self.currencyWs?.close();
      self.currencyWs = null;

      break;

    default:
      console.error("Unhandled message type: ", event.data.type);
  }
};
