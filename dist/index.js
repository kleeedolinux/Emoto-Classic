"use strict";
//código mais scuffed que esse impossível
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
        while (_) try {
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
var container = document.getElementById("app");
var loading = document.getElementById("loading");
var showAcertos = document.getElementById("acertos");
var showTentativas = document.getElementById("tentativas");
var emotesList = [];
var tentativas = 0;
var emoteAtual;
var acertos = 0;
var inputChannel = document.getElementById("channel");
var inputEmote = document.getElementById("emoteTry");
inputChannel.addEventListener("change", function () {
    tentativas = 0;
    acertos = 0;
    showTentativas.innerHTML = "Tentativas: ".concat(tentativas);
    showAcertos.innerHTML = "Acertos: ".concat(acertos);
    clear(container);
    emotesList.length = 0;
    getEmotesGame(inputChannel.value);
});
var getEmotesShow = function (channel) { return __awaiter(void 0, void 0, void 0, function () {
    var data, emotes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(channel);
                return [4 /*yield*/, fetch("https://emotes.adamcy.pl/v1/channel/".concat(channel, "/emotes/twitch.7tv.bttv.ffz"), {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, data.json()];
            case 2:
                emotes = _a.sent();
                //pega os emotes do canal especificado
                emotes.forEach(function (emote) {
                    //para cada emote, exibir o nome e a imagem no site
                    var emoteData = {
                        name: emote.code,
                        image: emote.urls[1].url
                    };
                    showEmote(emoteData);
                });
                return [2 /*return*/];
        }
    });
}); };
var getEmotesGame = function (channel) { return __awaiter(void 0, void 0, void 0, function () {
    var data, emotes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(channel);
                return [4 /*yield*/, fetch("https://emotes.adamcy.pl/v1/channel/".concat(channel, "/emotes/twitch.7tv.bttv"), {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, data.json()];
            case 2:
                emotes = _a.sent();
                //pega os emotes do canal especificado
                emotes.forEach(function (emote) {
                    //adicionar cada emote no array emotesList
                    var emoteData = {
                        name: emote.code,
                        image: emote.urls[2].url
                    };
                    emotesList.push(emoteData);
                });
                emoteAtual = emotesList[Math.floor(Math.random() * emotesList.length)];
                showEmote(emoteAtual);
                return [2 /*return*/];
        }
    });
}); };
var gameplay = function () {
    if (inputEmote.value == emoteAtual.name) {
        alert("Acertou!");
        acertos++;
        showAcertos.innerHTML = "Acertos: ".concat(acertos);
        clear(container);
        getEmotesGame(inputChannel.value);
    }
    else {
        console.log(emoteAtual.name);
        alert("Errou!");
        tentativas++;
        showTentativas.innerHTML = "Tentativas: ".concat(tentativas);
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
var showEmote = function (emote) {
    var output = "\n    <a class=\"card\">\n        <img class=\"card--image\" src=".concat(emote.image, " alt=").concat(emote.name, " />\n        <h1 class=\"card--name\">").concat(emote.name, "</h1>\n    </a>\n    ");
    container.innerHTML += output;
};
var clear = function (container) {
    container.innerHTML = "";
};
//# sourceMappingURL=index.js.map