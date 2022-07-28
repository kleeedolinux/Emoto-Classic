//código mais scuffed que esse impossível

const container: HTMLElement = document.getElementById("app")!;
const loading: HTMLElement = document.getElementById("loading")!;
const emotesList: Emote[] = [];

const inputChannel: HTMLInputElement = document.getElementById(
	"channel"
)! as HTMLInputElement;

const inputEmote: HTMLInputElement = document.getElementById(
	"emoteTry"
)! as HTMLInputElement;

inputChannel.addEventListener("change", (): void => {
	clear(container);
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
	var emoteAtual: Emote = emotesList[0];
	var erros: number = 0;

	//ESSA LOGICA TA QUEBRADA MAS TAMO CHEGANDO PERTOOOOOOOOOOOOOOOOO LESFUCKINGOOOOOOOO
	for (let i = 0; i < 4; i++) {
		emoteAtual =
			emotesList[Math.floor(Math.random() * emotesList.length)];
			console.log(emoteAtual.name);
		inputEmote.addEventListener("change", (): void => {
			
			if (inputEmote.value === emoteAtual.name) {
				inputEmote.value = "";
				alert("Acertou!");
				return;
			} else {
				alert("Não acertou");
				erros++;
				console.log(erros);
			}
		});
	}
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
