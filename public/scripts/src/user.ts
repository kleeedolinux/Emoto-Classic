export class User {
    name: string;
    recorde: number;
    medalhas: HTMLElement = document.getElementById("medalhas")!;
    recordeElement: HTMLElement = document.getElementById("recorde")!;

    constructor(name: string, recorde: number) {
        this.name = name;
        this.recorde = recorde;
    }

    //cria html codigo pra medalha ganha e salva no local storage
    addMedalha(channel: string) {
        if (localStorage.getItem("Medalhas") == null) {
            localStorage.setItem("Medalhas", `
		<div id="medalha">
			<img id="medalhaImg" src="/public/img/Medal.png" alt="medalha">
			<a id="nomeMedalha" target="_blank" href="https://twitch.tv/${channel}/about">${channel}</a>
		</div>
		`)
            this.medalhas.innerHTML = localStorage.getItem("Medalhas")!;
        } else {
            localStorage.setItem("Medalhas", localStorage.getItem("Medalhas") + `
		<div id="medalha">
			<img id="medalhaImg" src="/public/img/Medal.png" alt="medalha">
			<a id="nomeMedalha" target="_blank" href="https://twitch.tv/${channel}/about">${channel}</a>
		</div>
		`)
            this.medalhas.innerHTML = localStorage.getItem("Medalhas")!;
        }
    }
}