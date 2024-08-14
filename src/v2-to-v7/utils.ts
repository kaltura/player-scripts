import {ConfigFromV2, MediaInfo} from './types'
import {parseFlashvars} from './flashvars';

export const getInfoFromV2Config = (config: any): ConfigFromV2 => {
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
  const flashvars = config['flashvars'];
  if (flashvars.hasOwnProperty('playlistAPI.kpl0Id')) {
    playlistId = flashvars['playlistAPI.kpl0Id'];
  } else if (flashvars.hasOwnProperty('playlistAPI') && flashvars['playlistAPI'].hasOwnProperty('kpl0Id')) {
    playlistId = flashvars['playlistAPI']['kpl0Id'];
  }

  return {
    id: playlistId,
    isPlaylist: true
  }
};

export const buildConfigFromFlashvars = (config: any): any => {
  if (config.hasOwnProperty('flashvars')) {
    const flashvars = config.flashvars;
    return parseFlashvars(flashvars);
  }

  return {};
};

const LOGGER_NAME = '[V2 To V7]';
export const logger = {
  log: (...args: any[]) => console.log(`${LOGGER_NAME}`, ...args)
};
