/**
 * Simple function for getting a timestamp.
 * I decided to place it in a helper function so that it is easily mocked.
 */
export function getTimeStamp(): number {
  return Math.floor(Date.now() / 1000);
}
