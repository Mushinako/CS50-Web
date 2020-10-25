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
    emailReplyActionDiv.appendChild(svgReply);
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
    emailReplyAllActionDiv.appendChild(svgReplyAll);
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
    emailArchiveActionDiv.appendChild(email.archived ? svgUnarchive : svgArchive);
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
    emailUnreadActionDiv.appendChild(email.read ? svgUnread : svgRead);
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
