"use strict";
function compose_email() {
    emailsViewDiv.style.display = 'none';
    composeViewDiv.style.display = 'block';
    composeRecipientsInput.value = '';
    composeSubjectInput.value = '';
    composeBodyTextarea.value = '';
}
async function load_mailbox(mailbox) {
    emailsViewDiv.style.display = 'block';
    composeViewDiv.style.display = 'none';
    clearChildren(emailsViewDiv);
    const titleH3 = createElement("h3", {
        text: mailbox.charAt(0).toUpperCase() + mailbox.slice(1),
    });
    emailsViewDiv.appendChild(titleH3);
    const emailsUnchecked = await fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .catch(err => console.error(err));
    const emails = checkError(emailsUnchecked);
    if (emails === null)
        return;
    for (const email of emails) {
        const emailDiv = createEmailPreviewDiv(email, mailbox);
        emailsViewDiv.appendChild(emailDiv);
    }
}
async function load_email(id) {
    fetch;
    emailsViewDiv.style.display = 'block';
    composeViewDiv.style.display = 'none';
    clearChildren(emailsViewDiv);
    const emailUnchecked = await fetch(`/emails/${id}`)
        .then(response => response.json())
        .catch(err => console.error(err));
    const email = checkError(emailUnchecked);
    if (email === null)
        return;
    const emailDiv = createEmailDetailsDiv(email);
    emailsViewDiv.appendChild(emailDiv);
}
