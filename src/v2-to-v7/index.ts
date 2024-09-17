import {v2PlayerEmbed, V2PlayerThumbEmbed} from './embeds-converter';
import {buildV7Config} from './utils/flashvars-handler';


(window as any).kWidget = {
  embed: v2PlayerEmbed,
  thumbEmbed: V2PlayerThumbEmbed
};

(window as any).__buildV7Config = buildV7Config;

export {v2PlayerEmbed, V2PlayerThumbEmbed, buildV7Config};
