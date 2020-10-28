"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const usernameH2 = byId("following");
    const username = usernameH2.dataset.followings;
    if (username.length) {
        users = username.split(",");
        renderPost();
    }
    else {
        users = [];
    }
});
