import { Emote } from "./Game/Emote";
import { Game } from "./Game/Game.js";
import { Autocomplete } from "./UI/Autocomplete.js";
import { User } from "./Profile/User.js";

document.addEventListener("contextmenu", (event) => event.preventDefault());

const user = new User("user");

const game = new Game(user);

const autocomplete = new Autocomplete(game);

const ui = game.ui;

ui.inputEmote.addEventListener("input", function () {
	const filteredList: Emote[] = autocomplete.filterEmotesList(game.emotesList, ui.inputEmote.value);
	autocomplete.loadEmotesList(filteredList);
	ui.showElement(autocomplete.emotesListAutocomplete);;
});

ui.inputEmote.addEventListener("keydown", (e: KeyboardEvent) => {
	if (e.key === "Enter") {
		game.gameplay();
		ui.hideElement(autocomplete.emotesListAutocomplete);;
	}
});

autocomplete.emotesListAutocomplete.addEventListener("click", (e: MouseEvent) => {
	const target = e.target as HTMLElement;
	if (target.classList.contains("autocomplete-item")) {
		ui.inputEmote.value = target.innerText;
		ui.inputEmote.focus();
		ui.hideElement(autocomplete.emotesListAutocomplete);
	}
});

autocomplete.emotesListAutocomplete.addEventListener("keydown", (e: KeyboardEvent) => {
	const target = e.target as HTMLElement;
	if (target.classList.contains("autocomplete-item") && e.key === "Enter") {
		ui.inputEmote.value = target.innerText;
		ui.inputEmote.focus();
		game.gameplay();
		ui.hideElement(autocomplete.emotesListAutocomplete);
	}
});
