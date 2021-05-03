import { useEffect, useRef } from "react";

export default function useTimeout(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function action() {
      savedCallback.current();
    }
    if (delay !== null) {
      const worker = new window.Worker("./workers/set-timeout-worker.js");
      worker.postMessage({ delay });
      worker.onerror = (err) => console.error(err);
      worker.onmessage = () => {
        action();
      };
      return () => worker.terminate();
    }
  }, [delay]);
}
