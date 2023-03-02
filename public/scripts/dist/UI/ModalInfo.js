export class ModalInfo {
    constructor() {
        this.helpBtn = document.getElementById("Help");
        this.dialog = document.querySelector("dialog");
        this.dialogCloseBtn = document.getElementById("modalCloseButton");
        this.modalHelp = document.getElementById("modalHelp");
        this.modalGameOver = document.getElementById("modalGameOver");
        this.modalWin = document.getElementById("modalWin");
        this.dialogTryAgainBtn = document.getElementById("dialogTryAgainButton");
        this.dialogHomeButtonGameOver = document.getElementById("dialogHomeButtonGameOver");
        this.dialogHomeButtonWin = document.getElementById("dialogHomeButtonWin");
        this.helpBtn.addEventListener("click", () => {
            this.dialog.showModal();
        });
        this.dialogCloseBtn.addEventListener("click", () => {
            this.dialog.close();
        });
    }
}
//# sourceMappingURL=ModalInfo.js.map