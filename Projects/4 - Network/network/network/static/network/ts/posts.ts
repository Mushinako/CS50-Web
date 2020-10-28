const postNumberLimit = 10;
const indexPostTimestamps: string[] = [];
let postContainerDiv: HTMLDivElement;
let users: string[] = [];

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
const likedSvg = createSvg([
    "M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z",
]);
const unlikedSvg = createSvg([
    "M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z",
]);

document.addEventListener("DOMContentLoaded", (): void => {
    postContainerDiv = <HTMLDivElement>byId("post-container");
});

async function renderPost(startTime?: string): Promise<void> {
    const searchParamsDict: Record<string, string> = {};
    if (startTime !== undefined) {
        searchParamsDict.startTime = startTime;
    }
    if (users.length) {
        searchParamsDict.users = users.join(",");
    }
    const searchParams = new URLSearchParams(searchParamsDict);
    const responseUnchecked: PotentialErrorResponse<GetPostResponse> = await fetch(`posts?${searchParams}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(res => res.json())
        .catch(err => console.error(err));
    const response = checkError(responseUnchecked);
    if (response === null) return;

    const { posts, more, loggedIn } = response;
    if (!posts.length) {
        const postEmptyDiv = newEl("div", ["post-empty", "empty-list"]);
        postContainerDiv.appendChild(postEmptyDiv);
        postEmptyDiv.appendText("No posts yet");
    }
    indexPostTimestamps.push(posts[posts.length - 1].creationTime);

    postContainerDiv.clearChildren();

    const postsDiv = newEl("div", ["posts"]);
    postContainerDiv.append(postsDiv);
    for (const post of posts) {
        const postDiv = newPostDiv(post, loggedIn);
        postsDiv.appendChild(postDiv);
    }

    const buttonsDiv = newPostNavDiv(startTime !== undefined && indexPostTimestamps.length > 1, more);
    postContainerDiv.appendChild(buttonsDiv);
}

function newPostDiv(post: PostData, loggedIn: boolean): HTMLDivElement {
    const postDiv = newEl("div", ["post"]);

    // User
    const usernameDiv = newEl("div", ["post-username"]);
    postDiv.appendChild(usernameDiv);
    usernameDiv.appendText(post.username);

    // Content
    const contentDiv = newEl("div", ["post-content"]);
    postDiv.appendChild(contentDiv);
    contentDiv.appendText(post.content);

    // Time
    const timeDiv = newEl("div", ["post-time"]);
    postDiv.appendChild(timeDiv);

    const creationTimeDiv = newEl("div", ["post-time-creation"]);
    timeDiv.appendChild(creationTimeDiv);
    creationTimeDiv.appendText(`Created at ${post.creationTime}`);

    if (post.editTime !== null) {
        const editTimeDiv = newEl("div", ["post-time-edit"]);
        timeDiv.appendChild(editTimeDiv);
        editTimeDiv.appendText(`Last edited at ${post.editTime}`);
    }

    // Likes
    const likesDiv = newEl("div", ["post-likes"]);
    postDiv.appendChild(likesDiv);

    const likeButtonDiv = newEl("div", ["post-like-button"]);
    likesDiv.appendChild(likeButtonDiv);
    likeButtonDiv.dataset.id = `${post.id}`;
    likeButtonDiv.dataset.liked = post.liked ? "1" : "0";

    if (post.liked) {
        likeButtonDiv.appendChild(likedSvg.cloneNode(true));
        likeButtonDiv.classList.add("post-liked-button");
    } else {
        likeButtonDiv.appendChild(unlikedSvg.cloneNode(true));
        likeButtonDiv.classList.add("post-unliked-button");
    }

    if (loggedIn) {
        likeButtonDiv.classList.add("div-button");
        likeButtonDiv.addEventListener("click", likedButtonClickListener);
    }

    const likeCountDiv = newEl("div", ["post-like-count"]);
    likesDiv.appendChild(likeCountDiv);

    const likeCountNumSpan = newEl("span", ["post-like-count-num"]);
    likeCountDiv.appendChild(likeCountNumSpan);
    likeCountNumSpan.appendText(`${post.likeCount}`);
    likeCountNumSpan.id = `post-like-count-num-${post.id}`;

    likeCountDiv.appendText(" ");

    const likeCountPluralSpan = newEl("span");
    likeCountDiv.appendChild(likeCountPluralSpan);
    likeCountPluralSpan.appendText(post.likeCount === 1 ? "person" : "people");
    likeCountPluralSpan.id = `post-like-count-plural-${post.id}`;

    likeCountDiv.appendText(" liked this post");

    return postDiv;
}

async function likedButtonClickListener(this: HTMLDivElement): Promise<void> {
    const postId = +this.dataset.id!;
    if (isNaN(postId)) {
        console.error(`${this.dataset.id} is not a number`);
        return;
    }
    let liked: boolean;
    switch (this.dataset.liked) {
        case "1":
            liked = true;
            break;
        case "0":
            liked = false;
            break;
        default:
            console.error(`${this.dataset.liked} is not a valid like status`);
            return;
    }

    const likeCountNumSpan = <HTMLSpanElement>byId(`post-like-count-num-${postId}`)!;
    let countNum = +likeCountNumSpan.innerText;
    if (isNaN(countNum)) {
        console.error(`${likeCountNumSpan.innerText} is not a number`);
        return;
    }

    const csrfToken = getCsrfToken();
    if (csrfToken === null) return;

    const responseUnchecked: PotentialErrorResponse<SuccessResponse> = await fetch("like", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
            postId: postId,
            status: !liked,
        }),
    })
        .then(res => res.json())
        .catch(err => console.log(err));
    const response = checkError(responseUnchecked);
    if (response === null) return;

    this.clearChildren();
    this.classList.remove("post-liked-button", "post-unliked-button");
    if (!liked) {
        this.dataset.liked = "1";
        this.classList.add("post-liked-button");
        this.appendChild(likedSvg.cloneNode(true));
        countNum++;
    } else {
        this.dataset.liked = "0";
        this.classList.add("post-unliked-button");
        this.appendChild(unlikedSvg.cloneNode(true));
        countNum--;
    }
    this.classList.add("div-button");
    this.addEventListener("click", likedButtonClickListener);

    likeCountNumSpan.clearChildren();
    likeCountNumSpan.appendText(`${countNum}`);
    const likeCountPluralSpan = <HTMLSpanElement>byId(`post-like-count-plural-${postId}`);
    likeCountPluralSpan.clearChildren();
    likeCountPluralSpan.appendText(countNum === 1 ? "person" : "people");
}

function newPostNavDiv(prev: boolean, next: boolean): HTMLDivElement {
    const buttonsDiv = newEl("div", ["post-nav"]);

    const prevDiv = newEl("div", ["post-nav-prev"]);
    buttonsDiv.appendChild(prevDiv);
    if (prev) {
        prevDiv.appendChild(leftSvg);
        prevDiv.classList.add("post-nav-enabled", "div-button");
        prevDiv.addEventListener("click", (): void => {
            if (indexPostTimestamps.length < 2) return;
            indexPostTimestamps.pop();
            indexPostTimestamps.pop();
            if (indexPostTimestamps.length) {
                const timestamp = indexPostTimestamps[indexPostTimestamps.length - 2];
                renderPost(timestamp);
            } else {
                renderPost();
            }
        });
    } else {
        prevDiv.appendChild(leftDisabledSvg);
        prevDiv.classList.add("post-nav-disabled");
    }

    const nextDiv = newEl("div", ["post-nav-next"]);
    buttonsDiv.appendChild(nextDiv);
    if (next) {
        nextDiv.appendChild(rightSvg);
        nextDiv.classList.add("post-nav-enabled", "div-button");
        nextDiv.addEventListener("click", (): void => {
            if (indexPostTimestamps.length < 1) return;
            const timestamp = indexPostTimestamps[indexPostTimestamps.length - 1];
            renderPost(timestamp);
        });
    } else {
        nextDiv.appendChild(rightDisabledSvg);
        nextDiv.classList.add("post-nav-disabled");
    }

    return buttonsDiv;
}