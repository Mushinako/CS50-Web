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

function load_mailbox(mailbox: "inbox" | "sent" | "archive"): void {
    // Show the mailbox and hide other views
    errorViewDiv.style.display = "none";
    emailsViewDiv.style.display = 'block';
    composeViewDiv.style.display = 'none';

    // Show the mailbox name
    const titleText = document.createTextNode(mailbox.charAt(0).toUpperCase() + mailbox.slice(1));
    const titleEl = document.createElement("h3");
    titleEl.appendChild(titleText);
    while (emailsViewDiv.lastChild) emailsViewDiv.removeChild(emailsViewDiv.lastChild);
    emailsViewDiv.appendChild(titleEl);
}
