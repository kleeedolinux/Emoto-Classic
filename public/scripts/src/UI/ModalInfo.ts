export class ModalInfo {
    helpBtn: HTMLElement = document.getElementById("Help")!;
    dialog: HTMLDialogElement = document.querySelector("dialog") as HTMLDialogElement;
    dialogCloseBtn = document.getElementById("modalCloseButton")!;
    modalHelp = document.getElementById("modalHelp")!;
    modalGameOver = document.getElementById("modalGameOver")!;
    dialogTryAgainBtn = document.getElementById("dialogTryAgainButton")!;

    constructor() {
        this.helpBtn.addEventListener("click", () => {
            this.dialog.showModal();
        });
        this.dialogCloseBtn.addEventListener("click", () => {
            this.dialog.close();
        })
    }
}