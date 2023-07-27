import {ThumbnailEmbedComponent} from './thumbnail-embed-component';
import {KalturaPlayer, Player, PlayerWindow} from '../../types';

interface ThumbnailEmbedOptions {
  config: any;
  mediaInfo: any;
  mediaOptions: any;
  width: number;
  height: number;
  version: number;
}

const DEFAULT_CDN_URL = 'https://cdnapisec.kaltura.com';
const DEFAULT_VERSION = 10000;

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

const thumbnailEmbed = ({config, mediaInfo, mediaOptions = {}, width, height, version = DEFAULT_VERSION}: ThumbnailEmbedOptions) => {
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

  const src =
    `${cdnUrl.endsWith('/') ? cdnUrl : cdnUrl + '/'}` +
    `p/${partnerId}` +
    `/sp/${partnerId}00` +
    '/thumbnail' +
    `/entry_id/${mediaInfo.entryId}` +
    `/version/${version}` +
    (ks ? `/ks/${ks}` : '') +
    (width ? `/width/${width}` : '') +
    (height ? `/height/${height}` : '');

  const {h, render} = KalturaPlayer.ui.preact;

  render(
    h(
      'div',
      {style: 'position: relative; width: fit-content; margin:auto'},
      h(ThumbnailEmbedComponent, {
        src,
        onClick: () => {
          try {
            const kalturaPlayer: Player = KalturaPlayer.setup(config);
            kalturaPlayer.loadMedia(mediaInfo, mediaOptions);
          } catch (e) {
            /* */
          }
        }
      })
    ),
    playerDiv
  );
};

export {thumbnailEmbed};
