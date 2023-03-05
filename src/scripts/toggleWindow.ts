export function toggleWindow(windowName: string) {
  const windowDiv: HTMLDivElement | null = document.querySelector(`[data-window=${windowName}]`);
  if (windowDiv) {
    if (windowDiv.style.display === "none") {
      windowDiv.style.display = "block";
    } else {
      windowDiv.style.display = "none";
    }
  }
}
