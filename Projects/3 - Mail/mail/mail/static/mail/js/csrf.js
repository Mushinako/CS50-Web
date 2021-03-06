"use strict";
const tokenName = "csrftoken";
function getCsrfToken() {
    let token;
    const cookie = document.cookie;
    if (cookie) {
        const cookies = cookie.split(";");
        for (const c of cookies) {
            const cTrim = c.trim();
            if (cTrim.startsWith(tokenName)) {
                token = decodeURIComponent(cTrim.substring(tokenName.length + 1));
            }
        }
    }
    if (token === undefined)
        token = null;
    return token;
}
