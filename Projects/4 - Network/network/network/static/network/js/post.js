"use strict";
const postNumberLimit = 10;
const indexPostTimestamps = [];
let postContainerDiv;
const leftSvg = createSvg([
    "M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm10.5 10a.5.5 0 0 1-.832.374l-4.5-4a.5.5 0 0 1 0-.748l4.5-4A.5.5 0 0 1 10.5 4v8z",
]);
const leftDisabledSvg = createSvg([
    "M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z",
    "M10.205 12.456A.5.5 0 0 0 10.5 12V4a.5.5 0 0 0-.832-.374l-4.5 4a.5.5 0 0 0 0 .748l4.5 4a.5.5 0 0 0 .537.082z",
]);
const rightSvg = createSvg([
    "M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 10a.5.5 0 0 0 .832.374l4.5-4a.5.5 0 0 0 0-.748l-4.5-4A.5.5 0 0 0 5.5 4v8z",
]);
const rightDisabledSvg = createSvg([
    "M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z",
    "M5.795 12.456A.5.5 0 0 1 5.5 12V4a.5.5 0 0 1 .832-.374l4.5 4a.5.5 0 0 1 0 .748l-4.5 4a.5.5 0 0 1-.537.082z",
]);
document.addEventListener("DOMContentLoaded", () => {
    postContainerDiv = byId("post-container");
});
async function renderPost(startTime) {
    const responseUnchecked = await fetch("posts")
        .then(res => res.json())
        .catch(err => console.error(err));
    const response = checkError(responseUnchecked);
    if (response === null)
        return;
    const { posts, more } = response;
    indexPostTimestamps.push(posts[posts.length - 1].creationTime);
    const postsDiv = newEl("div");
    postsDiv.classList.add("posts");
    postContainerDiv.append(postsDiv);
    for (const post of posts) {
        const postDiv = newPostDiv(post);
        postsDiv.appendChild(postDiv);
    }
    const buttonsDiv = newPostNavDiv(startTime !== undefined && indexPostTimestamps.length > 1, more);
    postContainerDiv.appendChild(buttonsDiv);
}
function newPostDiv(post) {
    const postDiv = newEl("div");
    postDiv.classList.add("post");
    return postDiv;
}
function newPostNavDiv(prev, next) {
    const buttonsDiv = newEl("div");
    buttonsDiv.classList.add("post-nav");
    const prevDiv = newEl("div");
    prevDiv.classList.add("post-nav-prev");
    buttonsDiv.appendChild(prevDiv);
    if (prev) {
        prevDiv.appendChild(leftSvg);
        prevDiv.classList.add("post-nav-enabled");
        prevDiv.addEventListener("click", () => {
            if (indexPostTimestamps.length < 2)
                return;
            if (indexPostTimestamps.length === 2) {
                renderPost();
            }
            else {
                indexPostTimestamps.pop();
                const timestamp = indexPostTimestamps[indexPostTimestamps.length - 2];
                renderPost(timestamp);
            }
        });
    }
    else {
        prevDiv.appendChild(leftDisabledSvg);
        prevDiv.classList.add("post-nav-disabled");
    }
    const nextDiv = newEl("div");
    nextDiv.classList.add("post-nav-next");
    buttonsDiv.appendChild(nextDiv);
    if (next) {
        nextDiv.appendChild(rightSvg);
        nextDiv.classList.add("post-nav-enabled");
        nextDiv.addEventListener("click", () => {
            if (indexPostTimestamps.length < 1)
                return;
            const timestamp = indexPostTimestamps[indexPostTimestamps.length - 1];
            renderPost(timestamp);
        });
    }
    else {
        nextDiv.appendChild(rightDisabledSvg);
        nextDiv.classList.add("post-nav-disabled");
    }
    return buttonsDiv;
}
