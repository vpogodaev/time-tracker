onmessage = (e) => {
  if (!e || !e.data) {
    return;
  }
  const { delay } = e.data;
  if (!delay) {
    return;
  }
  setInterval(() => {
    postMessage(true);
  }, delay);
};
