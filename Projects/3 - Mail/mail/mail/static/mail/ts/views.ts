interface emailInfo {
    id: number,
    sender: string,
    recipients: string[],
    subject: string,
    body: string,
    timestamp: string,
    read: boolean,
    archived: boolean,
}

type mailboxType = "inbox" | "sent" | "archive";

function compose_email(): void {
    // Show compose view and hide other views
    emailsViewDiv.style.display = 'none';
    composeViewDiv.style.display = 'block';

    // Clear out composition fields
    composeRecipientsInput.value = '';
    composeSubjectInput.value = '';
    composeBodyTextarea.value = '';
}

async function load_mailbox(mailbox: mailboxType): Promise<void> {
    // Show the mailbox and hide other views
    emailsViewDiv.style.display = 'block';
    composeViewDiv.style.display = 'none';

    // Show the mailbox name
    clearChildren(emailsViewDiv);
    const titleH3 = createElement("h3", {
        text: mailbox.charAt(0).toUpperCase() + mailbox.slice(1),
    });
    emailsViewDiv.appendChild(titleH3);

    // Get email data from API
    const emailsUnchecked: potentialErrorResponse<emailInfo[]> = await fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .catch(err => console.error(err));

    const emails = checkError(emailsUnchecked);
    if (emails === null) return;

    for (const email of emails) {
        const emailDiv = createEmailPreviewDiv(email, mailbox);
        emailsViewDiv.appendChild(emailDiv);
    }
}

async function load_email(id: number): Promise<void> {
    // Mark email read
    fetch

    // Show the mailbox and hide other views
    emailsViewDiv.style.display = 'block';
    composeViewDiv.style.display = 'none';

    clearChildren(emailsViewDiv);

    const emailUnchecked: potentialErrorResponse<emailInfo> = await fetch(`/emails/${id}`)
        .then(response => response.json())
        .catch(err => console.error(err));
    const email = checkError(emailUnchecked);
    if (email === null) return;

    const emailDiv = createEmailDetailsDiv(email);
    emailsViewDiv.appendChild(emailDiv);
}