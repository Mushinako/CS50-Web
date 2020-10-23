async function sendMail(this: HTMLFormElement, ev: Event) {
    ev.preventDefault();
    const csrfToken = getCsrfToken();
    // No CSRF token
    if (csrfToken === null) {
        const errText = document.createTextNode("CSRF token not found!");
        while (errorViewDiv.lastChild) errorViewDiv.removeChild(errorViewDiv.lastChild);
        errorViewDiv.appendChild(errText);
        errorViewDiv.style.display = "block";
        return
    }
    const data = new FormData(this);
    const response = await fetch("/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: data,
    })
        .then(response => response.json())
        .catch(err => console.log(err));
}

document.addEventListener("DOMContentLoaded", (): void => {
    composeForm = <HTMLFormElement>document.getElementById("compose-form")!;
    composeForm.addEventListener("submit", sendMail);
});
