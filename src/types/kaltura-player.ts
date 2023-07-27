import { Player } from "./player";

interface KalturaPlayer {
    getPlayer: (targetId: string) => Player;
    setup(config: any): Player;
    ui: {
      style: any;
      preact: { h: any; render: any; };
      preactHooks: { useRef: any; useState: any; useCallback: any; };
      components: any;
    }
  }

  export {KalturaPlayer};