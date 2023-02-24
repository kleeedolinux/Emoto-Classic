export class ModalInfo{ 
    helpBtn: HTMLElement = document.getElementById("Help")!;
    dialog = document.querySelector("dialog")!;
    dialogCloseBtn = document.getElementById("modalCloseButton")!;

    constructor() {
        this.helpBtn.addEventListener("click", () => {
            this.dialog.showModal();
        });

        this.dialogCloseBtn.addEventListener("click", () => {
            this.dialog.close();
        });
    }
}