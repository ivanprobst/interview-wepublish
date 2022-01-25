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
  const canvas = document.getElementById("canvas-area");

  if(canvasMatrix.length === 0) {
    canvas.innerHTML = "No canvas defined";
    return;
  }

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

const drawHorizontalLine = (x1, x2, y) => {
  for(let i = Math.min(x1, x2) - 1; i < Math.max(x1, x2); i++) {
    canvasMatrix[y - 1][i] = lineChar;
  }
};

const drawVerticalLine = (y1, y2, x) => {
  for(let i = Math.min(y1, y2) - 1; i < Math.max(y1, y2); i++) {
    canvasMatrix[i][x - 1] = lineChar;
  }
};

const drawLine = (x1, y1, x2, y2) => {
  if(x1 === x2) {
    drawVerticalLine(y1, y2, x1);
  } else {
    drawHorizontalLine(x1, x2, y1);
  }
};

const drawRectangle = (x1, y1, x2, y2) => {
  const leftX = Math.min(x1, x2);
  const rightX = Math.max(x1, x2);
  const topY = Math.min(y1, y2);
  const bottomY = Math.max(y1, y2);

  drawHorizontalLine(leftX, rightX, topY);
  drawVerticalLine(topY, bottomY, rightX);
  drawHorizontalLine(rightX, leftX, bottomY);
  drawVerticalLine(bottomY, topY, leftX);
};

const fillAndExpand = (x, y, fillChar) => {
  if(canvasMatrix[y - 1][x - 1] === lineChar || canvasMatrix[y - 1][x - 1] === fillChar)
    return;

  canvasMatrix[y - 1][x - 1] = fillChar;

  if(y > 1) {
    fillAndExpand(x, y - 1, fillChar);
  }

  if(x < canvasWidth) {
    fillAndExpand(x + 1, y, fillChar);
  }

  if(y < canvasHeight) {
    fillAndExpand(x, y + 1, fillChar);
  }

  if(x > 1) {
    fillAndExpand(x - 1, y, fillChar);
  }
};

const resetCanvas = () => {
  canvasWidth = 0;
  canvasHeight = 0;
  canvasMatrix = [];
};

const executeCommand = (text) => {
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
    drawLine(parseInt(commandData[1]), parseInt(commandData[2]), parseInt(commandData[3]), parseInt(commandData[4]));
  }

  commandData = text.match(drawRectangleRegex);
  if(commandData) {
    drawRectangle(parseInt(commandData[1]), parseInt(commandData[2]), parseInt(commandData[3]), parseInt(commandData[4]));
  }

  commandData = text.match(fillRegex);
  if(commandData) {
    fillAndExpand(parseInt(commandData[1]), parseInt(commandData[2]), commandData[3]);
  }

  commandData = text.match(quitRegex);
  if(commandData) {
    resetCanvas();
  }

  drawCanvas();
};

const isCommandValid = (text) => {
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

  if(isCommandValid(inputValue)) {
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
