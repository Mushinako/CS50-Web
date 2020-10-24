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
    const titleEl = document.createElement("h3");
    emailsViewDiv.appendChild(titleEl);
    const titleText = document.createTextNode(mailbox.charAt(0).toUpperCase() + mailbox.slice(1));
    titleEl.appendChild(titleText);
    const emailsUnchecked = await fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .catch(err => console.error(err));
    const emails = checkError(emailsUnchecked);
    if (emails === null)
        return;
    for (const email of emails) {
        const emailDiv = document.createElement("div");
        emailDiv.classList.add("email-preview");
        emailDiv.addEventListener("click", () => load_email(email.id));
        emailsViewDiv.appendChild(emailDiv);
        const otherDiv = document.createElement("div");
        otherDiv.classList.add("email-other");
        emailDiv.appendChild(otherDiv);
        const otherText = document.createTextNode(mailbox === "sent" ? email.recipients.join(", ") : email.sender);
        otherDiv.appendChild(otherText);
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
async function load_email(id) {
    emailsViewDiv.style.display = 'block';
    composeViewDiv.style.display = 'none';
    clearChildren(emailsViewDiv);
    const emailUnchecked = await fetch(`/emails/${id}`)
        .then(response => response.json())
        .catch(err => console.error(err));
    const email = checkError(emailUnchecked);
    if (email === null)
        return;
    const emailDiv = document.createElement("div");
    emailDiv.classList.add("email-content");
    emailsViewDiv.appendChild(emailDiv);
    const senderDiv = document.createElement("div");
    senderDiv.classList.add("email-sender");
    emailDiv.appendChild(senderDiv);
    const senderText = document.createTextNode(email.sender);
    senderDiv.appendChild(senderText);
    const recipientsDiv = document.createElement("div");
    recipientsDiv.classList.add("email-recipients");
    emailDiv.appendChild(recipientsDiv);
    const recipientsText = document.createTextNode(email.recipients.join(", "));
    recipientsDiv.appendChild(recipientsText);
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
