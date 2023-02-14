export class Game {
    constructor(channel, emotesList, emoteNames, emoteAtual, acertos, acertosSeguidos, vidasRestantes, vidas, ui) {
        this.app = document.getElementById("app");
        this.loading = document.getElementById("loading");
        this.showAcertos = document.getElementById("acertos");
        this.showEmoteGame = (emote) => {
            let output = `
        <a class="card">
    
            <img class="card--image4" src=${emote.image} alt=${emote.name} />
    
        </a>
        `;
            this.app.innerHTML += output;
        };
        this.channel = channel;
        this.emotesList = emotesList;
        this.emoteNames = emoteNames;
        this.emoteAtual = emoteAtual;
        this.acertos = acertos;
        this.acertosSeguidos = acertosSeguidos;
        this.vidasRestantes = vidasRestantes;
        this.vidas = vidas;
        this.ui = ui;
    }
    getEmotenames(emote) {
        emote.forEach((emote) => {
            this.emoteNames.push(emote.name);
        });
    }
}
//# sourceMappingURL=game.js.map