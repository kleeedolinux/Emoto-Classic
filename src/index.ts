//código mais scuffed que esse impossível

const container: HTMLElement = document.getElementById("app")!;
const loading: HTMLElement = document.getElementById("loading")!;
const showAcertos: HTMLElement = document.getElementById("acertos")!;
const showTentativas: HTMLElement = document.getElementById("tentativas")!;
const emotesList: Emote[] = [];
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
	// achar um jeito de otimizar essa parte aqui

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

	emotes.forEach((emote: any) => {
		//adicionar cada emote no array emotesList
		const emoteData: Emote = {
			name: emote.code,
			image: emote.urls[2].url,
		};
		emotesList.push(emoteData);
	});
	emoteAtual = emotesList[Math.floor(Math.random() * emotesList.length)];
	showEmote(emoteAtual);
};

const gameplay = (): void => {
	if (inputEmote.value == emoteAtual.name) {
		alert("Acertou!");
		acertos++;
		showAcertos.innerHTML = `Acertos: ${acertos}`;
		clear(container);
		getEmotesGame(inputChannel.value);
	} else {
		console.log(emoteAtual.name);
		alert("Errou!");
		tentativas++;
		showTentativas.innerHTML = `Tentativas: ${tentativas}`;
		if (tentativas === 3) {
			alert("Game Over!");
			tentativas = 0;
			clear(container);
			getEmotesGame(inputChannel.value);
		}
	}

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

const clear = (container: HTMLElement): void => {
	container.innerHTML = "";
};
