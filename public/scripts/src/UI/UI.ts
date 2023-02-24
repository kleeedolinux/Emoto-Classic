import { Autocomplete } from "./Autocomplete.js";
import { ModalInfo } from "./ModalInfo.js";
import { Vidas } from "./VidasUI.js";

export class UI extends ModalInfo {
    vidas: Vidas = new Vidas();

    titleEmoto: HTMLElement = document.querySelector(".title")!;
    subtitle: HTMLElement = document.getElementById("subtitle")!;
    peepoThink: HTMLElement = document.getElementById("peepoThink")!;
    inputChannel: HTMLInputElement = document.getElementById("channelInput")! as HTMLInputElement;
    subtitle2: HTMLElement = document.getElementById("subtitle2")!;
    invalidChannel: HTMLElement = document.getElementById("invalidChannel")!;

    app: HTMLElement = document.getElementById("app")!;
    loading: HTMLElement = document.getElementById("loading")!;
    emoteTryContainer: HTMLElement = document.getElementById("emoteTryContainer")!;
    inputEmote: HTMLInputElement = document.getElementById("emoteTry")! as HTMLInputElement;
    showAcertos: HTMLElement = document.getElementById("acertos")!;

    constructor() {
        super();
        this.titleEmoto.addEventListener("click", () => {
            window.location.reload();
        });
    }

    showEmoteTry(autocomplete: Autocomplete): void {
        this.emoteTryContainer.style.display = "block";
        this.inputEmote.style.display = "block";
        this.hideElement(autocomplete.emotesListAutocomplete);
        this.inputEmote.focus();
    }

    hideElement(element: HTMLElement): void {
        element.style.display = "none";
    }

    showElement(element: HTMLElement): void {
        element.style.display = "block";
    }

    clear = (container: HTMLElement): void => {
        container.innerHTML = ``;
    };

    shakeWrong(element: HTMLElement) {
        setTimeout(() => {
            element.style.animation = "shake 0.2s";
            element.style.animationIterationCount = "1";
        }, 1);
        setTimeout(() => {
            element.style.animation = "none";
        }, 400);
    }

    showLoading = (channel: string, loading: HTMLElement): void => {
        let output: string = `
        <p id = "loadingText"> Carregando emotes de twitch.tv/${channel}...</p>
        <img id="loadingImg" src="https://cdn.7tv.app/emote/6154d7d86251d7e000db1727/4x.webp"/>
        `;
        loading.innerHTML += output;
    };

    showInvalidChannel = (channel: string, invalidChannel: HTMLElement): void => {
        let output: string = `
        <p id = "invalidChannelText"> O canal ${channel} não foi encontrado...</p>
        `;
        invalidChannel.innerHTML += output;
    };

}