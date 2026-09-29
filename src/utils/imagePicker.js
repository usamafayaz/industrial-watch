import * as ImagePicker from 'expo-image-picker';

// Adapter that keeps the react-native-image-picker callback API
// (launchCamera / launchImageLibrary) on top of expo-image-picker.
const toExpoOptions = (options = {}) => {
  const limit = options.selectionLimit ?? 1;
  return {
    mediaTypes: options.mediaType === 'video' ? ['videos'] : ['images'],
    quality: options.quality ?? 1,
    base64: !!options.includeBase64,
    allowsMultipleSelection: limit !== 1,
    selectionLimit: limit,
  };
};

const toLegacyResponse = result => {
  if (result.canceled) {
    return {didCancel: true};
  }
  return {
    assets: result.assets.map(asset => ({
      uri: asset.uri,
      fileName: asset.fileName ?? asset.uri.split('/').pop(),
      type: asset.mimeType ?? 'image/jpeg',
      width: asset.width,
      height: asset.height,
      base64: asset.base64,
    })),
  };
};

const run = async (launch, requestPermission, options, callback) => {
  try {
    const permission = await requestPermission();
    if (!permission.granted) {
      callback?.({errorCode: 'permission', errorMessage: 'Permission denied'});
      return;
    }
    const result = await launch(toExpoOptions(options));
    callback?.(toLegacyResponse(result));
  } catch (error) {
    callback?.({errorCode: 'others', errorMessage: error.message});
  }
};

export const launchCamera = (options, callback) =>
  run(
    ImagePicker.launchCameraAsync,
    ImagePicker.requestCameraPermissionsAsync,
    options,
    callback,
  );

export const launchImageLibrary = (options, callback) =>
  run(
    ImagePicker.launchImageLibraryAsync,
    ImagePicker.requestMediaLibraryPermissionsAsync,
    options,
    callback,
  );
