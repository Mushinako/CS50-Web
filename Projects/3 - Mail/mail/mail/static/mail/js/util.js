"use strict";
function showError(errorMsg) {
    console.error(errorMsg);
    alert(errorMsg);
}
function clearChildren(el) {
    while (el.lastChild)
        el.removeChild(el.lastChild);
}
function checkError(response) {
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
