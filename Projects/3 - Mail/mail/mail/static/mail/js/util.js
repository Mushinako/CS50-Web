"use strict";
function showError(errorMsg) {
    console.error(errorMsg);
    alert(errorMsg);
}
function clearChildren(el) {
    while (el.lastChild)
        el.removeChild(el.lastChild);
}
function checkError(response) {
    if (response === undefined) {
        showError("No response got from server.");
        return null;
    }
    if ("error" in response) {
        showError(response.error);
        return null;
    }
    return response;
}
function createElement(type, { text, classes } = {}) {
    const el = document.createElement(type);
    if (classes !== undefined) {
        el.classList.add(...classes);
    }
    if (text !== undefined) {
        const textNode = document.createTextNode(text);
        el.appendChild(textNode);
    }
    return el;
}
function createTableRow({ rowClasses, headers, cells } = {}) {
    const row = createElement("tr", {
        classes: rowClasses
    });
    if (headers !== undefined) {
        for (const header of headers) {
            const th = createElement("th", header);
            row.appendChild(th);
        }
    }
    if (cells !== undefined) {
        for (const cell of cells) {
            const td = createElement("td", cell);
            row.appendChild(td);
        }
    }
    return row;
}
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
    const emailDivClasses = ["email-preview"];
    if (email.read) {
        emailDivClasses.push("email-read");
    }
    const emailDiv = createElement("div", {
        classes: emailDivClasses,
    });
    emailDiv.addEventListener("click", () => load_email(email.id));
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
function createEmailDetailsHeaderDiv(email) {
    const emailHeaderDiv = createElement("table", {
        classes: ["email-header"],
    });
    const senderRow = createEmailHeaderRow("email-sender", "From:", email.sender);
    emailHeaderDiv.appendChild(senderRow);
    const recipientsRow = createEmailHeaderRow("email-recipients", "To:", email.recipients.join(", "));
    emailHeaderDiv.appendChild(recipientsRow);
    const subjectRow = createEmailHeaderRow("email-title", "Subject:", email.subject);
    emailHeaderDiv.appendChild(subjectRow);
    const timeRow = createEmailHeaderRow("email-time", "Time:", email.timestamp);
    emailHeaderDiv.appendChild(timeRow);
    return emailHeaderDiv;
}
function createEmailDetailsActionsDiv(email) {
    const emailActionsDiv = createElement("div", {
        classes: ["email-actions"],
    });
    return emailActionsDiv;
}
function createEmailDetailsBodyDiv(email) {
    const bodyDiv = createElement("div", {
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
    const emailActionsDiv = createEmailDetailsActionsDiv(email);
    emailDiv.appendChild(emailActionsDiv);
    const bodyDiv = createEmailDetailsBodyDiv(email);
    emailDiv.appendChild(bodyDiv);
    return emailDiv;
}
async function simpleFetch(url, method, headers) {
    const response = await fetch(url, {
        method: method,
        headers: headers,
    })
        .then(response => response.json())
        .catch(err => console.log(err));
    return response;
}
