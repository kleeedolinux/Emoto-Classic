export class User {
    constructor(name) {
        this.recorde = localStorage.getItem("Recorde") == null ? 0 : parseInt(localStorage.getItem("Recorde"));
        this.medalhas = document.getElementById("medalhas");
        this.recordeElement = document.getElementById("recorde");
        this.name = name;
        if (localStorage.getItem("Recorde") !== null) {
            this.recordeElement.innerHTML = `Recorde: ${this.recorde}`;
        }
        if (localStorage.getItem("Medalhas")) {
            this.medalhas.innerHTML = localStorage.getItem("Medalhas");
        }
    }
    //cria html codigo pra medalha ganha e salva no local storage
    addMedalha(channel) {
        if (localStorage.getItem("Medalhas") == null) {
            localStorage.setItem("Medalhas", `
		<div id="medalha">
			<img id="medalhaImg" src="/public/img/Medal.png" alt="medalha">
			<a id="nomeMedalha" target="_blank" href="https://twitch.tv/${channel}/about">${channel}</a>
		</div>
		`);
            this.medalhas.innerHTML = localStorage.getItem("Medalhas");
        }
        else {
            localStorage.setItem("Medalhas", localStorage.getItem("Medalhas") + `
		<div id="medalha">
			<img id="medalhaImg" src="/public/img/Medal.png" alt="medalha">
			<a id="nomeMedalha" target="_blank" href="https://twitch.tv/${channel}/about">${channel}</a>
		</div>
		`);
            this.medalhas.innerHTML = localStorage.getItem("Medalhas");
        }
    }
}
//# sourceMappingURL=User.js.map