import { Autocomplete } from "./Autocomplete.js";
import { Modal } from "./Modal.js";
import { Vidas } from "./VidasUI.js";
export declare class UI extends Modal {
    vidas: Vidas;
    titleEmoto: HTMLElement;
    subtitle: HTMLElement;
    peepoThink: HTMLElement;
    inputChannel: HTMLInputElement;
    subtitle2: HTMLElement;
    invalidChannel: HTMLElement;
    app: HTMLElement;
    loading: HTMLElement;
    emoteTryContainer: HTMLElement;
    inputEmote: HTMLInputElement;
    showAcertos: HTMLElement;
    constructor();
    showEmoteTry(autocomplete: Autocomplete): void;
    hideElement(element: HTMLElement): void;
    showElement(element: HTMLElement): void;
    clear: (container: HTMLElement) => void;
    shakeInputWrong(input: HTMLElement): void;
    showLoading: (channel: string, loading: HTMLElement) => void;
    showInvalidChannel: (channel: string, invalidChannel: HTMLElement) => void;
}
