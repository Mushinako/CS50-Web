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

function compose_email(): void {
    // Show compose view and hide other views
    errorViewDiv.style.display = "none";
    emailsViewDiv.style.display = 'none';
    composeViewDiv.style.display = 'block';

    // Clear out composition fields
    composeRecipientsInput.value = '';
    composeSubjectInput.value = '';
    composeBodyTextarea.value = '';
}

async function load_mailbox(mailbox: "inbox" | "sent" | "archive"): Promise<void> {
    // Show the mailbox and hide other views
    errorViewDiv.style.display = "none";
    emailsViewDiv.style.display = 'block';
    composeViewDiv.style.display = 'none';

    // Show the mailbox name
    clearChildren(emailsViewDiv);
    const titleEl = document.createElement("h3");
    emailsViewDiv.appendChild(titleEl);
    const titleText = document.createTextNode(mailbox.charAt(0).toUpperCase() + mailbox.slice(1));
    titleEl.appendChild(titleText);

    // Get email data from API
    const emails: emailInfo[] = await fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .catch(err => console.error(err));

    for (const email of emails) {
        const emailDiv = document.createElement("div");
        emailDiv.classList.add("email-preview");
        emailDiv.addEventListener("click", () => load_email(email.id));
        emailsViewDiv.appendChild(emailDiv);

        const senderDiv = document.createElement("div");
        senderDiv.classList.add("email-sender");
        emailDiv.appendChild(senderDiv);
        const senderText = document.createTextNode(email.sender);
        senderDiv.appendChild(senderText);

        const subjectDiv = document.createElement("div");
        subjectDiv.classList.add("email-title");
        emailDiv.appendChild(subjectDiv);
        const subjectText = document.createTextNode(email.subject);
        subjectDiv.appendChild(subjectText);

        const bodyDiv = document.createElement("div");
        bodyDiv.classList.add("email-body");
        emailDiv.appendChild(bodyDiv);
        const bodyText = document.createTextNode(email.body);
        bodyDiv.appendChild(bodyText);
    }
}

async function load_email(id: number): Promise<void> { }