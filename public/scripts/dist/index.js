"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var app = document.getElementById("app");
var loading = document.getElementById("loading");
var showAcertos = document.getElementById("acertos");
var showTentativas = document.getElementById("tentativas");
var score = document.getElementById("score");
var container2 = document.getElementById("container2");
document.addEventListener("contextmenu", function (event) { return event.preventDefault(); });
var emotesList = [];
var emoteNames = [];
var tentativas = 0;
var emoteAtual;
var acertos = 0;
var inputChannel = document.getElementById("channelInput");
var inputEmote = document.getElementById("emoteTry");
inputChannel.addEventListener("change", function () {
    tentativas = 0;
    acertos = 0;
    clear(app);
    emotesList.length = 0;
    showLoading(inputChannel.value);
    getEmotesGame(inputChannel.value);
});
inputEmote.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        gameplay();
    }
});
function showEmoteTry() {
    inputEmote.style.display = "block";
    inputEmote.focus();
}
var getEmotesGame = function (channel) { return __awaiter(void 0, void 0, void 0, function () {
    var data, emotes, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(channel);
                tentativas = 0;
                acertos = 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch("https://emotes.adamcy.pl/v1/channel/".concat(channel, "/emotes/twitch.7tv.bttv"), {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })];
            case 2:
                data = _a.sent();
                return [4 /*yield*/, data.json()];
            case 3:
                emotes = _a.sent();
                //pega os emotes do canal especificado
                emotesList.length = 0;
                emoteNames.length = 0;
                emotes.forEach(function (emote) {
                    //adicionar cada emote no array emotesList
                    var emoteData = {
                        name: emote.code,
                        image: emote.urls[2].url
                    };
                    emotesList.push(emoteData);
                });
                getEmotenames(emotesList);
                emoteAtual = emotesList[Math.floor(Math.random() * emotesList.length)];
                clear(app);
                clear(loading);
                showEmoteGame(emoteAtual);
                showEmoteTry();
                showTentativas.innerHTML = "Tentativas: ".concat(tentativas);
                showAcertos.innerHTML = "Acertos: ".concat(acertos);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                alert("Canal não encontrado");
                showTentativas.innerHTML = "";
                showAcertos.innerHTML = "";
                clear(app);
                inputEmote.style.display = "none";
                clear(loading);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
//Remove emote acertado do array de emotes
//Dá outro emote da lista para a variavel emoteAtual
//limpa o output do emote anterior
//exibe o novo emote
var continueGame = function (emotesList) {
    emotesList.splice(emotesList.indexOf(emoteAtual), 1);
    emoteNames.splice(emoteNames.indexOf(emoteAtual.name), 1);
    emoteAtual = emotesList[Math.floor(Math.random() * emotesList.length)];
    clear(app);
    inputEmote.value = "";
    showEmoteGame(emoteAtual);
};
var gameplay = function () {
    if (inputEmote.value == emoteAtual.name) {
        inputEmote.style.boxShadow = "0 0 0 3px rgb(0, 128, 0)";
        acertos++;
        tentativas = 0;
        showAcertos.innerHTML = "Acertos: ".concat(acertos);
        showTentativas.innerHTML = "Tentativas: ".concat(tentativas);
        continueGame(emotesList);
    }
    else {
        inputEmote.style.boxShadow = "0 0 0 3px rgba(191, 2, 2)";
        console.log(emoteAtual.name);
        tentativas++;
        showAcertos.innerHTML = "Acertos: ".concat(acertos);
        showTentativas.innerHTML = "Tentativas: ".concat(tentativas);
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
var showEmote = function (emote) {
    var output = "\n    <a class=\"card\">\n\t\t<div id= \"blur\">\n\t\t<img class=\"card--image\" src=".concat(emote.image, " alt=").concat(emote.name, " />\n\t\t</div>\n        <h1 class=\"card--name\">").concat(emote.name, "</h1>\n    </a>\n    ");
    app.innerHTML += output;
};
var showEmoteGame = function (emote) {
    var output = "\n    <a class=\"card\">\n\t\t\n\t\t<img class=\"card--image\" src=".concat(emote.image, " alt=").concat(emote.name, " />\n\t\t\n    </a>\n    ");
    app.innerHTML += output;
};
var showEmoteGame2 = function (emote) {
    var output = "\n    <a class=\"card\">\n\t\t\n\t\t<img class=\"card--image2\" src=".concat(emote.image, " alt=").concat(emote.name, " />\n\t\t\n    </a>\n    ");
    app.innerHTML += output;
};
var showEmoteGame3 = function (emote) {
    var output = "\n    <a class=\"card\">\n\t\t\n\t\t<img class=\"card--image3\" src=".concat(emote.image, " alt=").concat(emote.name, " />\n\t\t\n    </a>\n    ");
    app.innerHTML += output;
};
var showEmoteGame4 = function (emote) {
    var output = "\n    <a class=\"card\">\n\t\t\n\t\t<img class=\"card--image4\" src=".concat(emote.image, " alt=").concat(emote.name, " />\n\t\t\n    </a>\n    ");
    app.innerHTML += output;
};
var showLoading = function (channel) {
    var output = "\n    <p> Carregando Emotes de ".concat(channel, "...</p>\n    ");
    loading.innerHTML += output;
};
var getEmotenames = function (emote) {
    emote.forEach(function (emote) {
        emoteNames.push(emote.name);
    });
};
var clear = function (container) {
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
//# sourceMappingURL=index.js.map