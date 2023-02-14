export function hideElement(element) {
    element.style.display = "none";
}
export function showElement(element) {
    element.style.display = "block";
}
export const clear = (container) => {
    container.innerHTML = ``;
};
export function shakeInputWrong(input) {
    setTimeout(() => {
        input.style.animation = "shake 0.2s";
        input.style.animationIterationCount = "1";
    }, 1);
    setTimeout(() => {
        input.style.animation = "none";
    }, 400);
}
export const showLoading = (channel, loading) => {
    let output = `
    <p id = "loadingText"> Carregando emotes de twitch.tv/${channel}...</p>
	<img id="loadingImg" src="https://cdn.7tv.app/emote/6154d7d86251d7e000db1727/4x.webp"/>
    `;
    loading.innerHTML += output;
};
export const showInvalidChannel = (channel, invalidChannel) => {
    let output = `
    <p id = "invalidChannelText"> O canal ${channel} não foi encontrado...</p>
    `;
    invalidChannel.innerHTML += output;
};
//# sourceMappingURL=util.js.map