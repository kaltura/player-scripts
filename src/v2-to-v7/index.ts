import {v2PlayerEmbed, V2PlayerThumbEmbed} from './embeds-converter';

(window as any).kWidget = {
  embed: v2PlayerEmbed,
  thumbEmbed: V2PlayerThumbEmbed
};

export {v2PlayerEmbed, V2PlayerThumbEmbed};