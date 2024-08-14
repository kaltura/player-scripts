interface Player {
    play(): unknown;
    loadMedia: (...args: any[]) => void;
    loadPlaylist: (...args: any[]) => void;
    addEventListener: (...args: any[]) => void;
    poster: string;
    env: any;
    destroy: () => void;
}

export {Player};