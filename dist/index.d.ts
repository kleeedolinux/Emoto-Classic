declare const container: HTMLElement;
declare const loading: HTMLElement;
declare const emotesList: Emote[];
declare const inputChannel: HTMLInputElement;
declare const inputEmote: HTMLInputElement;
interface Emote {
    name: string;
    image: string;
}
declare const getEmotesShow: (channel: string) => Promise<void>;
declare const getEmotesGame: (channel: string) => Promise<void>;
declare const showEmote: (emote: Emote) => void;
declare const clear: (container: HTMLElement) => void;
