"use strict";
async function fetchMailbox(mailbox) {
    const emailsUnchecked = await fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .catch(err => console.error(err));
    const emails = checkError(emailsUnchecked);
    return emails;
}
async function fetchEmail(id) {
    const emailUnchecked = await fetch(`/emails/${id}`)
        .then(response => response.json())
        .catch(err => console.error(err));
    const email = checkError(emailUnchecked);
    return email;
}
async function fetchSendEmail(emailData) {
    const csrfToken = getCsrfToken();
    if (csrfToken === null) {
        showError("CSRF token not found!");
        return null;
    }
    const responseUnchecked = await fetch("/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(emailData),
    })
        .then(response => response.json())
        .catch(err => console.error(err));
    const response = checkError(responseUnchecked);
    return response;
}
async function fetchChangeEmailStatus(id, emailStatus) {
    const csrfToken = getCsrfToken();
    if (csrfToken === null) {
        showError("CSRF token not found!");
        return false;
    }
    await fetch(`/emails/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(emailStatus),
    });
    return true;
}
function checkError(response) {
    if (response === undefined) {
        showError("No response got from server.");
        return null;
    }
    if ("error" in response) {
        showError(response.error);
        return null;
    }
    return response;
}
