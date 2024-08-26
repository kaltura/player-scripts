import {v2PlayerEmbed, V2PlayerThumbEmbed} from './embeds-converter';
import {buildConfigFromFlashvars} from './utils/flashvars-handler';

(window as any).kWidget = {
  embed: v2PlayerEmbed,
  thumbEmbed: V2PlayerThumbEmbed
};

(window as any).__buildConfigFromFlashvars = buildConfigFromFlashvars;

export {v2PlayerEmbed, V2PlayerThumbEmbed, buildConfigFromFlashvars};