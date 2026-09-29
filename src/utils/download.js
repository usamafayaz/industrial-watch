import {File, Paths} from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Downloads a file into the app cache and opens the share sheet so the
// user can save it (replaces rn-fetch-blob's Android DownloadManager).
export const downloadAndShare = async (url, fileName, mimeType) => {
  const destination = new File(Paths.cache, fileName);
  if (destination.exists) {
    destination.delete();
  }
  const file = await File.downloadFileAsync(url, destination);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {mimeType, dialogTitle: fileName});
  }
  return file;
};
