export class Modal {
    constructor() {
        this.helpBtn = document.getElementById("Help");
        this.dialog = document.querySelector("dialog");
        this.dialogCloseBtn = document.getElementById("modalCloseButton");
        this.helpBtn.addEventListener("click", () => {
            this.dialog.showModal();
        });
        this.dialogCloseBtn.addEventListener("click", () => {
            this.dialog.close();
        });
    }
}
//# sourceMappingURL=Modal.js.map