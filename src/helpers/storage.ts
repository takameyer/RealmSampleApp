import AsyncStorage from '@react-native-community/async-storage';

/**
 * NOTE: I put this in as a helper so that it could be easily mocked.
 * @param key key for the stored data
 */
export async function getStoredData(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function storeData(key: string, data: string) {
  return AsyncStorage.setItem(key, data);
}
