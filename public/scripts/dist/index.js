var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Game } from "./game.js";
import { User } from "./user.js";
import { Vidas } from "./vidas.js";
import { Autocomplete } from "./autocomplete.js";
import { UI } from "./UI.js";
import { hideElement, showElement, clear, showInvalidChannel, showLoading, shakeInputWrong } from "./util.js";
const emoteTryContainer = document.getElementById("emoteTryContainer");
const invalidChannel = document.getElementById("invalidChannel");
document.addEventListener("contextmenu", (event) => event.preventDefault());
let user = new User("", 0);
const ui = new UI();
const vidas = new Vidas();
const game = new Game("", [], [], { name: "", image: "" }, 0, 0, 4, vidas, ui);
const autocomplete = new Autocomplete(game);
var localRecorde = localStorage.getItem("recorde");
if (localRecorde) {
    user.recordeElement.innerHTML = `Recorde: ${localRecorde}`;
    user.recorde = parseInt(localRecorde);
}
if (localStorage.getItem("Medalhas")) {
    user.medalhas.innerHTML = localStorage.getItem("Medalhas");
}
const inputChannel = document.getElementById("channelInput");
const inputEmote = document.getElementById("emoteTry");
inputChannel.addEventListener("change", () => {
    restartGame();
    hideElement(ui.subtitle2);
});
inputChannel.addEventListener("focus", () => {
    showElement(ui.subtitle2);
});
inputChannel.addEventListener("blur", () => {
    hideElement(ui.subtitle2);
});
autocomplete.emotesListAutocomplete.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("autocomplete-item")) {
        inputEmote.value = target.innerText;
        inputEmote.focus();
        hideElement(autocomplete.emotesListAutocomplete);
    }
});
autocomplete.emotesListAutocomplete.addEventListener("keydown", (e) => {
    const target = e.target;
    if (target.classList.contains("autocomplete-item") && e.key === "Enter") {
        inputEmote.value = target.innerText;
        inputEmote.focus();
        gameplay();
        hideElement(autocomplete.emotesListAutocomplete);
    }
});
inputEmote.addEventListener("input", function () {
    const filteredList = autocomplete.filterEmotesList(game.emotesList, inputEmote.value);
    autocomplete.loadEmotesList(filteredList);
    showElement(autocomplete.emotesListAutocomplete);
    ;
});
inputEmote.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        gameplay();
        hideElement(autocomplete.emotesListAutocomplete);
        ;
    }
});
function showEmoteTry() {
    emoteTryContainer.style.display = "block";
    inputEmote.style.display = "block";
    hideElement(autocomplete.emotesListAutocomplete);
    inputEmote.focus();
}
function restartGame() {
    game.emotesList.length = 0;
    game.acertos = 0;
    game.vidasRestantes = 4;
    hideElement(ui.peepoThink);
    hideElement(user.medalhas);
    showLoading(inputChannel.value, game.loading);
    getEmotesGame(inputChannel.value);
    clear(invalidChannel);
    clear(ui.subtitle);
    clear(game.app);
    vidas.resetVidas();
}
const getEmotesGame = (channel) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(channel);
    game.acertos = 0;
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
        game.emotesList.length = 0;
        game.emoteNames.length = 0;
        emotes.forEach((emote) => {
            //adicionar cada emote no array emotesList
            const emoteData = {
                name: emote.code,
                image: emote.urls[2].url,
            };
            game.emotesList.push(emoteData);
        });
        hideElement(user.recordeElement);
        game.getEmotenames(game.emotesList);
        game.emoteAtual = game.emotesList[Math.floor(Math.random() * game.emotesList.length)];
        autocomplete.loadEmotesList(game.emotesList);
        clear(game.app);
        clear(game.loading);
        game.showEmoteGame(game.emoteAtual);
        showEmoteTry();
        game.showAcertos.innerHTML = `${game.acertos}`;
        showElement(vidas.vidasUI);
    }
    catch (error) {
        console.log(error);
        clear(game.loading);
        clear(game.app);
        clear(game.showAcertos);
        hideElement(emoteTryContainer);
        hideElement(vidas.vidasUI);
        showInvalidChannel(channel, invalidChannel);
        showElement(ui.peepoThink);
        showElement(user.recordeElement);
    }
});
//Remove emote acertado do array de emotes
//Dá outro emote da lista para a variavel emoteAtual
//limpa o output do emote anterior
//exibe o novo emote
const continueGame = (emotesList) => {
    emotesList.splice(emotesList.indexOf(game.emoteAtual), 1);
    game.emoteNames.splice(game.emoteNames.indexOf(game.emoteAtual.name), 1);
    game.emoteAtual = emotesList[Math.floor(Math.random() * emotesList.length)];
    clear(game.app);
    inputEmote.value = "";
    inputEmote.focus();
    game.showEmoteGame(game.emoteAtual);
};
const returnToHome = () => {
    game.acertos = 0;
    game.vidasRestantes = 4;
    clear(game.showAcertos);
    clear(game.app);
    clear(game.loading);
    clear(invalidChannel);
    hideElement(emoteTryContainer);
    hideElement(vidas.vidasUI);
    showElement(user.recordeElement);
    showElement(ui.peepoThink);
    showElement(user.medalhas);
};
const gameplay = () => {
    if (inputEmote.value == game.emoteAtual.name) { //acerto
        game.acertos++;
        game.acertosSeguidos++;
        if (game.acertosSeguidos == 3 && game.vidasRestantes <= 4) {
            if (game.vidasRestantes == 4) {
                game.vidasRestantes = 4;
            }
            else {
                game.vidasRestantes++;
            }
            game.acertosSeguidos = 0;
            vidas.checkVidas(game.vidasRestantes);
        }
        inputEmote.setAttribute("placeholder", "Acertou!");
        inputEmote.style.boxShadow = "0 0 0 3px green";
        game.showAcertos.innerHTML = `${game.acertos}`;
        if (game.emotesList.length == 1) { //vitória
            alert("meu deus você literalmente acertou tudo. Parabéns... eu acho?");
            (inputChannel.value);
            returnToHome();
        }
        else {
            continueGame(game.emotesList);
        }
    }
    else { //erro
        game.acertosSeguidos = 0;
        game.vidasRestantes--;
        vidas.checkVidas(game.vidasRestantes);
        inputEmote.style.boxShadow = "0 0 0 3px rgba(191, 2, 2)";
        inputEmote.setAttribute("placeholder", "Tente novamente");
        inputEmote.value = "";
        game.showAcertos.innerHTML = `${game.acertos}`;
        if (game.vidasRestantes > 0) {
            shakeInputWrong(inputEmote);
            clear(game.app);
            game.showEmoteGame(game.emoteAtual);
        }
        else if (game.vidasRestantes === 0) {
            shakeInputWrong(inputEmote);
            if (game.acertos > user.recorde) {
                user.recorde = game.acertos;
                localStorage.setItem("recorde", user.recorde.toString());
            }
            alert("Game Over! O Emote era '" + game.emoteAtual.name + "'. Você acertou " + game.acertos + " emotes! Tente novamente.");
            clear(game.app);
            restartGame();
        }
    }
};
//# sourceMappingURL=index.js.map