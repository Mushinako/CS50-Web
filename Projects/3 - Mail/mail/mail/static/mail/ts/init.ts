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

let userEmail: string;

document.addEventListener('DOMContentLoaded', (): void => {
    inboxButton = <HTMLButtonElement>document.getElementById("inbox")!;
    sentButton = <HTMLButtonElement>document.getElementById("sent")!;
    archiveButton = <HTMLButtonElement>document.getElementById("archived")!;
    composeButton = <HTMLButtonElement>document.getElementById("compose")!;

    emailsViewDiv = <HTMLDivElement>document.getElementById("emails-view")!;
    composeViewDiv = <HTMLDivElement>document.getElementById("compose-view")!;

    composeForm = <HTMLFormElement>document.getElementById("compose-form")!;
    composeRecipientsInput = <HTMLInputElement>document.getElementById("compose-recipients")!;
    composeSubjectInput = <HTMLInputElement>document.getElementById('compose-subject')!;
    composeBodyTextarea = <HTMLTextAreaElement>document.getElementById('compose-body')!;

    userEmail = (<HTMLInputElement>document.getElementById("compose-sender")!).value;

    // Use buttons to toggle between views
    inboxButton.addEventListener('click', () => loadMailbox('inbox'));
    sentButton.addEventListener('click', () => loadMailbox('sent'));
    archiveButton.addEventListener('click', () => loadMailbox('archive'));
    composeButton.addEventListener('click', composeEmail);

    composeForm.addEventListener("submit", sendMail);

    // By default, load the inbox
    loadMailbox('inbox');
});
