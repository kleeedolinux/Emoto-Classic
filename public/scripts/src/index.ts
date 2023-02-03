const container: HTMLElement = document.getElementById("app")!;
const loading: HTMLElement = document.getElementById("loading")!;
const showAcertos: HTMLElement = document.getElementById("acertos")!;
const showTentativas: HTMLElement = document.getElementById("tentativas")!;
const btnConfirmarEmote: HTMLElement = document.getElementById("btnConfirmar")!;
const autocompleteWrapper: HTMLElement =
	document.getElementById("autocomplete")!;

document.addEventListener("contextmenu", (event) => event.preventDefault());

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
	showLoading(inputChannel.value);
	showEmoteTry();
	getEmotesGame(inputChannel.value);
});

inputEmote.addEventListener("keydown", (e: KeyboardEvent) => {
	if (e.key === "Enter") {
		gameplay();
		removeAutocompleteDropdown();
	}
});


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
		emoteNameButton.addEventListener("click", onEmoteConfirm);
		listItem.appendChild(emoteNameButton);

		listElement.appendChild(listItem);
	});
	autocompleteWrapper.appendChild(listElement);
}

function removeAutocompleteDropdown(): void {
	const listElement = document.getElementById("autocomplete-list")!;
	if (listElement) {
		listElement.remove();
	}
}

function onEmoteConfirm(e: Event): void {
	const buttonElement = e.target as HTMLButtonElement;
	inputEmote.value = buttonElement.innerHTML;

	removeAutocompleteDropdown();
}

function showEmoteTry(): void {
	inputEmote.style.display = "inline-block";
	btnConfirmarEmote.style.display = "inline-block";
}

interface Emote {
	name: string;
	image: string;
}

interface GameRound {
	emotes: Emote[];
	acertos: number;
	tentativas: number;
	completo: boolean;
}

const getEmotesGame = async (channel: string): Promise<void> => {
	console.log(channel);
	tentativas = 0;
	acertos = 0;
	showTentativas.innerHTML = `Tentativas: ${tentativas}`;
	showAcertos.innerHTML = `Acertos: ${acertos}`;
	try {
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
		clear(container);
		showEmoteGame(emoteAtual);
	} catch (error) {
		alert("Canal não encontrado");
	}
};

//Remove emote acertado do array de emotes
//Dá outro emote da lista para a variavel emoteAtual
//limpa o output do emote anterior
//exibe o novo emote
const continueGame = (emotesList: Emote[]): void => {
	emotesList.splice(emotesList.indexOf(emoteAtual), 1);
	emoteNames.splice(emoteNames.indexOf(emoteAtual.name), 1);
	emoteAtual = emotesList[Math.floor(Math.random() * emotesList.length)];
	clear(container);
	inputEmote.value = "";
	showEmoteGame(emoteAtual);
};

const gameplay = (): void => {
	if (inputEmote.value == emoteAtual.name) {
		alert("Acertou!");
		acertos++;
		tentativas = 0;
		showAcertos.innerHTML = `Acertos: ${acertos}`;
		showTentativas.innerHTML = `Tentativas: ${tentativas}`;
		continueGame(emotesList);
	} else {
		console.log(emoteAtual.name);
		alert("Errou!");
		tentativas++;
		showAcertos.innerHTML = `Acertos: ${acertos}`;
		showTentativas.innerHTML = `Tentativas: ${tentativas}`;
		if (tentativas === 1) {
			clear(container);
			showEmoteGame2(emoteAtual);
		}
		if (tentativas === 2) {
			clear(container);
			showEmoteGame3(emoteAtual);
		}
		if (tentativas === 3) {
			clear(container);
			showEmoteGame4(emoteAtual);
		}
		if (tentativas === 4) {
			alert("Game Over!");
			clear(container);
			getEmotesGame(inputChannel.value);
		}
	}
};


const showEmote = (emote: Emote): void => {
	let output: string = `
    <a class="card">
		<div id= "blur">
		<img class="card--image" src=${emote.image} alt=${emote.name} />
		</div>
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

const showEmoteGame2 = (emote: Emote): void => {
	let output: string = `
    <a class="card">
		
		<img class="card--image2" src=${emote.image} alt=${emote.name} />
		
    </a>
    `;
	container.innerHTML += output;
};

const showEmoteGame3 = (emote: Emote): void => {
	let output: string = `
    <a class="card">
		
		<img class="card--image3" src=${emote.image} alt=${emote.name} />
		
    </a>
    `;
	container.innerHTML += output;
};

const showEmoteGame4 = (emote: Emote): void => {
	let output: string = `
    <a class="card">
		
		<img class="card--image4" src=${emote.image} alt=${emote.name} />
		
    </a>
    `;
	container.innerHTML += output;
};

const showLoading = (channel: string): void => {
	let output: string = `
    <p> Carregando Emotes de ${channel}...</p>
    `;
	container.innerHTML += output;
};

const getEmotenames = (emote: Emote[]): void => {
	emote.forEach((emote: Emote) => {
		emoteNames.push(emote.name);
	});
};

const clear = (container: HTMLElement): void => {
	container.innerHTML = "";
};


//Código que eu usei pra mostrar todos os emotes de um canal específico
// const getEmotesShow = async (channel: string): Promise<void> => {
// 	console.log(channel);
// 	// achar um jeito de otimizar essa parte aqui

// 	const data: Response = await fetch(
// 		`https://emotes.adamcy.pl/v1/channel/${channel}/emotes/twitch.7tv.bttv.ffz`,
// 		{
// 			method: "GET",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		}
// 	);
// 	const emotes = await data.json();
// 	//pega os emotes do canal especificado

// 	emotes.forEach((emote: any) => {
// 		//para cada emote, exibir o nome e a imagem no site
// 		const emoteData: Emote = {
// 			name: emote.code,
// 			image: emote.urls[1].url,
// 		};
// 		showEmote(emoteData);
// 	});
// };

//Primeiro protótipo de gameplay (não remove o emote acertado da lista de emotes)
// const gameplay = (): void => {
// 	if (inputEmote.value == emoteAtual.name) {
// 		alert("Acertou!");
// 		acertos++;
// 		showAcertos.innerHTML = `Acertos: ${acertos}`;
// 		clear(container);
// 		getEmotesGame(inputChannel.value);
// 		inputEmote.value = "";
// 	} else {
// 		console.log(emoteAtual.name);
// 		alert("Errou!");
// 		tentativas++;
// 		showTentativas.innerHTML = `Tentativas: ${tentativas}`;
// 		if (tentativas === 3) {
// 			alert("Game Over!");
// 			tentativas = 0;
// 			acertos = 0;
// 			clear(container);
// 			getEmotesGame(inputChannel.value);
// 		}
// 	}
// 	//guardar esse código pra mostrar no vídeo
// 	// inputEmote.addEventListener("change", (): void => {
// 	// 	console.log(inputEmote.value);

// 	// 	for (let i = 0; i < 4; i++) {
// 	// 		if (inputEmote.value === emoteAtual.name) {
// 	// 			alert("Acertou!");
// 	// 			return;
// 	// 		} else {
// 	// 			alert("Não acertou, tente novamente!");
// 	// 			tentativas++;
// 	// 			console.log(tentativas);
// 	// 		}
// 	// 	}
// 	// });
// };