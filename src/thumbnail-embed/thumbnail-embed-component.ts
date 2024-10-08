import {KalturaPlayer, PlayerWindow} from '../types';

interface ThumbnailEmbedComponentProps {
  onClick: () => void;
  src: string;
  bgColor: string;
}

const DEFAULT_BG_COLOR = "#000";

declare let window: PlayerWindow;

const ThumbnailEmbedComponent = ({onClick: handleClick, src, bgColor=DEFAULT_BG_COLOR}: ThumbnailEmbedComponentProps) => {
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

  const onError = useCallback(() => {
    setIsLoaded(true);
    setIsEmpty(true);
  });

  const ref = useRef();

  const [isVisible, setIsVisible] = useState(true);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  return !isVisible ? undefined : h(
        'div',
        {style: {width: "100%", height: "100%", position: "relative", backgroundColor: isEmpty ? bgColor : DEFAULT_BG_COLOR}},
        isEmpty ? undefined : h('img', {src: src, ref, onLoad, onError, style: {width: "100%", height: "100%", "object-fit": "contain"}}),
        !isLoaded
          ? undefined
          : h(
              'div',
              {className: KalturaPlayer.ui.style.prePlaybackPlayOverlay, style: {width: "100%", height: "100%"}},
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
