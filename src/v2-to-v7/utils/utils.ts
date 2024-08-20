import {ConfigFromV2, MediaInfo} from '../types'

export const getConfigIdsFromV2Config = (config: any): ConfigFromV2 => {
  return {
    targetId: config['targetId'],
    partnerId: config['wid'].match(/\d+/g).join(''),
    mediaInfo: getMediaInfo(config)
  };
};

export const getMediaInfo = (config: any): MediaInfo => {
  if (config['entry_id']) {
    return {
      id: config['entry_id'],
      isPlaylist: false
    }
  }

  let playlistId = '';
  const flashvars = config.flashvars;

  if (flashvars.hasOwnProperty('playlistAPI.kpl0Id')) {
    playlistId = flashvars['playlistAPI.kpl0Id'];
  } else if (flashvars.playlistAPI?.kpl0Id) {
    playlistId = flashvars.playlistAPI.kpl0Id;
  }

  return {
    id: playlistId,
    isPlaylist: true
  }
};

const LOGGER_NAME = '[V2 To V7]';
export const logger = {
  log: (...args: any[]) => console.info(`${LOGGER_NAME}`, ...args),
  error: (...args: any[]) => console.error(`${LOGGER_NAME}`, ...args)
};

export const mergeDeep = (target: Record<string, any>, source: Record<string, any>): Record<string, any> => {
  const result = { ...target }; // Start with a shallow copy of the target

  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!result[key]) {
        result[key] = {};
      }
      result[key] = mergeDeep(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  });

  return result;
}
