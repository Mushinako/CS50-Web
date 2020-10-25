"use strict";
function composeEmail() {
    emailsViewDiv.style.display = 'none';
    composeViewDiv.style.display = 'block';
    composeRecipientsInput.value = '';
    composeSubjectInput.value = '';
    composeBodyTextarea.value = '';
}
async function loadMailbox(mailbox) {
    emailsViewDiv.style.display = 'block';
    composeViewDiv.style.display = 'none';
    clearChildren(emailsViewDiv);
    const titleH3 = createElement("h3", {
        text: mailbox.charAt(0).toUpperCase() + mailbox.slice(1),
    });
    emailsViewDiv.appendChild(titleH3);
    const emails = await fetchMailbox(mailbox);
    if (emails === null)
        return;
    for (const email of emails) {
        const emailDiv = createEmailPreviewDiv(email, mailbox);
        emailsViewDiv.appendChild(emailDiv);
    }
}
async function loadEmail(id, loadFromPreview = false) {
    if (loadFromPreview) {
        await fetchChangeEmailStatus(id, {
            read: true,
        });
    }
    emailsViewDiv.style.display = 'block';
    composeViewDiv.style.display = 'none';
    clearChildren(emailsViewDiv);
    const email = await fetchEmail(id);
    if (email === null)
        return;
    const emailDiv = createEmailDetailsDiv(email);
    emailsViewDiv.appendChild(emailDiv);
}
