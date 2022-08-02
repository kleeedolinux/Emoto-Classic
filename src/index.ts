//código mais scuffed que esse impossível

const container: HTMLElement = document.getElementById("app")!;
const loading: HTMLElement = document.getElementById("loading")!;
const showAcertos: HTMLElement = document.getElementById("acertos")!;
const showTentativas: HTMLElement = document.getElementById("tentativas")!;
const autocompleteWrapper: HTMLElement =
	document.getElementById("autocomplete")!;

const emotesList: Emote[] = [];
const emoteNames: string[] = [];

var tentativas: number = 0;
var emoteAtual: Emote;
var acertos: number = 0;

const inputChannel: HTMLInputElement = document.getElementById(
	"channel"
)! as HTMLInputElement;

const inputEmote: HTMLInputElement = document.getElementById(
	"emoteTry"
)! as HTMLInputElement;

inputChannel.addEventListener("change", (): void => {
	tentativas = 0;
	acertos = 0;
	showTentativas.innerHTML = `Tentativas: ${tentativas}`;
	showAcertos.innerHTML = `Acertos: ${acertos}`;
	clear(container);
	emotesList.length = 0;
	getEmotesGame(inputChannel.value);
});

inputEmote.addEventListener("input", onInputChange);

// inputEmote.addEventListener("change", (): void => {
// 	gameplay();
// });

function onInputChange(): void {
	removeAutocompleteDropdown();

	const value: string = inputEmote.value.toLowerCase();

	const filteredEmoteNames: string[] = [];

	if (value.length === 0) return;

	emoteNames.forEach((emoteName: string) => {
		if (emoteName.substring(0, value.length).toLowerCase() === value) {
			filteredEmoteNames.push(emoteName);
		}
	});
	createAutoCompleteDropdown(filteredEmoteNames);
}

function createAutoCompleteDropdown(list: string[]): void {
	const listElement = document.createElement("ul");
	listElement.className = "autocomplete-list";
	listElement.id = "autocomplete-list";

	list.forEach((emoteName: string) => {
		const listItem = document.createElement("li")!;

		const emoteNameButton = document.createElement("button");
		emoteNameButton.innerHTML = emoteName;
		emoteNameButton.addEventListener("click", onEmoteButtonClick);
		listItem.appendChild(emoteNameButton);

		listElement.appendChild(listItem);
	});
	console.log(listElement)
	autocompleteWrapper.appendChild(listElement);
}

function removeAutocompleteDropdown(): void {
	const listElement = document.getElementById("autocomplete-list")!;
	if (listElement) {
		listElement.remove();
	}
}

function onEmoteButtonClick(e: Event): void {
	const buttonElement = e.target as HTMLButtonElement;
	inputEmote.value = buttonElement.innerHTML;

	removeAutocompleteDropdown();
}

interface Emote {
	name: string;
	image: string;
}

const getEmotesShow = async (channel: string): Promise<void> => {
	console.log(channel);
	// achar um jeito de otimizar essa parte aqui

	const data: Response = await fetch(
		`https://emotes.adamcy.pl/v1/channel/${channel}/emotes/twitch.7tv.bttv.ffz`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	const emotes = await data.json();
	//pega os emotes do canal especificado

	emotes.forEach((emote: any) => {
		//para cada emote, exibir o nome e a imagem no site
		const emoteData: Emote = {
			name: emote.code,
			image: emote.urls[1].url,
		};
		showEmote(emoteData);
	});
};

const getEmotesGame = async (channel: string): Promise<void> => {
	console.log(channel);

	const data: Response = await fetch(
		`https://emotes.adamcy.pl/v1/channel/${channel}/emotes/twitch.7tv.bttv`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	const emotes = await data.json();
	//pega os emotes do canal especificado
	emotesList.length = 0;
	emoteNames.length = 0;
	emotes.forEach((emote: any) => {
		//adicionar cada emote no array emotesList
		const emoteData: Emote = {
			name: emote.code,
			image: emote.urls[2].url,
		};
		emotesList.push(emoteData);
	});
	getEmotenames(emotesList);
	emoteAtual = emotesList[Math.floor(Math.random() * emotesList.length)];
	showEmoteGame(emoteAtual);
};

const gameplay = (): void => {
	if (inputEmote.value == emoteAtual.name) {
		alert("Acertou!");
		acertos++;
		showAcertos.innerHTML = `Acertos: ${acertos}`;
		clear(container);
		getEmotesGame(inputChannel.value);
		inputEmote.value = "";
	} else {
		console.log(emoteAtual.name);
		alert("Errou!");
		tentativas++;
		showTentativas.innerHTML = `Tentativas: ${tentativas}`;
		if (tentativas === 3) {
			alert("Game Over!");
			tentativas = 0;
			acertos = 0;
			clear(container);
			getEmotesGame(inputChannel.value);
		}
	}
	//guardar esse código pra mostrar no vídeo
	// inputEmote.addEventListener("change", (): void => {
	// 	console.log(inputEmote.value);

	// 	for (let i = 0; i < 4; i++) {
	// 		if (inputEmote.value === emoteAtual.name) {
	// 			alert("Acertou!");
	// 			return;
	// 		} else {
	// 			alert("Não acertou, tente novamente!");
	// 			tentativas++;
	// 			console.log(tentativas);
	// 		}
	// 	}
	// });
};

const showEmote = (emote: Emote): void => {
	let output: string = `
    <a class="card">
        <img class="card--image" src=${emote.image} alt=${emote.name} />
        <h1 class="card--name">${emote.name}</h1>
    </a>
    `;
	container.innerHTML += output;
};

const showEmoteGame = (emote: Emote): void => {
	let output: string = `
    <a class="card">
        <img class="card--image" src=${emote.image} alt=${emote.name} />
    </a>
    `;
	container.innerHTML += output;
};

const getEmotenames = (emote: Emote[]): void => {
	emote.forEach((emote: Emote) => {
		emoteNames.push(emote.name);
	});
	console.log(emoteNames);
};

const clear = (container: HTMLElement): void => {
	container.innerHTML = "";
};
