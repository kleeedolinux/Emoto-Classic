var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Autocomplete } from "../UI/Autocomplete.js";
import { UI } from "../UI/UI.js";
export class Game {
    constructor(user) {
        this.showEmoteGame = (emote) => {
            let output = `
        <a class="card">
    
            <img class="card--image4" src=${emote.image} alt=${emote.name} />
    
        </a>
        `;
            this.ui.app.innerHTML += output;
            //console.log(emote.name);//tirar ou comentar essa linha
        };
        this.returnToHome = () => {
            this.acertos = 0;
            this.vidasRestantes = 4;
            this.ui.clear(this.ui.showAcertos);
            this.ui.clear(this.ui.app);
            this.ui.clear(this.ui.loading);
            this.ui.clear(this.ui.invalidChannel);
            this.ui.hideElement(this.ui.emoteTryContainer);
            this.ui.hideElement(this.ui.vidas.vidasUI);
            this.ui.showElement(this.user.recordeElement);
            this.ui.showElement(this.ui.peepoThink);
            this.ui.showElement(this.user.medalhas);
        };
        this.getEmotesGame = (channel) => __awaiter(this, void 0, void 0, function* () {
            console.log(channel);
            this.acertos = 0;
            try {
                const data = yield fetch(
                //pega os emotes do canal especificado
                `https://emotes.adamcy.pl/v1/channel/${channel}/emotes/twitch.7tv.bttv`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const emotes = yield data.json();
                //pega os emotes do canal especificado
                this.emotesList.length = 0;
                this.emoteNames.length = 0;
                emotes.forEach((emote) => {
                    //adicionar cada emote no array emotesList
                    const emoteData = {
                        name: emote.code,
                        image: emote.urls[2].url,
                    };
                    this.emotesList.push(emoteData);
                });
                this.ui.hideElement(this.user.recordeElement);
                this.getEmotenames(this.emotesList);
                this.emoteAtual = this.emotesList[Math.floor(Math.random() * this.emotesList.length)];
                this.autocomplete.loadEmotesList(this.emotesList);
                this.ui.clear(this.ui.app);
                this.ui.clear(this.ui.loading);
                this.showEmoteGame(this.emoteAtual);
                this.ui.showEmoteTry(this.autocomplete);
                this.ui.showAcertos.innerHTML = `${this.acertos}`;
                this.ui.showElement(this.ui.vidas.vidasUI);
            }
            catch (error) {
                console.log(error);
                this.ui.clear(this.ui.loading);
                this.ui.clear(this.ui.app);
                this.ui.clear(this.ui.showAcertos);
                this.ui.hideElement(this.ui.emoteTryContainer);
                this.ui.hideElement(this.ui.vidas.vidasUI);
                this.ui.showInvalidChannel(channel, this.ui.invalidChannel);
                this.ui.showElement(this.ui.peepoThink);
                this.ui.showElement(this.user.recordeElement);
            }
        });
        //Remove emote acertado do array de emotes
        //Dá outro emote da lista para a variavel emoteAtual
        //limpa o output do emote anterior
        //exibe o novo emote
        this.continueGame = (emotesList) => {
            emotesList.splice(emotesList.indexOf(this.emoteAtual), 1);
            this.emoteNames.splice(this.emoteNames.indexOf(this.emoteAtual.name), 1);
            this.emoteAtual = emotesList[Math.floor(Math.random() * emotesList.length)];
            this.ui.clear(this.ui.app);
            this.ui.inputEmote.value = "";
            this.ui.inputEmote.focus();
            this.showEmoteGame(this.emoteAtual);
        };
        this.updateGameOverModal = () => {
            let text = `
		<p id="modalText">
			O Emote era '${this.emoteAtual.name}'
		</p>
        <p id="modalText">
            Você acertou
		</p>
        <p id="modalAcertos">
        ${this.acertos}
        </p>
        <p id="modalText">
            emotes!
        </p>
        `;
            this.ui.modalInfo.modalGameOver.querySelector("#modalGameOverContent").innerHTML = text;
        };
        this.updateWinModal = () => {
            let text = `
        <p id="modalText">
        Impossível... 
        Você acertou todos os
		</p>
        <p id="modalAcertos">
        ${this.acertos}
        </p>
        <p id="modalText">
            emotes!
        </p>
        <p id="modalText">
            Parabéns... eu acho?
        </p>
        `;
            this.ui.modalInfo.modalWin.querySelector("#modalWinContent").innerHTML = text;
        };
        //Verifica se o emote digitado é igual ao emote atual e chama a função de continuar o jogo ou perde uma vida
        this.gameplay = () => {
            //Condição de Acerto
            if (this.ui.inputEmote.value == this.emoteAtual.name) {
                this.acertos++;
                this.acertosSeguidos++;
                if (this.acertosSeguidos == 3 && this.vidasRestantes <= 4) {
                    if (this.vidasRestantes == 4) {
                        this.vidasRestantes = 4;
                    }
                    else {
                        this.vidasRestantes++;
                    }
                    this.acertosSeguidos = 0;
                    this.ui.vidas.checkVidas(this.vidasRestantes);
                }
                this.ui.inputEmote.setAttribute("placeholder", "Acertou!");
                this.ui.inputEmote.style.boxShadow = "0 0 0 3px green";
                this.ui.showAcertos.innerHTML = `${this.acertos}`;
                //Condição de Vitória
                if (this.emotesList.length == 1) {
                    alert("meu deus você literalmente acertou tudo. Parabéns... eu acho?");
                    this.updateWinModal();
                    this.ui.modalInfo.dialog.showModal();
                    this.ui.showElementFlex(this.ui.modalInfo.modalWin);
                    this.ui.hideElement(this.ui.modalInfo.modalHelp);
                    this.ui.hideElement(this.ui.modalInfo.modalGameOver);
                }
                else {
                    this.continueGame(this.emotesList);
                }
                //Condição de ERRO
            }
            else {
                this.acertosSeguidos = 0;
                this.vidasRestantes--;
                this.ui.vidas.checkVidas(this.vidasRestantes);
                this.ui.inputEmote.style.boxShadow = "0 0 0 3px rgba(191, 2, 2)";
                this.ui.inputEmote.setAttribute("placeholder", "Tente novamente");
                this.ui.inputEmote.value = "";
                this.ui.showAcertos.innerHTML = `${this.acertos}`;
                if (this.vidasRestantes > 0) {
                    this.ui.shakeWrong(this.ui.inputEmote);
                    this.ui.shakeWrong(this.ui.vidas.vidasUI);
                    this.ui.clear(this.ui.app);
                    this.showEmoteGame(this.emoteAtual);
                }
                //Condição de DERROTA
                else if (this.vidasRestantes === 0) {
                    this.ui.shakeWrong(this.ui.inputEmote);
                    if (this.acertos > this.user.recorde) {
                        this.user.recorde = this.acertos;
                        localStorage.setItem("Recorde", this.user.recorde.toString());
                    }
                    this.updateGameOverModal();
                    this.ui.modalInfo.dialog.showModal();
                    this.ui.showElementFlex(this.ui.modalInfo.modalGameOver);
                    this.ui.hideElement(this.ui.modalInfo.modalHelp);
                    this.ui.hideElement(this.ui.modalInfo.modalWin);
                }
            }
        };
        this.channel = "";
        this.emotesList = [];
        this.emoteNames = [];
        this.emoteAtual = { name: "", image: "" };
        this.acertos = 0;
        this.acertosSeguidos = 0;
        this.vidasRestantes = 4;
        this.ui = new UI();
        this.user = user;
        this.autocomplete = new Autocomplete(this);
        this.ui.inputChannel.addEventListener("change", () => {
            this.restartGame();
            this.ui.hideElement(this.ui.subtitle2);
            this.channel = this.ui.inputChannel.value;
            console.log(this.channel);
        });
        this.ui.inputChannel.addEventListener("focus", () => {
            this.ui.showElement(this.ui.subtitle2);
        });
        this.ui.inputChannel.addEventListener("blur", () => {
            this.ui.hideElement(this.ui.subtitle2);
        });
    }
    getEmotenames(emote) {
        emote.forEach((emote) => {
            this.emoteNames.push(emote.name);
        });
    }
    restartGame() {
        this.ui.showElementFlex(this.ui.modalInfo.modalHelp);
        this.ui.hideElement(this.ui.modalInfo.modalGameOver);
        this.emotesList.length = 0;
        this.acertos = 0;
        this.vidasRestantes = 4;
        this.ui.hideElement(this.ui.peepoThink);
        this.ui.hideElement(this.user.medalhas);
        this.ui.showLoading(this.ui.inputChannel.value, this.ui.loading);
        this.getEmotesGame(this.ui.inputChannel.value);
        this.ui.clear(this.ui.invalidChannel);
        this.ui.clear(this.ui.subtitle);
        this.ui.clear(this.ui.app);
        this.ui.vidas.resetVidas();
    }
}
//# sourceMappingURL=Game.js.map