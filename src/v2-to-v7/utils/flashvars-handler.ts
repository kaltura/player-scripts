const flashvarsKeyMapping: Record<string, string> = {
  "ks": "provider.ks",
  "localizationCode": "ui.locale",
  "EmbedPlayer.EnableIpadNativeFullscreen": "playback.inBrowserFullscreen",
  "EmbedPlayer.WebKitPlaysInline": "playback.playsinline",
  "autoPlay": "playback.autoplay",
  "applicationName": "plugins.kava.application",
  "playbackContext": "plugins.kava.playbackContext",
  "autoMute": "playback.muted",
  "uiconf_id": "provider.uiConfId"
};

export const getConfigFromFlashvars = (flashvars: Record<string,any>): Record<string,any> => {
  if (!flashvars || Object.keys(flashvars).length === 0) {
    return {};
  }

  const flatFlashvars = flattenToDotNotation(flashvars);
  return buildConfigFromFlashvars(flatFlashvars);
};

export const buildConfigFromFlashvars = (flashvars: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};

  Object.keys(flashvars).forEach(key => {
    const mappedPath = flashvarsKeyMapping[key];

    if (mappedPath) {
      const newKeyPath = mappedPath.split('.');
      let current = result;

      newKeyPath.forEach((newKey, index) => {
        if (index === newKeyPath.length - 1) {
          current[newKey] = flashvars[key];
        } else {
          if (!current[newKey]) {
            current[newKey] = {};
          }
          current = current[newKey];
        }
      });
    }
  });

  return result;
};

const flattenToDotNotation = (obj: Record<string, any>, parentKey = '', result: Record<string, any> = {}): Record<string, any> => {
  Object.keys(obj).forEach(key => {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenToDotNotation(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  });

  return result;
};
