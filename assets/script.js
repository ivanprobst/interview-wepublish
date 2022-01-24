// Const
const topBorderChar = "-";
const sideBorderChar = "|";
const lineChar = "x";

const createCanvasRegex = /C ([0-9]+) ([0-9]+)$/;

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

const executeCommand = (text) => {
  // TODO: add handling of other commands

  const commandData = text.match(createCanvasRegex);
  if(commandData)
  {
    canvasWidth = parseInt(commandData[1]);
    canvasHeight = parseInt(commandData[2]);

    createCanvas();
  }

  drawCanvas();
};

const isCommandLegit = (text) => {
  // TODO: refine checks if command is valid:
  // legit command name?
  // legit values?
  // canvas exists?

  if(text.match(createCanvasRegex)) {
    return true;
  }
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