import {KalturaPlayer, Player, PlayerWindow} from '../types';
import {thumbnailEmbed} from '../thumbnail-embed';
import {ThumbnailEmbedOptions} from '../thumbnail-embed/thumbnail-embed';
import {buildConfigFromFlashvars, getInfoFromV2Config} from './utils';
import {attachV7Listener} from './events';
import {supportV2API} from './api';

declare let window: PlayerWindow;

const KalturaPlayer: KalturaPlayer = window.KalturaPlayer;

const supportV2Events = (targetId: string, kalturaPlayer: Player): void => {
  const playerDiv = document.getElementById(targetId);
  if (playerDiv) {
    (playerDiv as any).addJsListener = (eventName: string, callback: () => void) => {
      attachV7Listener({eventName, eventCallback: callback}, kalturaPlayer);
    };
  }
};

const embed = (v2Config: any) => {
  const {targetId, partnerId, mediaInfo} = getInfoFromV2Config(v2Config);

  let config: any = {
    log: {
      level: 'DEBUG'
    },
    targetId: targetId,
    provider: {
      partnerId: partnerId
    }
  };

  const convertedFlashvars = buildConfigFromFlashvars(v2Config);
  const mergedConfig = Object.assign({}, config, convertedFlashvars);

  try {
    const kalturaPlayer: Player = KalturaPlayer.setup(mergedConfig);

    supportV2Events(targetId, kalturaPlayer);
    supportV2API(targetId);

    const entryId = mediaInfo.id;
    if (mediaInfo.isPlaylist) {
      kalturaPlayer.loadPlaylist({playlistId: entryId});
    } else {
      kalturaPlayer.loadMedia({entryId: entryId});
    }
  } catch (e) {
    /* */
  }
};

const thumbEmbed = (v2Config: any) => {
  const {targetId, partnerId, mediaInfo} = getInfoFromV2Config(v2Config);
  try {
    let config = {
      targetId: targetId,
      provider: {
        partnerId: partnerId
      }
    };

    const convertedFlashvars = buildConfigFromFlashvars(v2Config);
    const mergedConfig = Object.assign({}, config, convertedFlashvars);

    const thumbnailEmbedConfig: ThumbnailEmbedOptions = {
      config: mergedConfig,
      mediaInfo: {
        entryId: mediaInfo.id
      }
    };
    thumbnailEmbed(thumbnailEmbedConfig, true);
  } catch (e) {
    /* */
  }
};

export {embed, thumbEmbed};
