document.addEventListener("DOMContentLoaded", (): void => {
    const usernameH2 = <HTMLHeadingElement>byId("username");
    const username = usernameH2.dataset.username!;
    users = [username];
    renderPost();
});