import {ThumbnailEmbedComponent} from './thumbnail-embed-component';
import {KalturaPlayer, Player, PlayerWindow} from '../types';

interface ThumbnailEmbedOptions {
  config: any;
  mediaInfo: any;
  mediaOptions: any;
  version: number;
  bgColor: string;
}

const DEFAULT_CDN_URL = 'https://cdnapisec.kaltura.com';
const DEFAULT_VERSION = 10000;
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

const thumbnailEmbed = ({config, mediaInfo, mediaOptions = {}, version = DEFAULT_VERSION, bgColor}: ThumbnailEmbedOptions) => {
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

  let width = DEFAULT_WIDTH;
  let height = DEFAULT_HEIGHT;

  if (playerDiv.clientWidth && playerDiv.clientHeight) {
    width = playerDiv.clientWidth;
    height = playerDiv.clientHeight;
  }

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
