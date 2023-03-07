export class ModalInfo {
    helpBtn: HTMLElement = document.getElementById("Help")!;
    dialog: HTMLDialogElement = document.querySelector("dialog") as HTMLDialogElement;
    dialogCloseBtn = document.getElementById("modalCloseButton")!;
    modalHelp = document.getElementById("modalHelp")!;
    modalGameOver = document.getElementById("modalGameOver")!;
    modalWin = document.getElementById("modalWin")!;
    dialogTryAgainBtn = document.getElementById("dialogTryAgainButton")!;
    dialogHomeButtonGameOver = document.getElementById("dialogHomeButtonGameOver")!;
    dialogHomeButtonWin = document.getElementById("dialogHomeButtonWin")!;
    dialogTwitterButtonWin = document.getElementById("dialogTwitterButtonWin")!;
    dialogTwitterButtonGameOver = document.getElementById("dialogTwitterButtonGameOver")!;

    constructor() {
        this.helpBtn.addEventListener("click", () => {
            this.dialog.showModal();
        });
        this.dialogCloseBtn.addEventListener("click", () => {
            this.dialog.close();
        })
    }
}