export function popupElement(){
    // Popup showing the position the user clicked
    const popupElement = document.createElement("div");
    popupElement.style.backgroundColor = "white";
    popupElement.style.padding = "10px";
    popupElement.style.borderRadius = "5px";
    popupElement.style.border = "1px solid black";
    popupElement.style.display = "none";
    document.body.appendChild(popupElement);
    return popupElement;
}