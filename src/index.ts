//código mais scuffed que esse impossível

const container: HTMLElement = document.getElementById("app")!;
const loading: HTMLElement = document.getElementById("loading")!;
const emotesList: Emote[] = [];

const inputChannel: HTMLInputElement = document.getElementById(
	"channel"
)! as HTMLInputElement;

inputChannel.addEventListener("change", (): void => {
	clear(container);
	getEmotes(inputChannel.value);
});

interface Emote {
	name: string;
	image: string;
}

const getEmotes = async (channel: string): Promise<void> => {
	console.log(channel);

	loading.innerHTML = `<a class="card">
	<h1 class="card--name">Loading...</h1>
	</a>`; // achar um jeito de otimizar essa parte aqui

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
	emotes.forEach((emote: any) => {
		const emoteData: Emote = {
			name: emote.code,
			image: emote.urls[2].url,
		};
		showEmote(emoteData);
	});
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

// const fetchEmotes =(): void => {
//     for(let i = 0; i < emotesList.length; i++) {
//         showEmote(emotesList[i]);
//     }
// }
// fetchEmotes();
