import { ThumbnailEmbedComponent } from "./thumbnail-embed-component";
import { thumbnailEmbed } from './thumbnail-embed';

(window as any).__thumbnailEmbed = thumbnailEmbed;  

export {thumbnailEmbed, ThumbnailEmbedComponent};