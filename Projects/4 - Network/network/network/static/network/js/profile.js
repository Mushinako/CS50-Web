"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const usernameH2 = byId("username");
    const username = usernameH2.dataset.username;
    users = [username];
    renderPost();
});
