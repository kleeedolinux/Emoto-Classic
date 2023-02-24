export class ModalInfo {
    constructor() {
        this.helpBtn = document.getElementById("Help");
        this.dialog = document.querySelector("dialog");
        this.dialogCloseBtn = document.getElementById("modalCloseButton");
        this.modalHelp = document.getElementById("modalHelp");
        this.modalGameOver = document.getElementById("modalGameOver");
        this.dialogTryAgainBtn = document.getElementById("dialogTryAgainButton");
        this.helpBtn.addEventListener("click", () => {
            this.dialog.showModal();
        });
        this.dialogCloseBtn.addEventListener("click", () => {
            this.dialog.close();
        });
    }
}
//# sourceMappingURL=ModalInfo.js.map