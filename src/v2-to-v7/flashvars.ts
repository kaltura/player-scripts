import {DefaultConfig} from './types';

export const parseFlashvars = (flashvars: any): DefaultConfig => {
  let config: DefaultConfig = {
    log: {},
    text: {},
    playback: {},
    streaming: {},
    abr: {},
    drm: {},
    network: {},
    plugins: {}
  };

  if (flashvars.hasOwnProperty('autoPlay')) {
    config.playback.autoplay = flashvars['autoPlay'];
  }

  return config;
}