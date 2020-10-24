interface errorResponse {
    error: string,
}

type potentialErrorResponse<T> = T | errorResponse | undefined;

function showError(errorMsg: string): void {
    console.error(errorMsg);
    alert(errorMsg);
}

function clearChildren(el: Element): void {
    while (el.lastChild) el.removeChild(el.lastChild);
}

function checkError<T extends object>(response: potentialErrorResponse<T>): T | null {
    if (response === undefined) {
        showError("No response got from server.");
        return null;
    }
    if ("error" in response) {
        showError(response.error);
        return null;
    }
    return response;
}