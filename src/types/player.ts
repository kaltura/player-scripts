interface Player {
    play(): unknown;
    loadMedia: (...args: any[]) => void;
}

export {Player};