"use strict";
function compose_email() {
    emailsViewDiv.style.display = 'none';
    composeViewDiv.style.display = 'block';
    composeRecipientsInput.value = '';
    composeSubjectInput.value = '';
    composeBodyTextarea.value = '';
}
function load_mailbox(mailbox) {
    emailsViewDiv.style.display = 'block';
    composeViewDiv.style.display = 'none';
    const titleText = document.createTextNode(mailbox.charAt(0).toUpperCase() + mailbox.slice(1));
    const titleEl = document.createElement("h3");
    titleEl.appendChild(titleText);
    while (emailsViewDiv.lastChild)
        emailsViewDiv.removeChild(emailsViewDiv.lastChild);
    emailsViewDiv.appendChild(titleEl);
}
