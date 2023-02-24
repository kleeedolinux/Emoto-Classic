export class ModalGameOver {
    constructor() {
        this.dialog = document.querySelector("dialog");
        this.dialogTryAgainBtn = document.getElementById("dialogTryAgainButton");
        this.dialogTryAgainBtn.addEventListener("click", () => {
            this.dialog.close();
        });
    }
}
//# sourceMappingURL=ModalGameOver.js.map