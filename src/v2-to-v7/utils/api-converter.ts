import {Player} from '../../types';
import {logger} from './utils';

const isMobileDevice = (ua: string): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

const isIOS = (ua: string): boolean => {
  return /iPad|iPhone|iPod/i.test(ua);
};

const getPlayer = (targetId: string): Player | undefined => {
  return (window as any).KalturaPlayer.getPlayer(targetId);
};

const addKWidgetAPI = (targetId: string): void => {
  const ua: string = window.navigator?.userAgent;
  if (!ua) {
    logger.log('User agent is not available; Not adding kWidget API.');
    return;
  }

  (window as any).kWidget = {
    ...(window as any).kWidget,
    getKalturaThumbUrl: () => getPlayer(targetId)?.poster || '',
    isMobileDevice: () => getPlayer(targetId)?.env.isMobile || isMobileDevice(ua),
    supportsHTML5: () => true,
    supportsFlash: () => false,
    isIOS: () => getPlayer(targetId)?.env.isIOS || isIOS(ua),
    isIE: () => false,
    isIE8: () => false,
    isAndroid: () => /Android/i.test(ua),
    isWindowsDevice: () => /Windows/i.test(ua),
    destroy: () => getPlayer(targetId)?.destroy() || {},
    api: () => {},
    apiOptions: () => {},
    settingsObject: () => {},
    jsCallbackReady: () => {}
  };

  logger.log('Finished adding kWidget API.');
};

const addAPIToPlayerElement = (targetId: string): void => {
  const playerDiv = document.getElementById(targetId);
  if (!playerDiv) {
    logger.log('Player element is not available; Not adding V2 API.');
    return;
  }

  const playerEl = playerDiv as any;

  // The purpose of adding the following api functions is to prevent console errors
  playerEl.sendNotification = () => {};
  playerEl.kBind = () => {};
  playerEl.kUnbind = () => {};
  playerEl.evaluate = () => {};
  playerEl.setKDPAttribute = () => {};
  playerEl.removeJsListener = () => {};

  logger.log('Finished adding V2 API to the player element.');
};

export const attachV2API = (targetId: string) => {
  logger.log('Adding support to V2 API');
  addKWidgetAPI(targetId);
  addAPIToPlayerElement(targetId);
};
