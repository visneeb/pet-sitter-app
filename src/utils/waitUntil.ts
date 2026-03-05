export default async function waitUntil(
  predicate: () => boolean,
  timeoutMs = 10000,
  intervalMs = 50,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (predicate()) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(interval);
        reject(new Error("Timeout waiting for condition"));
      }
    }, intervalMs);
  });
}
