export function formatUptime(ms: number) {
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / 1000 / 60) % 60;
  const hr = Math.floor(ms / 1000 / 60 / 60) % 24;
  const day = Math.floor(ms / 1000 / 60 / 60 / 24);
  return `${day}d ${hr}h ${min}m ${sec}s`;
}