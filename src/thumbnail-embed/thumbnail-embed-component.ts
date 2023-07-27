import {KalturaPlayer, PlayerWindow} from '../types';

interface ThumbnailEmbedComponentProps {
  onClick: () => void;
  src: string;
}

declare let window: PlayerWindow;

const ThumbnailEmbedComponent = ({onClick: handleClick, src}: ThumbnailEmbedComponentProps) => {
  const KalturaPlayer: KalturaPlayer = window.KalturaPlayer;

  const {Button, Icon, IconType} = KalturaPlayer.ui.components;
  const {h} = KalturaPlayer.ui.preact;
  const {useRef, useState, useCallback} = KalturaPlayer.ui.preactHooks;

  const onClick = useCallback(() => {
    handleClick();
    setIsVisible(false);
  });

  const onLoad = useCallback(() => {
    setIsLoaded(true);
  });

  const ref = useRef();

  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  return !isVisible
    ? undefined
    : h(
        'div',
        null,
        h('img', {src: src, ref, onLoad, onError: onClick}),
        !isLoaded
          ? undefined
          : h(
              'div',
              {className: KalturaPlayer.ui.style.prePlaybackPlayOverlay},
              h(
                Button,
                {
                  className: KalturaPlayer.ui.style.prePlaybackPlayButton,
                  tabIndex: 0,
                  onClick
                },
                h(Icon, {type: IconType.Play})
              )
            )
      );
};

export {ThumbnailEmbedComponent};
