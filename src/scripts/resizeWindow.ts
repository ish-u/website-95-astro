export function resizeWindows(windowDataAttr: string) {
  const resizeButton = document.querySelector(
    `.resize-button[data-window=${windowDataAttr}]`
  );
  console.log(resizeButton);
  const windowDiv: HTMLDivElement | null = document.querySelector(
    `[data-window=${windowDataAttr}]`
  );
  if (resizeButton && windowDiv) {
    if (resizeButton.classList.contains("maximize")) {
      windowDiv.style.top = "5rem";
      windowDiv.style.left = "20rem";
      windowDiv.style.width = "50rem";
      windowDiv.style.height = "35rem";
      resizeButton.classList.remove("maximize");
    } else {
      windowDiv.style.top = "0";
      windowDiv.style.left = "0";
      windowDiv.style.width = "100%";
      windowDiv.style.height = "100%";
      resizeButton?.classList.add("maximize");
    }
  }
}
