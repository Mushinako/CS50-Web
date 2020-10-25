function composeEmail(): void {
    // Show compose view and hide other views
    emailsViewDiv.style.display = 'none';
    composeViewDiv.style.display = 'block';

    // Clear out composition fields
    composeRecipientsInput.value = '';
    composeSubjectInput.value = '';
    composeBodyTextarea.value = '';
}

async function loadMailbox(mailbox: MailboxType): Promise<void> {
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
    const emails = await fetchMailbox(mailbox);
    if (emails === null) return;

    for (const email of emails) {
        const emailDiv = createEmailPreviewDiv(email, mailbox);
        emailsViewDiv.appendChild(emailDiv);
    }
}

async function loadEmail(id: number, loadFromPreview: boolean = false): Promise<void> {
    // Mark email read
    if (loadFromPreview) {
        await fetchChangeEmailStatus(id, {
            read: true,
        });
    }

    // Show the mailbox and hide other views
    emailsViewDiv.style.display = 'block';
    composeViewDiv.style.display = 'none';

    clearChildren(emailsViewDiv);

    const email = await fetchEmail(id);
    if (email === null) return;

    const emailDiv = createEmailDetailsDiv(email);
    emailsViewDiv.appendChild(emailDiv);
}