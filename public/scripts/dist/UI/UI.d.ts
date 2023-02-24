import { Autocomplete } from "./Autocomplete.js";
import { ModalInfo } from "./ModalInfo.js";
import { Vidas } from "./VidasUI.js";
export declare class UI extends ModalInfo {
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
    shakeWrong(element: HTMLElement): void;
    showLoading: (channel: string, loading: HTMLElement) => void;
    showInvalidChannel: (channel: string, invalidChannel: HTMLElement) => void;
}
