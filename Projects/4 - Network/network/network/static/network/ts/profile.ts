document.addEventListener("DOMContentLoaded", (): void => {
    const usernameH2 = <HTMLHeadingElement>byId("username")!;
    const username = usernameH2.dataset.username!;
    users = [username];
    renderPost();

    const followButtonDiv = <HTMLDivElement>byId("follow-button")!;
    if (followButtonDiv.classList.contains("followed-button")) {
        followButtonDiv.appendText("Unfollow");
        followButtonDiv.addEventListener("click", (): Promise<void> => followButtonListener(username, true));
    } else {
        followButtonDiv.appendText("Follow");
        followButtonDiv.addEventListener("click", (): Promise<void> => followButtonListener(username, false));
    }
});

async function followButtonListener(username: string, currentStatus: boolean): Promise<void> {
    const followNumSpan = <HTMLSpanElement>byId("num-followees")!;
    let followNum = +followNumSpan.innerText;
    if (isNaN(followNum)) {
        console.error(`${followNumSpan.innerText} is not a number`);
        return;
    }

    const csrfToken = getCsrfToken();
    if (csrfToken === null) return;

    const responseUnchecked: PotentialErrorResponse<SuccessResponse> = await fetch("/users/follow", {
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
    if (response === null) return;

    let followButtonDiv = <HTMLDivElement>byId("follow-button")!;
    const followButtonDivParent = followButtonDiv.parentElement!;
    followButtonDivParent.clearChildren();
    if (currentStatus) {
        followButtonDiv = newEl("div", ["follow-button", "div-button", "unfollowed-button"]);
        followButtonDiv.appendText("Follow");
        followNum--;
    } else {
        followButtonDiv = newEl("div", ["follow-button", "div-button", "followed-button"]);
        followButtonDiv.appendText("Unfollow");
        followNum++;
    }
    followButtonDivParent.appendChild(followButtonDiv);
    followButtonDiv.id = "follow-button";
    followButtonDiv.addEventListener("click", (): Promise<void> => followButtonListener(username, !currentStatus));

    followNumSpan.clearChildren();
    followNumSpan.appendText(`${followNum}`);

    const numFolloweesPluralizeDiv = <HTMLDivElement>byId("num-followees-pluralize")!;
    const numFolloweesPluralize = followNum === 1 ? "person" : "people";
    if (numFolloweesPluralize !== numFolloweesPluralizeDiv.innerText) {
        numFolloweesPluralizeDiv.clearChildren();
        numFolloweesPluralizeDiv.appendText(numFolloweesPluralize);
    }
}