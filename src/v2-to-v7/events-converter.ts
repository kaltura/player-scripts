import {ListenerDetails} from './types';
import {Player} from '../types';
import {logger} from './utils/utils';

export const attachV7Listener = (listenerDetails: ListenerDetails, kalturaPlayer: Player) => {
  const { eventName, eventCallback } = listenerDetails;
  switch (eventName) {
    // PLAYBACK RELATED
    case 'mediaLoaded':
    case 'mediaReady':
      kalturaPlayer.addEventListener('medialoaded', () => {
        eventCallback();
      });
      break;
    case 'sourceReady':
    case 'playerReady':
      kalturaPlayer.addEventListener('sourceselected', () => {
        eventCallback();
      });
      break;
    case 'firstPlay':
      kalturaPlayer.addEventListener('firstplay', () => {
        eventCallback();
      });
      break;
    case 'playerPlayEnd':
    case 'playbackComplete':
      kalturaPlayer.addEventListener('playbackended', () => {
        eventCallback();
      });
      break;
    case 'durationChange':
      kalturaPlayer.addEventListener('durationchange', (event: any) => {
        eventCallback(event.currentTarget.duration);
      });
      break;
    case 'playerStateChange':
      kalturaPlayer.addEventListener('playerstatechanged', (event: any) => {
        eventCallback(event.payload.newState.type);
      });
      break;
    case 'playerUpdatePlayhead':
      kalturaPlayer.addEventListener('timeupdate', (event: any) => {
        eventCallback(event.currentTarget.currentTime);
      });
      break;
    case 'changeMediaProcessStarted':
      kalturaPlayer.addEventListener('changesourcestarted', (event: any) => {
        eventCallback(event.currentTarget.sources.id);
      });
      break;
    case 'metadataReceived':
      kalturaPlayer.addEventListener('loadedmetadata', () => {
        eventCallback();
      });
      break;
    case 'switchingChangeComplete':
      kalturaPlayer.addEventListener('videotrackchanged', (event: any) => {
        eventCallback({currentBitrate: event.payload.selectedVideoTrack.height});
      });
      break;
    case 'cuePointReached':
      kalturaPlayer.addEventListener('timedmetadatachange', (event: any) => {
        eventCallback(event.payload.cues);
      });
      break;
    case 'cuePointsReceived':
      kalturaPlayer.addEventListener('timedmetadataadded', (event: any) => {
        eventCallback(event.payload.cues);
      });
      break;

    // USER INTERACTIONS
    case 'userInitiatedPlay':
      kalturaPlayer.addEventListener('playkit-ui-userclickedplay', () => {
        eventCallback();
      });
      break;
    case 'userInitiatedPause':
      kalturaPlayer.addEventListener('playkit-ui-userclickedpause', () => {
        eventCallback();
      });
      break;
    case 'userInitiatedSeek':
      kalturaPlayer.addEventListener('playkit-ui-userseeked', () => {
        eventCallback();
      });
      break;

    // CORE FUNCTIONALITY
    case 'playerPaused':
      kalturaPlayer.addEventListener('pause', () => {
        eventCallback();
      });
      break;
    case 'playerPlayed':
      kalturaPlayer.addEventListener('play', () => {
        eventCallback();
      });
      break;
    case 'seek':
      kalturaPlayer.addEventListener('seeking', () => {
        eventCallback();
      });
      break;
    case 'seeked':
      kalturaPlayer.addEventListener('seeked', (event: any) => {
        eventCallback(event.currentTarget.currentTime);
      });
      break;
    case 'openFullScreen':
      kalturaPlayer.addEventListener('enterfullscreen', () => {
        eventCallback();
      });
      break;
    case 'closeFullScreen':
      kalturaPlayer.addEventListener('exitfullscreen', () => {
        eventCallback();
      });
      break;
    case 'volumeChanged':
      kalturaPlayer.addEventListener('volumechange', (event: any) => {
        const player = event.currentTarget;
        eventCallback(player.muted ? 0 : player.volume);
      });
      break;
    case 'mute':
      kalturaPlayer.addEventListener('mutechange', (event: any) => {
        if (event.currentTarget.muted) {
          eventCallback();
        }
      });
      break;
    case 'unmute':
      kalturaPlayer.addEventListener('mutechange', (event: any) => {
        if (!event.currentTarget.muted) {
          eventCallback();
        }
      });
      break;
    case 'closedCaptionsHidden':
      kalturaPlayer.addEventListener('texttrackchanged', (event: any) => {
        if (event.payload.selectedTextTrack.language === 'off') {
          eventCallback();
        }
      });
      break;
    case 'closedCaptionsDisplayed':
      kalturaPlayer.addEventListener('texttrackchanged', (event: any) => {
        const language = event.payload.selectedTextTrack.language;
        if (language !== 'off') {
          eventCallback(language);
        }
      });
      break;
    case 'changedClosedCaptions':
      kalturaPlayer.addEventListener('texttrackchanged', (event: any) => {
        eventCallback(event.payload.selectedTextTrack.language);
      });
      break;

    // PLAYLIST EVENTS:
    case 'playlistReady':
      kalturaPlayer.addEventListener('kaltura-player-playlistloaded', () => {
        eventCallback();
      });
      break;
    case 'playlistFirstEntry':
      kalturaPlayer.addEventListener('kaltura-player-playlistitemchanged', (event: any) => {
        if (event.payload.index === 0) {
          eventCallback();
        }
      });
      break;
    case 'playlistMiddleEntry':
      kalturaPlayer.addEventListener('kaltura-player-playlistitemchanged', (event: any) => {
        const lastIndex = event.currentTarget._playlistManager.items.length - 1;
        const currentIndex = event.payload.index;
        if (currentIndex > 0 && currentIndex < lastIndex) {
          eventCallback();
        }
      });
      break;
    case 'playlistLastEntry':
      kalturaPlayer.addEventListener('kaltura-player-playlistitemchanged', (event: any) => {
        const lastIndex = event.currentTarget._playlistManager.items.length - 1;
        if (event.payload.index === lastIndex) {
          eventCallback();
        }
      });
      break;

    // PLUGINS
    case 'pluginsLoaded':
      kalturaPlayer.addEventListener('registeredpluginslistevent', (event: any) => {
        eventCallback(event.payload);
      });
      break;
    case 'relatedVideoSelect':
      kalturaPlayer.addEventListener('related_entry_selected', (event: any) => {
        eventCallback({entryId: event.currentTarget._mediaInfo.entryId});
      });
      kalturaPlayer.addEventListener('related_entry_auto_played', (event: any) => {
        eventCallback({entryId: event.currentTarget._mediaInfo.entryId});
      });
      break;

    // ERRORS
    case 'entryNotAvailable':
      kalturaPlayer.addEventListener('error', (event: any) => {
        const errorCategory = event.payload.category;
        if ([12, 13, 14].includes(errorCategory) || (errorCategory === 7 && event.payload.code === 7002)) {
          /*
          category 12: MEDIA_NOT_READY
          category 13: GEO_LOCATION
          category 14: MEDIA_UNAVAILABLE
          category 7 and code 7002: media load failure
          */
          eventCallback();
        }
      });
      break;
    case 'mediaError':
      kalturaPlayer.addEventListener('error', (event: any) => {
        const errorCategory = event.payload.category;
        if (errorCategory === 3) {
          // category 3: MEDIA error
          eventCallback();
        }
      });
      break;
    default:
      logger.log(`The event: '${eventName}' is not supported.`);
      break;
  }
}