interface MediaInfo {
  id: string;
  isPlaylist: boolean;
}

interface ConfigFromV2 {
  targetId: string;
  partnerId: string;
  mediaInfo: MediaInfo;
}

interface DefaultConfig {
  log?: any;
  text?: any;
  playback?: any;
  streaming?: any;
  abr?: any;
  drm?: any;
  network?: any;
  plugins?: any;
}

interface ListenerDetails {
  eventName: string;
  eventCallback: (...args: any[]) => void;
}

export {MediaInfo, ConfigFromV2, DefaultConfig, ListenerDetails};
