"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const usernameH2 = byId("username");
    const username = usernameH2.dataset.username;
    users = [username];
    renderPost();
    const followedButton = byId("followed-button");
    const unfollowedButton = byId("unfollowed-button");
    if (followedButton === null || unfollowedButton === null)
        return;
    followedButton.addEventListener("click", () => followButtonListener(username, true, followedButton, unfollowedButton));
    unfollowedButton.addEventListener("click", () => followButtonListener(username, false, unfollowedButton, followedButton));
});
async function followButtonListener(username, currentStatus, hideDiv, showDiv) {
    const csrfToken = getCsrfToken();
    if (csrfToken === null)
        return;
    const responseUnchecked = await fetch("/users/follow", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
            username: username,
            status: !currentStatus,
        }),
    })
        .then(res => res.json())
        .catch(err => console.log(err));
    const response = checkError(responseUnchecked);
    if (response === null)
        return;
    hideDiv.classList.remove("button-visible");
    hideDiv.classList.add("button-hidden");
    showDiv.classList.remove("button-hidden");
    showDiv.classList.add("button-visible");
}
