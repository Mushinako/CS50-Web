const postNumberLimit = 10;
let postContainerDiv: HTMLDivElement;

document.addEventListener("DOMContentLoaded", (): void => {
    postContainerDiv = <HTMLDivElement>byId("post-container");
});

async function renderPost(startTime?: string): Promise<void> {
    await fetch("");
}