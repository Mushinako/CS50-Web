document.addEventListener("DOMContentLoaded", (): void => {
    const usernameH2 = <HTMLHeadingElement>byId("username")!;
    const username = usernameH2.dataset.username!;
    users = [username];
    renderPost();

    const followedButton = <HTMLDivElement | null>byId("followed-button");
    const unfollowedButton = <HTMLDivElement | null>byId("unfollowed-button");
    if (followedButton === null || unfollowedButton === null) return;
    followedButton.addEventListener("click", (): Promise<void> => followButtonListener(username, true, followedButton, unfollowedButton));
    unfollowedButton.addEventListener("click", (): Promise<void> => followButtonListener(username, false, unfollowedButton, followedButton));
});

async function followButtonListener(username: string, currentStatus: boolean, hideDiv: HTMLDivElement, showDiv: HTMLDivElement): Promise<void> {
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

    hideDiv.classList.remove("button-visible");
    hideDiv.classList.add("button-hidden");
    showDiv.classList.remove("button-hidden");
    showDiv.classList.add("button-visible");
}