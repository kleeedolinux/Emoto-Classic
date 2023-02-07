const app: HTMLElement = document.getElementById("app")!;
const loading: HTMLElement = document.getElementById("loading")!;
const showAcertos: HTMLElement = document.getElementById("acertos")!;
const showTentativas: HTMLElement = document.getElementById("tentativas")!;
const score: HTMLElement = document.getElementById("score")!;
const container2: HTMLElement = document.getElementById("container2")!;
const invalidChannel: HTMLElement = document.getElementById("invalidChannel")!;
const subtitle: HTMLElement = document.getElementById("subtitle")!;

document.addEventListener("contextmenu", (event) => event.preventDefault());


const autocomplete = new Autocomplete("input", ["apple", "banana", "cherry"]);

const emotesList: Emote[] = [];
const emoteNames: string[] = [];

var tentativas: number = 0;
var emoteAtual: Emote;
var acertos: number = 0;

const inputChannel: HTMLInputElement = document.getElementById(
	"channelInput"
)! as HTMLInputElement;

const inputEmote: HTMLInputElement = document.getElementById(
	"emoteTry"
)! as HTMLInputElement;

inputChannel.addEventListener("change", (): void => {
	clear(invalidChannel)
	clear(subtitle)
	tentativas = 0;
	acertos = 0;
	clear(app);
	emotesList.length = 0;
	showLoading(inputChannel.value);
	getEmotesGame(inputChannel.value);
});

inputEmote.addEventListener("keydown", (e: KeyboardEvent) => {
	if (e.key === "Enter") {
		gameplay();
	}
});



function showEmoteTry(): void {
	inputEmote.style.display = "block";
	inputEmote.focus();
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
		clear(app);
		clear(loading);
		showEmoteGame(emoteAtual);
		showEmoteTry();
		showTentativas.innerHTML = `Tentativas: ${tentativas}`;
		showAcertos.innerHTML = `Acertos: ${acertos}`;
	} catch (error) {
		showInvalidChannel(channel);
		showTentativas.innerHTML = ``;
		showAcertos.innerHTML = ``;
		clear(app);
		inputEmote.style.display = "none";
		clear(loading);
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
	showEmoteGame(emoteAtual);
};

const gameplay = (): void => {
	if (inputEmote.value == emoteAtual.name) {
		inputEmote.style.boxShadow = "0 0 0 3px rgb(0, 128, 0)";
		acertos++;
		tentativas = 0;
		showAcertos.innerHTML = `Acertos: ${acertos}`;
		showTentativas.innerHTML = `Tentativas: ${tentativas}`;
		continueGame(emotesList);
	} else {
		inputEmote.style.boxShadow = "0 0 0 3px rgba(191, 2, 2)";
		console.log(emoteAtual.name);
		tentativas++;
		showAcertos.innerHTML = `Acertos: ${acertos}`;
		showTentativas.innerHTML = `Tentativas: ${tentativas}`;
		if (tentativas === 1) {
			clear(app);
			showEmoteGame2(emoteAtual);
		}
		if (tentativas === 2) {
			clear(app);
			showEmoteGame3(emoteAtual);
		}
		if (tentativas === 3) {
			clear(app);
			showEmoteGame4(emoteAtual);
		}
		if (tentativas === 4) {
			alert("Game Over!");
			clear(app);
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
	app.innerHTML += output;
};

const showEmoteGame = (emote: Emote): void => {
	let output: string = `
    <a class="card">
		
		<img class="card--image" src=${emote.image} alt=${emote.name} />
		
    </a>
    `;
	app.innerHTML += output;
};

const showEmoteGame2 = (emote: Emote): void => {
	let output: string = `
    <a class="card">
		
		<img class="card--image2" src=${emote.image} alt=${emote.name} />
		
    </a>
    `;
	app.innerHTML += output;
};

const showEmoteGame3 = (emote: Emote): void => {
	let output: string = `
    <a class="card">
		
		<img class="card--image3" src=${emote.image} alt=${emote.name} />
		
    </a>
    `;
	app.innerHTML += output;
};

const showEmoteGame4 = (emote: Emote): void => {
	let output: string = `
    <a class="card">
		
		<img class="card--image4" src=${emote.image} alt=${emote.name} />
		
    </a>
    `;
	app.innerHTML += output;
};

const showLoading = (channel: string): void => {
	let output: string = `
    <p id = "loadingText"> Carregando Emotes de twitch.tv/${channel}...</p>
	<img id="loadingImg" src="/public/img/loading.gif"/>
    `;
	loading.innerHTML += output;
};

const showInvalidChannel = (channel: string): void => {
	let output: string = `
    <p id = "invalidChannelText"> Canal ${channel} não foi encontrado...</p>
    `;
	invalidChannel.innerHTML += output;
};

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