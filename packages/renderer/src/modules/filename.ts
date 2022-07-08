export function getFilename() {
  const [date, time] = new Date().toISOString().split('T');
  const timeStr = time.replace(/\.\d{3}Z$/, '').replace(/:/g, '');
  return `${date}-${timeStr}`;
}
