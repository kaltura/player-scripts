import {KalturaPlayer, Player, PlayerWindow} from '../types';
import {thumbnailEmbed} from '../thumbnail-embed';
import {ThumbnailEmbedOptions} from '../thumbnail-embed/thumbnail-embed';
import {buildConfigFromFlashvars, getConfigIdsFromV2Config, logger} from './utils/utils';
import {attachV7Listener} from './events-converter';
import {attachV2API} from './utils/api-converter';

declare let window: PlayerWindow;

const KalturaPlayer: KalturaPlayer = window.KalturaPlayer;

const attachV2Events = (targetId: string, kalturaPlayer: Player): void => {
  const playerDiv = document.getElementById(targetId);
  if (playerDiv) {
    (playerDiv as any).addJsListener = (eventName: string, callback: () => void) => {
      attachV7Listener({eventName, eventCallback: callback}, kalturaPlayer);
    };
  }
};

const v2PlayerEmbed = (v2Config: any) => {
  const {targetId, partnerId, mediaInfo} = getConfigIdsFromV2Config(v2Config);

  let config: any = {
    // TODO: remove log config when done
    log: {
      level: 'DEBUG'
    },
    targetId,
    provider: {
      partnerId
    }
  };

  const convertedFlashvars = buildConfigFromFlashvars(v2Config);
  const mergedConfig = Object.assign({}, config, convertedFlashvars);

  try {
    const kalturaPlayer: Player = KalturaPlayer.setup(mergedConfig);

    attachV2Events(targetId, kalturaPlayer);
    attachV2API(targetId);

    const entryId = mediaInfo.id;
    if (mediaInfo.isPlaylist) {
      kalturaPlayer.loadPlaylist({playlistId: entryId});
    } else {
      kalturaPlayer.loadMedia({entryId: entryId});
    }
  } catch (e) {
    logger.error('Failed to execute embed from V2 to V7.');
  }
};

const V2PlayerThumbEmbed = (v2Config: any) => {
  const {targetId, partnerId, mediaInfo} = getConfigIdsFromV2Config(v2Config);
  try {
    let config = {
      targetId,
      provider: {
        partnerId
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
    logger.error('Failed to execute thumbnail embed from V2 to V7.');
  }
};

export {v2PlayerEmbed, V2PlayerThumbEmbed};
