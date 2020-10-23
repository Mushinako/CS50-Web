"use strict";
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.getElementById('sent').addEventListener('click', () => load_mailbox('sent'));
    document.getElementById('archived').addEventListener('click', () => load_mailbox('archive'));
    document.getElementById('compose').addEventListener('click', compose_email);
    load_mailbox('inbox');
});
function compose_email() {
    document.getElementById('emails-view').style.display = 'none';
    document.getElementById('compose-view').style.display = 'block';
    document.getElementById('compose-recipients').value = '';
    document.getElementById('compose-subject').value = '';
    document.getElementById('compose-body').value = '';
}
function load_mailbox(mailbox) {
    document.getElementById('emails-view').style.display = 'block';
    document.getElementById('compose-view').style.display = 'none';
    const titleText = document.createTextNode(mailbox.charAt(0).toUpperCase() + mailbox.slice(1));
    const titleEl = document.createElement("h3");
    titleEl.appendChild(titleText);
    const emailsViewEl = document.getElementById('emails-view');
    while (emailsViewEl.lastChild)
        emailsViewEl.removeChild(emailsViewEl.lastChild);
    emailsViewEl.appendChild(titleEl);
}
