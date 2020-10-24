// Buttons
let inboxButton: HTMLButtonElement;
let sentButton: HTMLButtonElement;
let archiveButton: HTMLButtonElement;
let composeButton: HTMLButtonElement;

// Views
let emailsViewDiv: HTMLDivElement;
let composeViewDiv: HTMLDivElement;

// Compose form
let composeForm: HTMLFormElement;
let composeRecipientsInput: HTMLInputElement;
let composeSubjectInput: HTMLInputElement;
let composeBodyTextarea: HTMLTextAreaElement;

document.addEventListener('DOMContentLoaded', (): void => {
    inboxButton = <HTMLButtonElement>document.getElementById("inbox")!;
    sentButton = <HTMLButtonElement>document.getElementById("sent")!;
    archiveButton = <HTMLButtonElement>document.getElementById("archived")!;
    composeButton = <HTMLButtonElement>document.getElementById("compose")!;

    emailsViewDiv = <HTMLDivElement>document.getElementById("emails-view")!;
    composeViewDiv = <HTMLDivElement>document.getElementById("compose-view")!;

    composeRecipientsInput = <HTMLInputElement>document.getElementById("compose-recipients")!;
    composeSubjectInput = <HTMLInputElement>document.getElementById('compose-subject')!;
    composeBodyTextarea = <HTMLTextAreaElement>document.getElementById('compose-body')!;

    // Use buttons to toggle between views
    inboxButton.addEventListener('click', () => load_mailbox('inbox'));
    sentButton.addEventListener('click', () => load_mailbox('sent'));
    archiveButton.addEventListener('click', () => load_mailbox('archive'));
    composeButton.addEventListener('click', compose_email);

    // By default, load the inbox
    load_mailbox('inbox');
});
