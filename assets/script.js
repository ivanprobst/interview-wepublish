// Const
const topBorderChar = "-";
const sideBorderChar = "|";
const lineChar = "x";

const createCanvasRegex = /C (\d+) (\d+)$/;
const drawLineRegex = /L (\d+) (\d+) (\d+) (\d+)$/;
const drawRectangleRegex = /R (\d+) (\d+) (\d+) (\d+)$/;
const fillRegex = /B (\d+) (\d+) (.)$/;
const quitRegex = /Q$/;

// Handlers
let canvasWidth = 0;
let canvasHeight = 0;
let canvasMatrix = [];

// TODO: see if drawing can be "optimized"
const drawCanvas = () => {
  let drawnCanvas = "";

  // Upper canvas border
  for(let y = 0; y < (canvasWidth + 2); y++) {
    drawnCanvas = drawnCanvas + topBorderChar;
  }
  drawnCanvas = drawnCanvas + "<br>";

  // Canvas content
  for(let y = 0; y < canvasHeight; y++) {
    drawnCanvas = drawnCanvas + sideBorderChar;
    for(let x = 0; x < canvasWidth; x++) {
      drawnCanvas = drawnCanvas + canvasMatrix[y][x];
    }
    drawnCanvas = drawnCanvas + sideBorderChar + "<br>";
  }

  // Lower canvas border
  for(let y = 0; y < canvasWidth + 2; y++) {
    drawnCanvas = drawnCanvas + topBorderChar;
  }

  const canvas = document.getElementById("canvas-area");
  canvas.innerHTML = drawnCanvas;
};

const createCanvas = () => {
  for(let y = 0; y < canvasHeight; y++) {
    canvasMatrix[y] = [];
    for(let x = 0; x < canvasWidth; x++) {
      canvasMatrix[y][x] = `&nbsp;`;
    }
  }
};

const drawLine = (x1, y1, x2, y2) => {
  // Vertical line
  if(x1 === x2) {
    const startY = Math.min(y1, y2) - 1;
    const endY = Math.max(y1, y2);
    for(let i = startY; i < endY; i++) {
      canvasMatrix[i][x1 - 1] = lineChar;
    }
  // Horizontal line
  } else {
    const startX = Math.min(x1, x2) - 1;
    const endX = Math.max(x1, x2);
    for(let i = startX; i < endX; i++) {
      canvasMatrix[y1 - 1][i] = lineChar;
    }
  }
};

const executeCommand = (text) => {
  // TODO: add handling of other commands
  let commandData = null;
  
  commandData = text.match(createCanvasRegex);
  if(commandData)
  {
    canvasWidth = parseInt(commandData[1]);
    canvasHeight = parseInt(commandData[2]);

    createCanvas();
  }

  commandData = text.match(drawLineRegex);
  if(commandData) {
    drawLine(commandData[1], commandData[2], commandData[3], commandData[4]);
  }

  drawCanvas();
};

const isCommandLegit = (text) => {
  // If canvas doesn't exist, accept only C command
  if(canvasMatrix.length === 0) {
    if(text.match(createCanvasRegex)) {
      return true;
    }

    return false;
  }
  
  // If canvas exists, accept any command
  // TODO: check if coordinates actually fits in canvas
  if(text.match(drawLineRegex)) {
    // TODO: check line is horizontal / vertical
    return true;
  } else if (text.match(drawRectangleRegex)) {
    return true;
  } else if (text.match(fillRegex)) {
    return true;
  } else if (text.match(quitRegex)) {
    return true;
  }

  return false;
};

// Init
const input = document.getElementById("input-field");
input.addEventListener("keyup", (e) => {
  const inputValue = e.target.value;

  if(isCommandLegit(inputValue)) {
    input.style.borderColor = "green";
    input.style.backgroundColor = "green";
  }
  else {
    input.style.borderColor = "red";
    input.style.backgroundColor = "red";
    return;
  }

  if(e.key === "Enter") {
    executeCommand(inputValue);

    // TODO: clear command input once command is executed
  }
})

// Tests
canvasWidth = 10;
canvasHeight = 10;
createCanvas()
drawCanvas();