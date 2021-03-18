import base64 from 'base-64';
import {syncServerUrl} from 'config';

/**
 * NOTE: in both of these functions I am catching network errors and sending a warning.  This will allow the app to continue
 * to function even if the sync server is not responding.
 */

/**
 * This function will push the current data to the sync server.  It is sending the udpatedAt time, as this could be different
 * than when it is actually stored in the server.  This prevents an endless loop of syncing to data that was just pushed.
 *
 * I have isolated the base64 encoding to this function.
 *
 * @param dataString this should just be stringified JSON
 * @param updatedAt this should be the stores last update date
 */
export async function pushSyncData(dataString: string, updatedAt: number) {
  const url = `${syncServerUrl()}/sync`;
  const encodedData = base64.encode(dataString);
  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: encodedData,
        updatedAt: updatedAt,
      }),
    });
    if (result.status !== 200) {
      console.warn('There is a problem updating: ', result);
    }
  } catch (error) {
    console.warn(
      'There was an issue communicating with the sync server',
      error,
    );
  }
}

type SyncResult = {
  data: string;
  isNewer: boolean;
};

/**
 * This function will check for new data from the sync server.   UpdatedAt is being sent so that the server can
 * respond with a flag if the data that is stored is newer.  In any case, it will not provide data if it is not newer
 * and just return an empty string.
 *
 * I am using an empty string in combination with the isNewer flag to know if we should overwrite the store.
 *
 * @param updatedAt
 */
export async function retrieveSyncData(updatedAt: number): Promise<SyncResult> {
  const url = `${syncServerUrl()}/sync?updatedAt=${updatedAt}`;
  try {
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (result.status !== 200) {
      console.warn('There is a problem reading from the sync server: ', result);
      return {data: '', isNewer: false};
    }
    try {
      const {data, isNewer} = await result.json();
      if (data != null && isNewer != null) {
        const decodedData = base64.decode(data);
        return {data: decodedData, isNewer};
      }
    } catch (error) {
      console.warn('Data corruption issue with sync server: ', result);
    }
  } catch (error) {
    console.warn(
      'There was an issue communicating with the sync server',
      error,
    );
  }
  return {data: '', isNewer: false};
}
