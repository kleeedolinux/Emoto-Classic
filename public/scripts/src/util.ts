export function hideElement(element: HTMLElement): void {
    element.style.display = "none";
}

export function showElement(element: HTMLElement): void {
    element.style.display = "block";
}

export const clear = (container: HTMLElement): void => {
    container.innerHTML = ``;
};

export function shakeInputWrong(input: HTMLElement) {
    setTimeout(() => {
        input.style.animation = "shake 0.2s";
        input.style.animationIterationCount = "1";
    }, 1);
    setTimeout(() => {
        input.style.animation = "none";
    }, 400);
}

export const showLoading = (channel: string, loading: HTMLElement): void => {
    let output: string = `
    <p id = "loadingText"> Carregando emotes de twitch.tv/${channel}...</p>
	<img id="loadingImg" src="https://cdn.7tv.app/emote/6154d7d86251d7e000db1727/4x.webp"/>
    `;
    loading.innerHTML += output;
};

export const showInvalidChannel = (channel: string, invalidChannel: HTMLElement): void => {
    let output: string = `
    <p id = "invalidChannelText"> O canal ${channel} não foi encontrado...</p>
    `;
    invalidChannel.innerHTML += output;
};