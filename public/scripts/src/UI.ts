import { Modal } from "./modal.js";

export class UI extends Modal{
    titleEmoto: HTMLElement = document.querySelector(".title")!;
    subtitle: HTMLElement = document.getElementById("subtitle")!;
    subtitle2: HTMLElement = document.getElementById("subtitle2")!;
    peepoThink: HTMLElement = document.getElementById("peepoThink")!;

    constructor() {
        super();
        this.titleEmoto.addEventListener("click", () => {
            window.location.reload();
        });
    }
}