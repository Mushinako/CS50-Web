async function sendMail(this: HTMLFormElement, ev: Event) {
    ev.preventDefault();
    const csrfToken = getCsrfToken();
    if (csrfToken === null) { }
    console.log(this);
}

document.addEventListener("DOMContentLoaded", (): void => {
    const composeForm = <HTMLFormElement>document.getElementById("compose-form")!;
    composeForm.addEventListener("submit", sendMail);
});