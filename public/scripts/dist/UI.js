import { Modal } from "./modal.js";
export class UI extends Modal {
    constructor() {
        super();
        this.titleEmoto = document.querySelector(".title");
        this.subtitle = document.getElementById("subtitle");
        this.subtitle2 = document.getElementById("subtitle2");
        this.peepoThink = document.getElementById("peepoThink");
        this.titleEmoto.addEventListener("click", () => {
            window.location.reload();
        });
    }
}
//# sourceMappingURL=UI.js.map