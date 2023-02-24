import { ModalInfo } from "./ModalInfo.js";
import { Vidas } from "./VidasUI.js";
export class UI extends ModalInfo {
    constructor() {
        super();
        this.vidas = new Vidas();
        this.titleEmoto = document.querySelector(".title");
        this.subtitle = document.getElementById("subtitle");
        this.peepoThink = document.getElementById("peepoThink");
        this.inputChannel = document.getElementById("channelInput");
        this.subtitle2 = document.getElementById("subtitle2");
        this.invalidChannel = document.getElementById("invalidChannel");
        this.app = document.getElementById("app");
        this.loading = document.getElementById("loading");
        this.emoteTryContainer = document.getElementById("emoteTryContainer");
        this.inputEmote = document.getElementById("emoteTry");
        this.showAcertos = document.getElementById("acertos");
        this.clear = (container) => {
            container.innerHTML = ``;
        };
        this.showLoading = (channel, loading) => {
            let output = `
        <p id = "loadingText"> Carregando emotes de twitch.tv/${channel}...</p>
        <img id="loadingImg" src="https://cdn.7tv.app/emote/6154d7d86251d7e000db1727/4x.webp"/>
        `;
            loading.innerHTML += output;
        };
        this.showInvalidChannel = (channel, invalidChannel) => {
            let output = `
        <p id = "invalidChannelText"> O canal ${channel} não foi encontrado...</p>
        `;
            invalidChannel.innerHTML += output;
        };
        this.titleEmoto.addEventListener("click", () => {
            window.location.reload();
        });
    }
    showEmoteTry(autocomplete) {
        this.emoteTryContainer.style.display = "block";
        this.inputEmote.style.display = "block";
        this.hideElement(autocomplete.emotesListAutocomplete);
        this.inputEmote.focus();
    }
    hideElement(element) {
        element.style.display = "none";
    }
    showElement(element) {
        element.style.display = "block";
    }
    shakeWrong(element) {
        setTimeout(() => {
            element.style.animation = "shake 0.2s";
            element.style.animationIterationCount = "1";
        }, 1);
        setTimeout(() => {
            element.style.animation = "none";
        }, 400);
    }
}
//# sourceMappingURL=UI.js.map