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
var score = document.getElementById("score");
var emoteTryContainer = document.getElementById("emoteTryContainer");
var invalidChannel = document.getElementById("invalidChannel");
var title = document.getElementById("title");
var subtitle = document.getElementById("subtitle");
var subtitle2 = document.getElementById("subtitle2");
var peepoThink = document.getElementById("peepoThink");
var vidas = document.getElementById("vidas");
var vida1 = document.getElementById("vida1");
var vida2 = document.getElementById("vida2");
var vida3 = document.getElementById("vida3");
var vida4 = document.getElementById("vida4");
var recordeElement = document.getElementById("recorde");
var helpBtn = document.getElementById("Help");
var dialog = document.querySelector("dialog");
var dialogCloseBtn = document.getElementById("modalCloseButton");
var titleEmoto = document.querySelector(".title");
titleEmoto.addEventListener("click", function () {
    window.location.reload();
});
helpBtn.addEventListener("click", function () {
    dialog.showModal();
});
dialogCloseBtn.addEventListener("click", function () {
    dialog.close();
});
var emotesListAutocomplete = document.getElementById("emotes-list");
document.addEventListener("contextmenu", function (event) { return event.preventDefault(); });
var emotesList = [];
var emoteNames = [];
var emoteAtual;
var acertos = 0;
var acertosSeguidos = 0;
var vidasRestantes = 4;
var recorde = 0;
var localRecorde = localStorage.getItem("recorde");
if (localRecorde) {
    recordeElement.innerHTML = "Seu Recorde: ".concat(localRecorde);
    recorde = parseInt(localRecorde);
}
var inputChannel = document.getElementById("channelInput");
var inputEmote = document.getElementById("emoteTry");
inputChannel.addEventListener("change", function () {
    restartGame();
    subtitle2.style.display = "none";
});
inputChannel.addEventListener("focus", function () {
    showSubtitle2();
});
inputChannel.addEventListener("blur", function () {
    hideSubtitle2();
});
inputEmote.addEventListener("input", function () {
    var filteredList = filterEmotesList(emotesList, inputEmote.value);
    loadEmotesList(filteredList);
    showAutocomplete();
});
inputEmote.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        gameplay();
        hideAutocomplete();
    }
});
emotesListAutocomplete.addEventListener("click", function (e) {
    var target = e.target;
    if (target.classList.contains("autocomplete-item")) {
        inputEmote.value = target.innerText;
        console.log(target.innerText);
        inputEmote.focus();
        hideAutocomplete();
    }
});
emotesListAutocomplete.addEventListener("keydown", function (e) {
    var target = e.target;
    if (target.classList.contains("autocomplete-item") && e.key === "Enter") {
        inputEmote.value = target.innerText;
        console.log(target.innerText);
        inputEmote.focus();
        gameplay();
        hideAutocomplete();
    }
});
function showEmoteTry() {
    emoteTryContainer.style.display = "block";
    inputEmote.style.display = "block";
    hideAutocomplete();
    inputEmote.focus();
}
function clearEmoteTry() {
    emoteTryContainer.style.display = "none";
}
function hideAutocomplete() {
    emotesListAutocomplete.style.display = "none";
}
function showAutocomplete() {
    emotesListAutocomplete.style.display = "block";
}
function showPeepo() {
    peepoThink.style.display = "block";
}
function clearPeepo() {
    peepoThink.style.display = "none";
}
function hideVidas() {
    vidas.style.display = "none";
}
function showVidas() {
    vidas.style.display = "block";
}
function showRecorde() {
    recordeElement.style.display = "block";
}
function hideRecorde() {
    recordeElement.style.display = "none";
}
function showSubtitle2() {
    subtitle2.style.display = "block";
}
function hideSubtitle2() {
    subtitle2.style.display = "none";
}
function loadEmotesList(emotes) {
    if (emotes.length > 0) {
        emotesListAutocomplete.innerHTML = "";
        var innerElement_1 = "";
        emotes.forEach(function (emote) {
            innerElement_1 += "<li class=\"autocomplete-item\" tabindex = \"0\">".concat(emote.name, "</li>");
        });
        emotesListAutocomplete.innerHTML = innerElement_1;
    }
}
function filterEmotesList(emotes, inputText) {
    return emotes.filter(function (x) {
        return x.name.toLowerCase().includes(inputText.toLowerCase());
    });
}
function restartGame() {
    clearPeepo();
    clear(invalidChannel);
    clear(subtitle);
    acertos = 0;
    vidasRestantes = 4;
    clear(app);
    emotesList.length = 0;
    showLoading(inputChannel.value);
    getEmotesGame(inputChannel.value);
    resetVidas();
}
var getEmotesGame = function (channel) { return __awaiter(void 0, void 0, void 0, function () {
    var data, emotes, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(channel);
                acertos = 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch(
                    //pega os emotes do canal especificado
                    "https://emotes.adamcy.pl/v1/channel/".concat(channel, "/emotes/twitch.7tv.bttv"), {
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
                loadEmotesList(emotesList);
                hideRecorde();
                clear(app);
                clear(loading);
                showEmoteGame4(emoteAtual);
                showEmoteTry();
                showAcertos.innerHTML = "".concat(acertos);
                showVidas();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                showPeepo();
                console.log(error_1);
                showInvalidChannel(channel);
                showAcertos.innerHTML = "";
                clear(app);
                clearEmoteTry();
                clear(loading);
                hideVidas();
                showRecorde();
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
    inputEmote.focus();
    showEmoteGame4(emoteAtual);
};
var gameplay = function () {
    if (emotesList.length === 0) { //vitória
        alert("meu deus você literalmente acertou tudo. Parabéns... eu acho?");
        clear(app);
        restartGame();
    }
    else if (inputEmote.value == emoteAtual.name) { //acerto
        acertos++;
        acertosSeguidos++;
        if (acertosSeguidos == 3 && vidasRestantes <= 4) {
            console.log(acertosSeguidos);
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
        showAcertos.innerHTML = "".concat(acertos);
        continueGame(emotesList);
    }
    else { //erro
        acertosSeguidos = 0;
        console.log(acertosSeguidos);
        vidasRestantes--;
        console.log(vidasRestantes);
        checkVidas(vidasRestantes);
        inputEmote.style.boxShadow = "0 0 0 3px rgba(191, 2, 2)";
        inputEmote.setAttribute("placeholder", "Tente novamente");
        inputEmote.value = "";
        showAcertos.innerHTML = "".concat(acertos);
        if (vidasRestantes > 0) {
            shakeInputWrong(inputEmote);
            clear(app);
            showEmoteGame4(emoteAtual);
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
function checkVidas(vidasRestantes) {
    if (vidasRestantes === 4) {
        vida1.style.color = "red";
        vida2.style.color = "red";
        vida3.style.color = "red";
        vida4.style.color = "red";
        console.log("4 vidas");
    }
    if (vidasRestantes === 3) {
        vida1.style.color = "red";
        vida2.style.color = "red";
        vida3.style.color = "red";
        vida4.style.color = "gray";
        console.log("3 vidas");
    }
    else if (vidasRestantes === 2) {
        vida1.style.color = "red";
        vida2.style.color = "red";
        vida3.style.color = "gray";
        vida4.style.color = "gray";
        console.log("2 vidas");
    }
    else if (vidasRestantes === 1) {
        vida1.style.color = "red";
        vida2.style.color = "gray";
        vida3.style.color = "gray";
        vida4.style.color = "gray";
        console.log("1 vida");
    }
    else if (vidasRestantes === 0) {
        vida1.style.color = "gray";
        vida2.style.color = "gray";
        vida3.style.color = "gray";
        vida4.style.color = "gray";
        console.log("0 vidas");
    }
}
function shakeInputWrong(input) {
    setTimeout(function () {
        input.style.animation = "shake 0.2s";
        input.style.animationIterationCount = "1";
    }, 1);
    setTimeout(function () {
        input.style.animation = "none";
    }, 400);
}
var showEmote = function (emote) {
    var output = "\n    <a class=\"card\">\n\t\t<div id= \"blur\">\n\t\t<img class=\"card--image\" src=".concat(emote.image, " alt=").concat(emote.name, " \n\t\tstyle = \"user-drag: none; user-select: none;\"/>\n\t\t</div>\n        <h1 class=\"card--name\">").concat(emote.name, "</h1>\n    </a>\n    ");
    app.innerHTML += output;
};
var showEmoteGame = function (emote) {
    var output = "\n    <a class=\"card\">\n\t\t\n\t\t<img class=\"card--image\" src=".concat(emote.image, " alt=").concat(emote.name, "/>\n\t\t\n    </a>\n    ");
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
    var output = "\n    <p id = \"loadingText\"> Carregando emotes de twitch.tv/".concat(channel, "...</p>\n\t<img id=\"loadingImg\" src=\"https://cdn.7tv.app/emote/6154d7d86251d7e000db1727/4x.webp\"/>\n    ");
    loading.innerHTML += output;
};
var showInvalidChannel = function (channel) {
    var output = "\n    <p id = \"invalidChannelText\"> O canal ".concat(channel, " n\u00E3o foi encontrado...</p>\n    ");
    invalidChannel.innerHTML += output;
};
function resetVidas() {
    vida1.style.color = "red";
    vida2.style.color = "red";
    vida3.style.color = "red";
    vida4.style.color = "red";
}
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