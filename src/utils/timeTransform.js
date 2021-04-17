export function transformTimeToSecs(hours, minutes, seconds) {
  return (
    hours * 60 * 60 + minutes * 60 + seconds
  );
}

export function transformSecsToTime(secondsToTick) {
  let seconds = secondsToTick;
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;

  return { hours, minutes, seconds };
}