import Config from 'react-native-config';

/**
 * Unfortunately the simulators/devices cannot just talk to localhost.  They each have their own ip address that wil
 * be used for this. Therefor this must be configured by an env file.  But this is better, as in production we would
 * set this to an external url.
 */
export const syncServerUrl = () => {
  return Config?.SYNC_SERVER_URL ?? 'http://localhost:3000';
};
