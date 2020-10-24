"use strict";
async function sendMail(ev) {
    ev.preventDefault();
    const csrfToken = getCsrfToken();
    if (csrfToken === null) {
        showError("CSRF token not found!");
        return;
    }
    const data = {
        recipients: composeRecipientsInput.value,
        subject: composeSubjectInput.value || "<No Subject>",
        body: composeBodyTextarea.value,
    };
    const response = await fetch("/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .catch(err => console.error(err));
    if (response?.message === undefined) {
        const errorMsg = response?.error ?? "No response got from server.";
        showError(errorMsg);
        return;
    }
    load_mailbox("sent");
}
document.addEventListener("DOMContentLoaded", () => {
    composeForm = document.getElementById("compose-form");
    composeForm.addEventListener("submit", sendMail);
});
