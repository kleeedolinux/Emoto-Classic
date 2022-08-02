declare const container: HTMLElement;
declare const loading: HTMLElement;
declare const showAcertos: HTMLElement;
declare const showTentativas: HTMLElement;
declare const autocompleteWrapper: HTMLElement;
declare const emotesList: Emote[];
declare const emoteNames: string[];
declare var tentativas: number;
declare var emoteAtual: Emote;
declare var acertos: number;
declare const inputChannel: HTMLInputElement;
declare const inputEmote: HTMLInputElement;
declare function onInputChange(): void;
declare function createAutoCompleteDropdown(list: string[]): void;
declare function removeAutocompleteDropdown(): void;
declare function onEmoteButtonClick(e: Event): void;
interface Emote {
    name: string;
    image: string;
}
declare const getEmotesShow: (channel: string) => Promise<void>;
declare const getEmotesGame: (channel: string) => Promise<void>;
declare const gameplay: () => void;
declare const showEmote: (emote: Emote) => void;
declare const showEmoteGame: (emote: Emote) => void;
declare const getEmotenames: (emote: Emote[]) => void;
declare const clear: (container: HTMLElement) => void;
