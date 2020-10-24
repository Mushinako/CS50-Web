interface errorResponse {
    error: string,
}

interface sendMailResponse {
    message: string,
}

function showError(errorMsg: string): void {
    console.error(errorMsg);
    clearChildren(errorViewDiv);
    const errorText = document.createTextNode(errorMsg);
    errorViewDiv.appendChild(errorText);
    errorViewDiv.style.display = "block";
}

function clearChildren(el: Element): void {
    while (el.lastChild) el.removeChild(el.lastChild);
}