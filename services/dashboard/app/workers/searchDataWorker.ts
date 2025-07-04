// Search data loader Web Worker
// This worker loads investments and funds data (similar to the `getMenuData` serverFn)
// but completely on the client side so it doesn't block the UI.
//
// It expects a message with the value "load" and then responds with
//    { type: "data", payload: { investments: [...], funds: [...] } }
//
// The worker terminates itself after posting the data.

// These imports resolve to the final asset URLs after bundling.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – Vite will transform the JSON into a URL string
import investmentsUrl from "../data/investments.json?url";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – Vite will transform the JSON into a URL string
import fundsUrl from "../data/funds.json?url";

self.addEventListener("message", async (event) => {
  if (event.data !== "load") return;

  try {
    const [investments, funds] = await Promise.all([
      fetch(investmentsUrl).then((r) => r.json()),
      fetch(fundsUrl).then((r) => r.json()),
    ]);

    // Post the combined payload back to the main thread
    postMessage({ type: "data", payload: { investments, funds } });
  } catch (error: any) {
    postMessage({ type: "error", error: error?.message ?? "Unknown error" });
  } finally {
    // Optionally, close the worker since its job is done.
    // Remove this `self.close()` if you plan on reusing the same worker instance.
    self.close();
  }
}); 