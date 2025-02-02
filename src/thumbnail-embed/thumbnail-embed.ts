import {ThumbnailEmbedComponent} from './thumbnail-embed-component';
import {KalturaPlayer, Player, PlayerWindow} from '../types';
import {ListenerDetails, Callback} from '../v2-to-v7/types';
import {attachV7Listener} from '../v2-to-v7/events-converter';
import {attachV2API} from '../v2-to-v7/utils/api-converter';

export interface ThumbnailEmbedOptions {
  config: any;
  mediaInfo: any;
  mediaOptions?: any;
  version?: number;
  bgColor?: string;
}

const DEFAULT_CDN_URL = 'https://cdnapisec.kaltura.com';
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

declare let window: PlayerWindow;

const getCdnUrl = (config: any) => {
  if (config.provider.env?.cdnUrl) {
    return config.provider.env?.cdnUrl;
  }

  const uiConfData = window.__kalturaplayerdata;
  if (uiConfData) {
    return uiConfData.provider?.env?.cdnUrl;
  }

  return DEFAULT_CDN_URL;
};

const thumbnailEmbed = ({config, mediaInfo, mediaOptions = {}, version, bgColor}: ThumbnailEmbedOptions, isV2ToV7 = false, readyCallbacks: Callback[] = []) => {
  if (!(config && mediaInfo)) {
    return;
  }

  const cdnUrl = getCdnUrl(config);

  const {
    targetId,
    provider: {partnerId, ks}
  } = config;

  const KalturaPlayer: KalturaPlayer = window.KalturaPlayer;

  var playerDiv = document.getElementById(targetId);
  if (!playerDiv || !KalturaPlayer || (KalturaPlayer.getPlayer && KalturaPlayer.getPlayer(targetId))) {
    return;
  }

  let listenersQueue: ListenerDetails[] = [];
  if (isV2ToV7) {
    const addListenerToQueue = (eventName: string, callback: () => void) => {
      listenersQueue.push({eventName, eventCallback: callback});
    };
    (playerDiv as any).addJsListener = addListenerToQueue;
    (playerDiv as any).kBind = addListenerToQueue;
    attachV2API(targetId);
    readyCallbacks.forEach(cb => cb(targetId));
  }

  let width = DEFAULT_WIDTH;
  let height = DEFAULT_HEIGHT;

  if (playerDiv.clientWidth && playerDiv.clientHeight) {
    width = playerDiv.clientWidth;
    height = playerDiv.clientHeight;
  }

  const resizeObserver = new ResizeObserver(() => {
    if(playerDiv) {
      playerDiv.dispatchEvent(new KalturaPlayer.core.FakeEvent(KalturaPlayer.core.EventType.RESIZE));
    }
  });
  
  resizeObserver.observe(playerDiv);

  const src =
    `${cdnUrl.endsWith('/') ? cdnUrl : cdnUrl + '/'}` +
    `p/${partnerId}` +
    `/sp/${partnerId}00` +
    '/thumbnail' +
    `/entry_id/${mediaInfo.entryId}` +
    `/version/${version}` +
    `/width/${width}` +
    `/height/${height}` +
    (ks ? `/ks/${ks}` : '')

  const {h, render} = KalturaPlayer.ui.preact;

  render(
      h(ThumbnailEmbedComponent, {
        src,
        bgColor,
        onClick: () => {
          try {
            const kalturaPlayer: Player = KalturaPlayer.setup(config);
            listenersQueue.forEach((listenerDetails: ListenerDetails) => attachV7Listener(listenerDetails, kalturaPlayer));
            kalturaPlayer.loadMedia(mediaInfo, mediaOptions);
            kalturaPlayer.play();
          } catch (e) {
            /* */
          }
        }
      })
    ,
    playerDiv
  );
};

export {thumbnailEmbed};
