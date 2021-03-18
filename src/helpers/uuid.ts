/**
 * This is a quick and dirty uuid function I am implementing for time purposes.
 * This should not be used in production.
 * REFS: https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
 * */
export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
