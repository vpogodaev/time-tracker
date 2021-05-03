// взято с https://overreacted.io/making-setinterval-declarative-with-react-hooks/

import { useEffect, useRef } from "react";

export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const worker = new window.Worker("./workers/set-interval-worker.js");
      worker.postMessage({ delay });
      worker.onerror = (err) => console.error(err);
      worker.onmessage = (e) => {
        tick();
      };
      return () => worker.terminate();
    }
  }, [delay]);
}
