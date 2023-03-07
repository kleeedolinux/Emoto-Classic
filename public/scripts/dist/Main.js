import { Game } from "./Game/Game.js";
import { Autocomplete } from "./UI/Autocomplete.js";
import { User } from "./Profile/User.js";
document.addEventListener("contextmenu", (event) => event.preventDefault());
const user = new User("user");
const game = new Game(user);
const autocomplete = new Autocomplete(game);
const ui = game.ui;
ui.inputEmote.addEventListener("input", function () {
    const filteredList = autocomplete.filterEmotesList(game.emotesList, ui.inputEmote.value);
    autocomplete.loadEmotesList(filteredList);
    ui.showElement(autocomplete.emotesListAutocomplete);
    ;
});
ui.inputEmote.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        game.gameplay();
        ui.hideElement(autocomplete.emotesListAutocomplete);
    }
});
window.onclick = function (event) {
    if (event.target == ui.modalInfo.dialog && ui.modalInfo.modalHelp.style.display !== "none") {
        ui.modalInfo.dialog.close();
    }
};
autocomplete.emotesListAutocomplete.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("autocomplete-item")) {
        ui.inputEmote.value = target.innerText;
        ui.inputEmote.focus();
        ui.hideElement(autocomplete.emotesListAutocomplete);
    }
});
autocomplete.emotesListAutocomplete.addEventListener("keydown", (e) => {
    const target = e.target;
    if (target.classList.contains("autocomplete-item") && e.key === "Enter") {
        ui.inputEmote.value = target.innerText;
        ui.inputEmote.focus();
        game.gameplay();
        ui.hideElement(autocomplete.emotesListAutocomplete);
    }
});
ui.modalInfo.dialogTryAgainBtn.addEventListener("click", () => {
    game.ui.clear(game.ui.app);
    game.restartGame();
});
ui.modalInfo.dialogHomeButtonGameOver.addEventListener("click", () => {
    window.location.reload();
    console.log("home");
});
ui.modalInfo.dialogHomeButtonWin.addEventListener("click", () => {
    window.location.reload();
    console.log("home");
});
ui.modalInfo.dialogTwitterButtonWin.addEventListener("click", () => {
    const url = getURLTweetWin();
    window.open(url);
});
ui.modalInfo.dialogTwitterButtonGameOver.addEventListener("click", () => {
    const url = getURLTweetGameOver();
    window.open(url);
});
function getURLTweetGameOver() {
    return `https://twitter.com/intent/tweet?text=Eu acertei ${game.acertos} Emotes do canal ${game.channel}! Você consegue acertar mais?` + " Tente agora em emoto.discloud.app !";
}
function getURLTweetWin() {
    return `https://twitter.com/intent/tweet?text=Eu acertei TODOS os Emotes do canal ${game.channel}! Você acha que consegue também?` + " Tente agora em emoto.discloud.app !";
}
//# sourceMappingURL=Main.js.map