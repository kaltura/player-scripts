import {KalturaPlayer, Player, PlayerWindow} from '../types';
import {thumbnailEmbed} from '../thumbnail-embed';
import {ThumbnailEmbedOptions} from '../thumbnail-embed/thumbnail-embed';
import {getConfigIdsFromV2Config, logger, mergeDeep} from './utils/utils';
import {attachV7Listener} from './events-converter';
import {attachV2API} from './utils/api-converter';
import {getConfigFromFlashvars} from './utils/flashvars-handler';
import {Callback} from './types';

declare let window: PlayerWindow;

const KalturaPlayer: KalturaPlayer = window.KalturaPlayer;

const attachV2Events = (targetId: string, kalturaPlayer: Player): void => {
  const playerDiv = document.getElementById(targetId);
  if (playerDiv) {
    const attachListener = (eventName: string, callback: () => void) => {
      attachV7Listener({eventName, eventCb: callback}, kalturaPlayer);
    };
    (playerDiv as any).addJsListener = attachListener;
    (playerDiv as any).kBind = attachListener
  }
};

const addClassNameToParent = (targetId: string): void => {
  // add kWidgetIframeContainer className to the parent element for kms styling purposes
  document.getElementById(targetId)?.classList.add('kWidgetIframeContainer');
};

// Handle addReadyCallback API for when invoked before and after embed happened
let globalTargetId: string | undefined = undefined;
let readyCallbacks: Callback[] = [];
const addReadyCallback = (cb: Callback) => {
  globalTargetId ? cb(globalTargetId) : readyCallbacks.push(cb);
};

const v2PlayerEmbed = (v2Config: any) => {
  const {targetId, partnerId, mediaInfo} = getConfigIdsFromV2Config(v2Config);
  globalTargetId = targetId;

  let config: any = {
    targetId,
    provider: {
      partnerId
    }
  };

  const convertedFlashvars = getConfigFromFlashvars(v2Config.flashvars);
  const mergedConfig = mergeDeep(config, convertedFlashvars);

  addClassNameToParent(targetId);

  try {
    const kalturaPlayer: Player = KalturaPlayer.setup(mergedConfig);

    attachV2Events(targetId, kalturaPlayer);
    attachV2API(targetId);
    readyCallbacks.forEach((cb: Callback) => cb(targetId));

    const entryId = mediaInfo.id;
    if (mediaInfo.isPlaylist) {
      kalturaPlayer.loadPlaylist({playlistId: entryId});
    } else {
      kalturaPlayer.loadMedia({entryId: entryId});
    }
  } catch (e) {
    logger.error('Failed to execute embed from V2 to V7.', e);
  }
};

const V2PlayerThumbEmbed = (v2Config: any) => {
  const {targetId, partnerId, mediaInfo} = getConfigIdsFromV2Config(v2Config);
  globalTargetId = targetId;
  try {
    let config = {
      targetId,
      provider: {
        partnerId
      }
    };

    const convertedFlashvars = getConfigFromFlashvars(v2Config.flashvars);
    const mergedConfig = mergeDeep(config, convertedFlashvars);

    addClassNameToParent(targetId);

    const thumbnailEmbedConfig: ThumbnailEmbedOptions = {
      config: mergedConfig,
      mediaInfo: {
        entryId: mediaInfo.id
      }
    };
    thumbnailEmbed(thumbnailEmbedConfig, true, readyCallbacks);
  } catch (e) {
    logger.error('Failed to execute thumbnail embed from V2 to V7.', e);
  }
};

export {v2PlayerEmbed, V2PlayerThumbEmbed, addReadyCallback};
