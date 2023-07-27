import { KalturaPlayer } from "./kaltura-player";

interface PlayerWindow extends Window {
    KalturaPlayer: KalturaPlayer;
    __kalturaplayerdata: {
        provider: {
            env: {
                cdnUrl: string;
            }
        }
    };
}

export {PlayerWindow};