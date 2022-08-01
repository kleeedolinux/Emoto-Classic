declare const container: HTMLElement;
declare const loading: HTMLElement;
declare const showAcertos: HTMLElement;
declare const showTentativas: HTMLElement;
declare const emotesList: Emote[];
declare var tentativas: number;
declare var emoteAtual: Emote;
declare var acertos: number;
declare const inputChannel: HTMLInputElement;
declare const inputEmote: HTMLInputElement;
interface Emote {
    name: string;
    image: string;
}
declare const getEmotesShow: (channel: string) => Promise<void>;
declare const getEmotesGame: (channel: string) => Promise<void>;
declare const gameplay: () => void;
declare const showEmote: (emote: Emote) => void;
declare const clear: (container: HTMLElement) => void;
