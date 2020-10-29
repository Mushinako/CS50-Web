"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const usernameH2 = byId("username");
    const username = usernameH2.dataset.username;
    users = [username];
    renderPost();
    const followButtonDiv = byId("follow-button");
    if (followButtonDiv.classList.contains("followed-button")) {
        followButtonDiv.appendText("Unfollow");
        followButtonDiv.addEventListener("click", () => followButtonListener(username, true));
    }
    else {
        followButtonDiv.appendText("Follow");
        followButtonDiv.addEventListener("click", () => followButtonListener(username, false));
    }
});
async function followButtonListener(username, currentStatus) {
    const followNumSpan = byId("num-followers");
    let followNum = +followNumSpan.innerText;
    if (isNaN(followNum)) {
        console.error(`${followNumSpan.innerText} is not a number`);
        return;
    }
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
    let followButtonDiv = byId("follow-button");
    const followButtonDivParent = followButtonDiv.parentElement;
    followButtonDivParent.clearChildren();
    if (currentStatus) {
        followButtonDiv = newEl("div", ["follow-button", "div-button", "unfollowed-button"]);
        followButtonDiv.appendText("Follow");
        followNum--;
    }
    else {
        followButtonDiv = newEl("div", ["follow-button", "div-button", "followed-button"]);
        followButtonDiv.appendText("Unfollow");
        followNum++;
    }
    followButtonDivParent.appendChild(followButtonDiv);
    followButtonDiv.id = "follow-button";
    followButtonDiv.addEventListener("click", () => followButtonListener(username, !currentStatus));
    followNumSpan.clearChildren();
    followNumSpan.appendText(`${followNum}`);
    const numFolloweesPluralizeDiv = byId("num-followers-pluralize");
    const numFolloweesPluralize = followNum === 1 ? "person" : "people";
    if (numFolloweesPluralize !== numFolloweesPluralizeDiv.innerText) {
        numFolloweesPluralizeDiv.clearChildren();
        numFolloweesPluralizeDiv.appendText(numFolloweesPluralize);
    }
}
