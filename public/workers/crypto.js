self.onmessage = function (event) {
    var _a, _b, _c;
    var BASE_URL = "wss://ws.coincap.io/prices";
    switch (event.data.type) {
        case "init":
            if (!!self.currencyWs)
                return;
            var message = event.data;
            self.currencyWs = new WebSocket("".concat(BASE_URL, "?assets=").concat((_a = message.payload) === null || _a === void 0 ? void 0 : _a.data.assets));
            var initSubscription = function () {
                var _a;
                (_a = self.currencyWs) === null || _a === void 0 ? void 0 : _a.addEventListener("message", function (event) {
                    return postMessage(JSON.parse(event.data));
                });
            };
            initSubscription();
            break;
        case "stop":
            console.log("Closing WebSocket connection...");
            var removeSubscription = function () {
                var _a;
                (_a = self.currencyWs) === null || _a === void 0 ? void 0 : _a.removeEventListener("message", function (event) { return postMessage(JSON.parse(event.data)); });
            };
            removeSubscription();
            (_b = self.currencyWs) === null || _b === void 0 ? void 0 : _b.close();
            self.currencyWs = null;
            break;
        case "error":
            (_c = self.currencyWs) === null || _c === void 0 ? void 0 : _c.close();
            self.currencyWs = null;
            break;
        default:
            console.error("Unhandled message type: ", event.data.type);
    }
};
export {};
