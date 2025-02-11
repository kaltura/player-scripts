import {Callback, ListenerDetails} from './types';
import {Player} from '../types';
import {logger} from './utils/utils';

/**
 * A key mapping, where the key is the V2 event name and the value is the corresponding V7 event name.
 */
const eventsKeyMapping: Record<string, string> = {
  // playback
  "mediaLoaded": "medialoaded",
  "mediaReady": "medialoaded",
  "sourceReady": "sourceselected",
  "playerReady": "sourceselected",
  "firstPlay": "firstplay",
  "playerPlayEnd": "playbackended",
  "playbackComplete": "playbackended",
  "metadataReceived": "loadedmetadata",
  // user interaction
  "userInitiatedPlay": "playkit-ui-userclickedplay",
  "userInitiatedPause": "playkit-ui-userclickedpause",
  "userInitiatedSeek": "playkit-ui-userseeked",
  // core functionality
  "playerPaused": "pause",
  "playerPlayed": "play",
  "seek": "seeking",
  "openFullScreen": "playkit-ui-userenteredfullscreen",
  "closeFullScreen": "playkit-ui-userexitedfullscreen",
  // playlist
  "playlistReady": "kaltura-player-playlistloaded",
};

const convertEventCallbackToFunction = (eventCb: string): Callback => {
  const funcPathParts = eventCb.split('.');
  let func: any = window;
  for (let part of funcPathParts) {
    func = func[part];
  }
  return func;
};

export const attachV7Listener = (listenerDetails: ListenerDetails, kalturaPlayer: Player) => {
  const { eventName, eventCb } = listenerDetails;

  // event callback can be a string that represents the path to the callback function - convert it to function
  const eventCallback: Callback = typeof eventCb === 'string' ? convertEventCallbackToFunction(eventCb) : eventCb;

  if (eventsKeyMapping[eventName]) {
    kalturaPlayer.addEventListener(eventsKeyMapping[eventName], () => {
      eventCallback();
    });
  } else {
    switch (eventName) {
      // PLAYBACK
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

      // CORE FUNCTIONALITY
      case 'seeked':
        kalturaPlayer.addEventListener('seeked', (event: any) => {
          eventCallback(event.currentTarget.currentTime);
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

      // PLAYLIST EVENTS
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

      // ANNOTO
      case 'annotoPluginReady':
        kalturaPlayer.addEventListener('annotoPluginReady', () => {
          eventCallback();
        });
        break;
      case 'annotoPluginSetup':
        kalturaPlayer.addEventListener('annotoPluginSetup', () => {
          eventCallback();
        });
        break;
      case 'QuizSubmitted':
        kalturaPlayer.addEventListener('QuizSubmitted', (event: any) => {
          eventCallback(event.payload);
        });
        break;
      default:
        logger.log(`The event: '${eventName}' is not supported.`);
        break;
    }
  }
}
