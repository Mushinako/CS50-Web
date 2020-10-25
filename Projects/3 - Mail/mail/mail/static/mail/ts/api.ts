async function fetchMailbox(mailbox: MailboxType): Promise<EmailInfo[] | null> {
    const emailsUnchecked: PotentialErrorResponse<EmailInfo[]> = await fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .catch(err => console.error(err));
    const emails = checkError(emailsUnchecked);

    return emails;
}

async function fetchEmail(id: number): Promise<EmailInfo | null> {
    const emailUnchecked: PotentialErrorResponse<EmailInfo> = await fetch(`/emails/${id}`)
        .then(response => response.json())
        .catch(err => console.error(err));
    const email = checkError(emailUnchecked);

    return email;
}

async function fetchSendEmail(emailData: SendEmailData): Promise<SendEmailResponse | null> {
    const csrfToken = getCsrfToken();
    // No CSRF token
    if (csrfToken === null) {
        showError("CSRF token not found!");
        return null;
    }

    const responseUnchecked: PotentialErrorResponse<SendEmailResponse> = await fetch("/emails", {
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

async function fetchChangeEmailStatus(id: number, emailStatus: ChangeEmailStatusData): Promise<boolean> {
    const csrfToken = getCsrfToken();
    // No CSRF token
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

function checkError<T extends object>(response: PotentialErrorResponse<T>): T | null {
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
