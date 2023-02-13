const app: HTMLElement = document.getElementById("app")!;
const loading: HTMLElement = document.getElementById("loading")!;
const showAcertos: HTMLElement = document.getElementById("acertos")!;
const score: HTMLElement = document.getElementById("score")!;
const emoteTryContainer: HTMLElement =
	document.getElementById("emoteTryContainer")!;
const invalidChannel: HTMLElement = document.getElementById("invalidChannel")!;
const title: HTMLElement = document.getElementById("title")!;
const subtitle: HTMLElement = document.getElementById("subtitle")!;
const subtitle2: HTMLElement = document.getElementById("subtitle2")!;
const peepoThink: HTMLElement = document.getElementById("peepoThink")!;
const vidas: HTMLElement = document.getElementById("vidas")!;
const vida1: HTMLElement = document.getElementById("vida1")!;
const vida2: HTMLElement = document.getElementById("vida2")!;
const vida3: HTMLElement = document.getElementById("vida3")!;
const vida4: HTMLElement = document.getElementById("vida4")!;
const recordeElement: HTMLElement = document.getElementById("recorde")!;
const helpBtn: HTMLElement = document.getElementById("Help")!;
const dialog = document.querySelector("dialog")!;
const medalhas: HTMLElement = document.getElementById("medalhas")!;

const dialogCloseBtn = document.getElementById("modalCloseButton")!;

const titleEmoto = document.querySelector(".title")!;

titleEmoto.addEventListener("click", () => {
	window.location.reload();
});

helpBtn.addEventListener("click", () => {
	dialog.showModal();
});

dialogCloseBtn.addEventListener("click", () => {
	dialog.close();
});

const emotesListAutocomplete: HTMLElement =
	document.getElementById("emotes-list")!;

document.addEventListener("contextmenu", (event) => event.preventDefault());

const emotesList: Emote[] = [];
const emoteNames: string[] = [];

//cria html codigo pra medalha ganha e salva no local storage
function addMedalha(channel: string) {
	if (localStorage.getItem("Medalhas") == null) {
		localStorage.setItem("Medalhas", `
		<div id="medalha">
			<img id="medalhaImg" src="/public/img/Medal.png" alt="medalha">
			<a id="nomeMedalha" target="_blank" href="https://twitch.tv/${channel}/about">${channel}</a>
		</div>
		`)
		medalhas.innerHTML = localStorage.getItem("Medalhas")!;
	} else {
		localStorage.setItem("Medalhas", localStorage.getItem("Medalhas") + `
		<div id="medalha">
			<img id="medalhaImg" src="/public/img/Medal.png" alt="medalha">
			<a id="nomeMedalha" target="_blank" href="https://twitch.tv/${channel}/about">${channel}</a>
		</div>
		`)
		medalhas.innerHTML = localStorage.getItem("Medalhas")!;
	}
}

var emoteAtual: Emote;
var acertos: number = 0;
var acertosSeguidos: number = 0;
var vidasRestantes: number = 4;
var recorde = 0;

let localRecorde = localStorage.getItem("recorde");


if (localRecorde) {
	recordeElement.innerHTML = `Recorde: ${localRecorde}`;
	recorde = parseInt(localRecorde);
}

if (localStorage.getItem("Medalhas")) {
	medalhas.innerHTML = localStorage.getItem("Medalhas")!;
}


const inputChannel: HTMLInputElement = document.getElementById(
	"channelInput"
)! as HTMLInputElement;

const inputEmote: HTMLInputElement = document.getElementById(
	"emoteTry"
)! as HTMLInputElement;

inputChannel.addEventListener("change", (): void => {
	restartGame();
	subtitle2.style.display = "none";
});

inputChannel.addEventListener("focus", (): void => {
	showSubtitle2();
});

inputChannel.addEventListener("blur", (): void => {
	hideSubtitle2();
});

inputEmote.addEventListener("input", function () {
	const filteredList: Emote[] = filterEmotesList(emotesList, inputEmote.value);
	loadEmotesList(filteredList);
	showAutocomplete();
});

inputEmote.addEventListener("keydown", (e: KeyboardEvent) => {
	if (e.key === "Enter") {
		gameplay();
		hideAutocomplete();
	}
});

emotesListAutocomplete.addEventListener("click", (e: MouseEvent) => {
	const target = e.target as HTMLElement;
	if (target.classList.contains("autocomplete-item")) {
		inputEmote.value = target.innerText;
		inputEmote.focus();
		hideAutocomplete();
	}
});

emotesListAutocomplete.addEventListener("keydown", (e: KeyboardEvent) => {
	const target = e.target as HTMLElement;
	if (target.classList.contains("autocomplete-item") && e.key === "Enter") {
		inputEmote.value = target.innerText;
		inputEmote.focus();
		gameplay();
		hideAutocomplete();
	}
});

function showEmoteTry(): void {
	emoteTryContainer.style.display = "block";
	inputEmote.style.display = "block";
	hideAutocomplete();
	inputEmote.focus();
}

function clearEmoteTry(): void {
	emoteTryContainer.style.display = "none";
}

function hideAutocomplete(): void {
	emotesListAutocomplete.style.display = "none";
}

function showAutocomplete(): void {
	emotesListAutocomplete.style.display = "block";
}
function showPeepo(): void {
	peepoThink.style.display = "block";
}

function clearPeepo(): void {
	peepoThink.style.display = "none";
}

function hideVidas(): void {
	vidas.style.display = "none";
}

function showVidas(): void {
	vidas.style.display = "block";
}

function showRecorde(): void {
	recordeElement.style.display = "block";
}

function hideRecorde(): void {
	recordeElement.style.display = "none";
}

function showSubtitle2(): void {
	subtitle2.style.display = "block";
}

function hideSubtitle2(): void {
	subtitle2.style.display = "none";
}

function hideElement(element: HTMLElement): void {
	element.style.display = "none";
}

function showElement(element: HTMLElement): void {
	element.style.display = "block";
}

function loadEmotesList(emotes: Emote[]): void {
	if (emotes.length > 0) {
		emotesListAutocomplete.innerHTML = "";
		let innerElement: string = "";
		emotes.forEach((emote: Emote) => {
			innerElement += `<li class="autocomplete-item" tabindex = "0">${emote.name}</li>`;
		});
		emotesListAutocomplete.innerHTML = innerElement;
	}
}

function filterEmotesList(emotes: Emote[], inputText: string): Emote[] {
	return emotes.filter((x) =>
		x.name.toLowerCase().includes(inputText.toLowerCase())
	);
}

interface Emote {
	name: string;
	image: string;
}

interface GameRound {
	emotes: Emote[];
	acertos: number;
	completo: boolean;
}

function restartGame(): void {
	clearPeepo();
	clear(invalidChannel);
	clear(subtitle);
	acertos = 0;
	vidasRestantes = 4;
	clear(app);
	emotesList.length = 0;
	showLoading(inputChannel.value);
	getEmotesGame(inputChannel.value);
	hideElement(medalhas);
	resetVidas();
}

const getEmotesGame = async (channel: string): Promise<void> => {
	console.log(channel);
	acertos = 0;
	try {
		const data: Response = await fetch(
			//pega os emotes do canal especificado
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
		loadEmotesList(emotesList);
		hideRecorde();
		clear(app);
		clear(loading);
		showEmoteGame(emoteAtual);
		showEmoteTry();
		showAcertos.innerHTML = `${acertos}`;
		showVidas();
	} catch (error) {
		showPeepo();
		console.log(error);
		showInvalidChannel(channel);
		showAcertos.innerHTML = ``;
		clear(app);
		clearEmoteTry();
		clear(loading);
		hideVidas();
		showRecorde();
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
	clear(app);
	inputEmote.value = "";
	inputEmote.focus();
	showEmoteGame(emoteAtual);

};

const returnToHome = (): void => {
	showAcertos.innerHTML = ``;
	acertos = 0;
	vidasRestantes = 4;
	clear(app);
	clearEmoteTry();
	clear(loading);
	hideVidas();
	showRecorde();
	showPeepo();
	clear(invalidChannel);
	showElement(medalhas)
}

const gameplay = (): void => {
	if (inputEmote.value == emoteAtual.name) { //acerto
		acertos++;
		acertosSeguidos++;
		if (acertosSeguidos == 3 && vidasRestantes <= 4) {
			if (vidasRestantes == 4) {
				vidasRestantes = 4;
			}
			else {
				vidasRestantes++;
			}
			acertosSeguidos = 0;
			checkVidas(vidasRestantes);
		}
		inputEmote.setAttribute("placeholder", "Acertou!");
		inputEmote.style.boxShadow = "0 0 0 3px green";
		showAcertos.innerHTML = `${acertos}`;
		if (emotesList.length == 1) { //vitória
			alert("meu deus você literalmente acertou tudo. Parabéns... eu acho?");
			(inputChannel.value);
			returnToHome();
		}
		else {
			continueGame(emotesList);
		}
	} else { //erro
		acertosSeguidos = 0;
		vidasRestantes--
		checkVidas(vidasRestantes);
		inputEmote.style.boxShadow = "0 0 0 3px rgba(191, 2, 2)";
		inputEmote.setAttribute("placeholder", "Tente novamente");
		inputEmote.value = "";
		showAcertos.innerHTML = `${acertos}`;
		if (vidasRestantes > 0) {
			shakeInputWrong(inputEmote);
			clear(app);
			showEmoteGame(emoteAtual);
		}
		else if (vidasRestantes === 0) {
			shakeInputWrong(inputEmote);
			if (acertos > recorde) {
				recorde = acertos;
				localStorage.setItem("recorde", recorde.toString());
			}
			alert("Game Over! O Emote era '" + emoteAtual.name + "'. Você acertou " + acertos + " emotes! Tente novamente.");
			clear(app);
			restartGame();
		}
	}
};

function checkVidas(vidasRestantes: number): void {
	if (vidasRestantes === 4) {
		vida1.style.color = "red";
		vida2.style.color = "red";
		vida3.style.color = "red";
		vida4.style.color = "red";
	}
	if (vidasRestantes === 3) {
		vida1.style.color = "red";
		vida2.style.color = "red";
		vida3.style.color = "red";
		vida4.style.color = "gray";
	}
	else if (vidasRestantes === 2) {
		vida1.style.color = "red";
		vida2.style.color = "red";
		vida3.style.color = "gray";
		vida4.style.color = "gray";
	}
	else if (vidasRestantes === 1) {
		vida1.style.color = "red";
		vida2.style.color = "gray";
		vida3.style.color = "gray";
		vida4.style.color = "gray";
	}
	else if (vidasRestantes === 0) {
		vida1.style.color = "gray";
		vida2.style.color = "gray";
		vida3.style.color = "gray";
		vida4.style.color = "gray";
	}
}

function shakeInputWrong(input: HTMLElement) {
	setTimeout(() => {
		input.style.animation = "shake 0.2s";
		input.style.animationIterationCount = "1";
	}, 1);
	setTimeout(() => {
		input.style.animation = "none";
	}, 400);
}

const showEmote = (emote: Emote): void => {
	let output: string = `
    <a class="card">
		<div id= "blur">
		<img class="card--image" src=${emote.image} alt=${emote.name}
		style = "user-drag: none; user-select: none;"/>
		</div>
        <h1 class="card--name">${emote.name}</h1>
    </a>
    `;
	app.innerHTML += output;
};
const showEmoteGame = (emote: Emote): void => {
	let output: string = `
    <a class="card">

		<img class="card--image4" src=${emote.image} alt=${emote.name} />

    </a>
    `;
	app.innerHTML += output;
};

const showLoading = (channel: string): void => {
	let output: string = `
    <p id = "loadingText"> Carregando emotes de twitch.tv/${channel}...</p>
	<img id="loadingImg" src="https://cdn.7tv.app/emote/6154d7d86251d7e000db1727/4x.webp"/>
    `;
	loading.innerHTML += output;
};

const showInvalidChannel = (channel: string): void => {
	let output: string = `
    <p id = "invalidChannelText"> O canal ${channel} não foi encontrado...</p>
    `;
	invalidChannel.innerHTML += output;
};

function resetVidas() {
	vida1.style.color = "red";
	vida2.style.color = "red";
	vida3.style.color = "red";
	vida4.style.color = "red";
}

const getEmotenames = (emote: Emote[]): void => {
	emote.forEach((emote: Emote) => {
		emoteNames.push(emote.name);
	});
};

const clear = (container: HTMLElement): void => {
	container.innerHTML = ``;
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
