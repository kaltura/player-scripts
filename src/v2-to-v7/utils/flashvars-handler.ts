import {mergeDeep} from "./utils";

/**
 * A key mapping, where the key is the V2 flashvar configuration name and the value is the corresponding V7 configuration path.
 */
const flashvarsKeyMapping: Record<string, string> = {
  "ks": "provider.ks",
  "localizationCode": "ui.locale",
  "EmbedPlayer.EnableIpadNativeFullscreen": "playback.inBrowserFullscreen",
  "EmbedPlayer.WebKitPlaysInline": "playback.playsinline",
  "autoPlay": "playback.autoplay",
  "applicationName": "plugins.kava.application",
  "playbackContext": "plugins.kava.playbackContext",
  "autoMute": "playback.muted",
  "uiconf_id": "provider.uiConfId",
  "thumbnailUrl": "sources.poster",
  "loop": "playback.loop",
  "closedCaptions.displayCaptions": "playback.captionsDisplay",
  "autoPlayFallbackToMute": "playback.allowMutedAutoPlay",
  "playlistAPI.autoContinue": "playlist.options.autoContinue",
  "loadThumbnailWithKs": "provider.loadThumbnailWithKs",
  "closedCaptions.defaultLanguageKey": "playback.textLanguage",
  "preload": "playback.preload",
  "qna.containerPosition": "qna.position",
  "qna.userId": "qna.userId",
  "qna.userRole": "qna.userRole",
  "watermark.watermarkPath": "ui.components.watermark.url",
  "mediaProxy.mediaPlayFrom": "sources.startTime",
  "playlistAPI.initItemEntryId": "playlist.options.startAtEntryId"
};

const PLAYBACK_RATE_SELECTOR_SPEEDS = 'playbackRateSelector.speeds';
const YOUBORA_USERNAME = 'youbora.username';

/**
 * Gets the V7 configuration, based on the V2 flashvars.
 */
export const getConfigFromFlashvars = (flashvars: Record<string,any>): Record<string,any> => {
  if (!flashvars || Object.keys(flashvars).length === 0) {
    return {};
  }

  const flatFlashvars = flattenToDotNotation(flashvars);
  return buildConfigFromFlashvars(flatFlashvars);
};

/**
 * Builds the V7 configuration object according to the V2 flashvars.
 */
export const buildConfigFromFlashvars = (flashvars: Record<string, any>): Record<string, any> => {
  const config: Record<string, any> = initializeConfig(flashvars);

  Object.keys(flashvars).forEach(key => {
    const mappedPath = flashvarsKeyMapping[key];

    if (mappedPath) {
      const newKeyPathParts = mappedPath.split('.');
      let current = config;

      newKeyPathParts.forEach((newKey, index) => {
        if (index === newKeyPathParts.length - 1) {
          const value = flashvars[key];
          current[newKey] = value === "true" || value === "false" ? JSON.parse(value) : value;
        } else {
          if (!current[newKey]) {
            current[newKey] = {};
          }
          current = current[newKey];
        }
      });
    }
  });

  return config;
};

/**
 * Initializes the V7 configuration object with some V2 flashvars that require specific attention.
 */
const initializeConfig = (flashvars: Record<string, any>): Record<string, any> => {
  let config: Record<string, any> = {};

  if (typeof flashvars[PLAYBACK_RATE_SELECTOR_SPEEDS] === 'string') {
    config = {
      playback: {
        playbackRates: flashvars[PLAYBACK_RATE_SELECTOR_SPEEDS].split(",").map((speed: string) => Number(speed))
      }
    };
  }

  if (flashvars[YOUBORA_USERNAME]) {
    config = {
      ...config,
      plugins: {
        youbora: {
          options: {
            'user.name': flashvars[YOUBORA_USERNAME]
          }
        }
      }
    };
  }

  return config;
}

/**
 * Converts a nested object to a dot notation object.
 */
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

export const buildV7Config = (flashvars: Record<string, any>, v7Config: any): Record<string, any> => {
  const configFromFlashvars = getConfigFromFlashvars(flashvars);
  return mergeDeep(configFromFlashvars, v7Config);
}
