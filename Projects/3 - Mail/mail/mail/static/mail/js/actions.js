"use strict";
async function sendMail(ev) {
    ev.preventDefault();
    const recipientsRaw = composeRecipientsInput.value.split(",").map(val => val.trim());
    const recipientsFiltered = [...new Set(recipientsRaw)];
    const data = {
        recipients: recipientsFiltered.join(", "),
        subject: composeSubjectInput.value || "<No Subject>",
        body: composeBodyTextarea.value,
    };
    const response = await fetchSendEmail(data);
    if (response === null)
        return;
    loadMailbox("sent");
}
