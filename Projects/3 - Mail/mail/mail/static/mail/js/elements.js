"use strict";
function createEmailHeaderRow(rowClass, headerText, cellText) {
    const row = createTableRow({
        rowClasses: [rowClass],
        headers: [
            {
                text: headerText,
                classes: ["prefix"],
            },
        ],
        cells: [
            {
                text: cellText,
                classes: ["content"],
            },
        ],
    });
    return row;
}
function createEmailPreviewDiv(email, mailbox) {
    const emailDiv = createElement("div", {
        classes: [
            "email-preview",
            email.read ? "email-read" : "email-unread",
        ],
    });
    emailDiv.addEventListener("click", () => loadEmail(email.id, true));
    const otherDiv = createElement("div", {
        text: mailbox === "sent" ? email.recipients.join(", ") : email.sender,
        classes: ["email-other"],
    });
    emailDiv.appendChild(otherDiv);
    const subjectDiv = createElement("div", {
        text: email.subject,
        classes: ["email-title"],
    });
    emailDiv.appendChild(subjectDiv);
    const bodyDiv = createElement("div", {
        text: email.body,
        classes: ["email-body"],
    });
    emailDiv.appendChild(bodyDiv);
    const timeDiv = createElement("div", {
        text: email.timestamp,
        classes: ["email-time"],
    });
    emailDiv.appendChild(timeDiv);
    return emailDiv;
}
function createEmailDetailsHeaderTableDiv(email) {
    const emailHeaderTable = createElement("table", {
        classes: ["email-header-table"],
    });
    const senderRow = createEmailHeaderRow("email-sender", "From:", email.sender);
    emailHeaderTable.appendChild(senderRow);
    const recipientsRow = createEmailHeaderRow("email-recipients", "To:", email.recipients.join(", "));
    emailHeaderTable.appendChild(recipientsRow);
    const subjectRow = createEmailHeaderRow("email-title", "Subject:", email.subject);
    emailHeaderTable.appendChild(subjectRow);
    const timeRow = createEmailHeaderRow("email-time", "Time:", email.timestamp);
    emailHeaderTable.appendChild(timeRow);
    return emailHeaderTable;
}
function createEmailDetailsHeaderDiv(email) {
    const emailHeaderDiv = createElement("div", {
        classes: ["email-header"],
    });
    const emailHeaderTable = createEmailDetailsHeaderTableDiv(email);
    emailHeaderDiv.appendChild(emailHeaderTable);
    const emailActionsDiv = createEmailDetailsActionsDiv(email);
    emailHeaderDiv.appendChild(emailActionsDiv);
    return emailHeaderDiv;
}
function createEmailDetailsActionsDiv(email) {
    const emailActionsDiv = createElement("div", {
        classes: ["email-actions"],
    });
    const emailReplyActionDiv = createElement("div", {
        classes: ["email-reply-action"],
    });
    emailReplyActionDiv.innerHTML = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9.502 5.013a.144.144 0 0 0-.202.134V6.3a.5.5 0 0 1-.5.5c-.667 0-2.013.005-3.3.822-.984.624-1.99 1.76-2.595 3.876C3.925 10.515 5.09 9.982 6.11 9.7a8.741 8.741 0 0 1 1.921-.306 7.403 7.403 0 0 1 .798.008h.013l.005.001h.001L8.8 9.9l.05-.498a.5.5 0 0 1 .45.498v1.153c0 .108.11.176.202.134l3.984-2.933a.494.494 0 0 1 .042-.028.147.147 0 0 0 0-.252.494.494 0 0 1-.042-.028L9.502 5.013zM8.3 10.386a7.745 7.745 0 0 0-1.923.277c-1.326.368-2.896 1.201-3.94 3.08a.5.5 0 0 1-.933-.305c.464-3.71 1.886-5.662 3.46-6.66 1.245-.79 2.527-.942 3.336-.971v-.66a1.144 1.144 0 0 1 1.767-.96l3.994 2.94a1.147 1.147 0 0 1 0 1.946l-3.994 2.94a1.144 1.144 0 0 1-1.767-.96v-.667z"/></svg>';
    emailReplyActionDiv.addEventListener("click", () => {
        composeEmail();
        const replySubject = email.subject.startsWith("Re: ") ? email.subject : `Re: ${email.subject}`;
        const replyBodyQuote = email.body.split("\n").map(val => `  > ${val}`).join("\n");
        composeRecipientsInput.value = email.sender;
        composeSubjectInput.value = replySubject;
        composeBodyTextarea.value = [
            "",
            "",
            "-".repeat(20),
            `  On ${email.timestamp} ${email.sender} wrote:`,
            replyBodyQuote,
        ].join("\n");
    });
    emailActionsDiv.appendChild(emailReplyActionDiv);
    const emailReplyAllActionDiv = createElement("div", {
        classes: ["email-reply-all-action"],
    });
    emailReplyAllActionDiv.innerHTML = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.002 5.013a.144.144 0 0 0-.202.134V6.3a.5.5 0 0 1-.5.5c-.667 0-2.013.005-3.3.822-.984.624-1.99 1.76-2.595 3.876C2.425 10.515 3.59 9.982 4.61 9.7a8.741 8.741 0 0 1 1.921-.306 7.403 7.403 0 0 1 .798.008h.013l.005.001h.001L7.3 9.9l.05-.498a.5.5 0 0 1 .45.498v1.153c0 .108.11.176.202.134l3.984-2.933a.494.494 0 0 1 .042-.028.147.147 0 0 0 0-.252.494.494 0 0 1-.042-.028L8.002 5.013zM6.8 10.386a7.745 7.745 0 0 0-1.923.277c-1.326.368-2.896 1.201-3.94 3.08a.5.5 0 0 1-.933-.305c.464-3.71 1.886-5.662 3.46-6.66 1.245-.79 2.527-.942 3.336-.971v-.66a1.144 1.144 0 0 1 1.767-.96l3.994 2.94a1.147 1.147 0 0 1 0 1.946l-3.994 2.94a1.144 1.144 0 0 1-1.767-.96v-.667z"/><path fill-rule="evenodd" d="M10.868 4.293a.5.5 0 0 1 .7-.106l3.993 2.94a1.147 1.147 0 0 1 0 1.946l-3.994 2.94a.5.5 0 0 1-.593-.805l4.012-2.954a.493.493 0 0 1 .042-.028.147.147 0 0 0 0-.252.496.496 0 0 1-.042-.028l-4.012-2.954a.5.5 0 0 1-.106-.699z" /></svg>';
    emailReplyAllActionDiv.addEventListener("click", () => {
        composeEmail();
        const allRecipients = [...new Set(email.recipients)];
        const otherRecipients = allRecipients.filter(val => val !== userEmail);
        const replyRecipients = [...new Set([email.sender, ...otherRecipients])];
        const replySubject = email.subject.startsWith("Re: ") ? email.subject : `Re: ${email.subject}`;
        const replyBodyQuote = email.body.split("\n").map(val => `  > ${val}`).join("\n");
        composeRecipientsInput.value = replyRecipients.join(", ");
        composeSubjectInput.value = replySubject;
        composeBodyTextarea.value = [
            "",
            "",
            "-".repeat(20),
            `  On ${email.timestamp} ${email.sender} wrote:`,
            replyBodyQuote,
        ].join("\n");
    });
    emailActionsDiv.appendChild(emailReplyAllActionDiv);
    const emailArchiveActionDiv = createElement("div", {
        classes: ["email-archive-action"],
    });
    if (email.archived) {
        emailArchiveActionDiv.innerHTML = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/></svg>';
    }
    else {
        emailArchiveActionDiv.innerHTML = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/></svg>';
    }
    emailArchiveActionDiv.addEventListener("click", async () => {
        const success = await fetchChangeEmailStatus(email.id, {
            archived: !email.archived,
        });
        if (success) {
            loadMailbox("inbox");
        }
    });
    emailActionsDiv.appendChild(emailArchiveActionDiv);
    const emailUnreadActionDiv = createElement("div", {
        classes: ["email-unread-action"],
    });
    if (email.read) {
        emailUnreadActionDiv.innerHTML = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/></svg>';
    }
    else {
        emailUnreadActionDiv.innerHTML = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/></svg>';
    }
    emailUnreadActionDiv.addEventListener("click", async () => {
        const success = await fetchChangeEmailStatus(email.id, {
            read: !email.read,
        });
        if (success) {
            loadMailbox("inbox");
        }
    });
    emailActionsDiv.appendChild(emailUnreadActionDiv);
    return emailActionsDiv;
}
function createEmailDetailsBodyDiv(email) {
    const bodyDiv = createElementMultilineText("div", {
        text: email.body,
        classes: ["email-body"],
    });
    return bodyDiv;
}
function createEmailDetailsDiv(email) {
    const emailDiv = createElement("div", {
        classes: ["email-details"],
    });
    const emailHeaderDiv = createEmailDetailsHeaderDiv(email);
    emailDiv.appendChild(emailHeaderDiv);
    const bodyDiv = createEmailDetailsBodyDiv(email);
    emailDiv.appendChild(bodyDiv);
    return emailDiv;
}
