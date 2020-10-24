interface sendEmailResponse {
    message: string,
}

async function sendMail(this: HTMLFormElement, ev: Event): Promise<void> {
    ev.preventDefault();
    const csrfToken = getCsrfToken();
    // No CSRF token
    if (csrfToken === null) {
        showError("CSRF token not found!");
        return;
    }
    const data = {
        recipients: composeRecipientsInput.value,
        subject: composeSubjectInput.value || "<No Subject>",
        body: composeBodyTextarea.value,
    };
    const responseUnchecked: potentialErrorResponse<sendEmailResponse> = await fetch("/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .catch(err => console.error(err));
    const response = checkError(responseUnchecked);
    if (response === null) return;
    load_mailbox("sent");
}

document.addEventListener("DOMContentLoaded", (): void => {
    composeForm = <HTMLFormElement>document.getElementById("compose-form")!;
    composeForm.addEventListener("submit", sendMail);
});
