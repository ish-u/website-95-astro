export function initCanvas() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  let strokeColor = "rgb(0,0,0)";
  let secondStrokeColor = "rgb(255,255,255)";
  let strokeWidth = 1;
  let tempStrokeColor = "rgb(0,0,0)";
  // adding event listener to Canvas
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx && canvas.parentElement) {
      ctx.strokeStyle = "red";
      let mouseX = 0;
      let mouseY = 0;
      let isDrawing = false;
      canvas.addEventListener("mousedown", (e) => {
        const bounding = canvas.getBoundingClientRect();
        mouseX = e.clientX - bounding.left;
        mouseY = e.clientY - bounding.top;
        isDrawing = true;
      });
      canvas.addEventListener("mousemove", async (e) => {
        if (isDrawing) {
          const bounding = canvas.getBoundingClientRect();
          ctx.beginPath();
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth;
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(e.clientX - bounding.left, e.clientY - bounding.top);
          ctx.stroke();
          mouseX = e.clientX - bounding.left;
          mouseY = e.clientY - bounding.top;
        }
      });
      canvas.addEventListener("mouseup", (_) => {
        isDrawing = false;
      });
    }
  }

  // adding event listener to Color Elements
  const colorList = document.querySelectorAll(".colors");
  if (colorList) {
    colorList.forEach((color) => {
      color.addEventListener("click", () => {
        strokeColor = color.getAttribute("data-color") ?? "#fff";
        const colorOne = document.getElementById("color-one");
        if (colorOne) {
          colorOne.style.background = strokeColor;
        }
      });
    });
  }

  // adding event lsitener to Stroke Menu
  const strokeOptions = document.querySelectorAll(".stroke-option");
  if (strokeOptions) {
    strokeOptions.forEach((stroke, idx) => {
      stroke.addEventListener("click", () => {
        strokeWidth = idx + 1;
        // Setting the Current Stroke as Selected
        selectStrokeOption(stroke);
      });
    });
  }

  // adding event listener to Color Switcher
  const colorOne = document.getElementById("color-one");
  const colorTwo = document.getElementById("color-two");
  const colroSwitcher = document.getElementById("color-switcher");
  if (colorOne && colorTwo && colroSwitcher) {
    colroSwitcher.addEventListener("click", () => {
      const temp = strokeColor;
      strokeColor = secondStrokeColor;
      secondStrokeColor = temp;

      colorOne.style.background = strokeColor;
      colorTwo.style.background = secondStrokeColor;
    });
  }

  // adding event listner to eraser
  const eraser = document.getElementById("eraser");
  if (eraser) {
    eraser.addEventListener("click", () => {
      if (eraser.classList.contains("eraser-selected")) {
        eraser.classList.replace("eraser-selected", "eraser");
        strokeColor = tempStrokeColor;
      } else {
        eraser.classList.add("eraser-selected");
        tempStrokeColor = strokeColor;
        strokeColor = "#fff";
      }
    });
  }
}

function selectStrokeOption(currentStroke: Element) {
  const strokes = document.querySelectorAll("[data-stroke]");
  strokes.forEach((stroke) => {
    if (stroke === currentStroke) {
      stroke.classList.add("stroke-option-selected");
    } else {
      stroke.classList.replace("stroke-option-selected", "stroke-option");
    }
  });
}
