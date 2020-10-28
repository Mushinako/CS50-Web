document.addEventListener("DOMContentLoaded", (): void => {
    const usernameH2 = <HTMLHeadingElement>byId("following")!;
    const username = usernameH2.dataset.followings!;
    if (username.length) {
        users = username.split(",");
        renderPost();
    } else {
        users = [];
    }
});