const flashvarsKeyMapping: Record<string, string> = {
  "ks": "provider.ks",
  "localizationCode": "ui.locale",
  "EmbedPlayer.EnableIpadNativeFullscreen": "playback.inBrowserFullscreen",
  "EmbedPlayer.WebKitPlaysInline": "playback.playsinline",
  "autoPlay": "playback.autoplay"
};

export const getConfigFromFlashvars = (flashvars: Record<string,any>): Record<string,any> => {
  if (!flashvars || Object.keys(flashvars).length === 0) {
    return {};
  }

  const flatFlashvars = flattenDotNotationFlashvarsToNestedObject(flashvars || {});
  return buildConfigFromFlashvars(flatFlashvars);
};

export const buildConfigFromFlashvars = (flashvars: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};

  const recursiveMap = (currentObj: Record<string, any>, parentKey: string = '') => {
    Object.keys(currentObj).forEach(key => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      const mappedPath = flashvarsKeyMapping[fullKey];

      if (mappedPath) {
        const newKeyPath = mappedPath.split('.');
        let current = result;

        newKeyPath.forEach((newKey, index) => {
          if (index === newKeyPath.length - 1) {
            current[newKey] = currentObj[key];
          } else {
            if (!current[newKey]) {
              current[newKey] = {};
            }
            current = current[newKey];
          }
        });
      } else if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
        recursiveMap(currentObj[key], fullKey);
      }
    });
  }

  recursiveMap(flashvars);
  return result;
};

const flattenDotNotationFlashvarsToNestedObject = (flashvars: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};

  Object.keys(flashvars).forEach(fullKey => {
    const keys = fullKey.split('.');
    let current = result;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        // if it's the last key, set the value
        current[key] = flashvars[fullKey];
      } else {
        // Otherwise, initialize an empty object if it doesn't exist
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    });
  });

  return result;
};
