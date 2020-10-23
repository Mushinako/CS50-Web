document.addEventListener('DOMContentLoaded', function () {

    // Use buttons to toggle between views
    document.getElementById('inbox')!.addEventListener('click', () => load_mailbox('inbox'));
    document.getElementById('sent')!.addEventListener('click', () => load_mailbox('sent'));
    document.getElementById('archived')!.addEventListener('click', () => load_mailbox('archive'));
    document.getElementById('compose')!.addEventListener('click', compose_email);

    // By default, load the inbox
    load_mailbox('inbox');
});

function compose_email(): void {

    // Show compose view and hide other views
    document.getElementById('emails-view')!.style.display = 'none';
    document.getElementById('compose-view')!.style.display = 'block';

    // Clear out composition fields
    (<HTMLInputElement>document.getElementById('compose-recipients')!).value = '';
    (<HTMLInputElement>document.getElementById('compose-subject')!).value = '';
    (<HTMLInputElement>document.getElementById('compose-body')!).value = '';
}

function load_mailbox(mailbox: "inbox" | "sent" | "archive"): void {

    // Show the mailbox and hide other views
    document.getElementById('emails-view')!.style.display = 'block';
    document.getElementById('compose-view')!.style.display = 'none';

    // Show the mailbox name
    const titleText = document.createTextNode(mailbox.charAt(0).toUpperCase() + mailbox.slice(1));
    const titleEl = document.createElement("h3");
    titleEl.appendChild(titleText);
    const emailsViewEl = document.getElementById('emails-view')!;
    while (emailsViewEl.lastChild) emailsViewEl.removeChild(emailsViewEl.lastChild);
    emailsViewEl.appendChild(titleEl);
}