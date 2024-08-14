import {DefaultConfig} from '../types';

export const addFlashvarsToConfig = (flashvars: any, config: DefaultConfig): DefaultConfig => {
  if (flashvars.hasOwnProperty('autoPlay')) {
    config.playback.autoplay = flashvars['autoPlay'];
  }
  return config;
}