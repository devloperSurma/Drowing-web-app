const canvas = document.querySelector("canvas"),

    toolBtns = document.querySelectorAll(".tool"),

    fillColor = document.querySelector("#fill-color"),

    sizeSlider = document.querySelector("#size-slider"),

    colorBtns = document.querySelectorAll(".colors .option"),

    colorPicker = document.querySelector("#color-picker"),

    clearCanvas = document.querySelector(".clear-canvas"),

    saveImg = document.querySelector(".save-img"),

    ctx = canvas.getContext("2d");


//gloabal variables with default value

let preMouseX, preMouseY, snapshot,

    isDrawing = false,

    selectedTool = "brush",

    brushWidth = 5,

    selectedColor = "#000";

const setCanvasBackground = () => {
    //setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillStyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    //setting canvas width/height.. offsetWidth/offsetHeight returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    //if fillcolor isn't checked draw a rect with border else draw rect with background
    if (!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY); //past 17
    }
    ctx.fillRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY);
}

const startDraw = (e) => {
    isDrawing = true;
    preMouseX = e.offsetX;
    preMouseY = e.offsetY;
    ctx.beginPath(); //creating new path to draw
    ctx.lineWidth = brushWidth; //passing brushSize as line width
    ctx.strokeStyle = selectedColor; // passing selextedColor as stroke style
    ctx.fillStyle = selectedColor; //passing selextedColor as fill style
    //copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawCircle = (e) => {
    ctx.beginPath(); //creating new path to draw circle
    //getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((preMouseX - e.offsetX), 2) + Math.pow((preMouseY - e.offsetY), 2))
    ctx.arc(preMouseX, preMouseY, radius, 0, 2 * Math.PI); //creting circle according to the mouse pointed
    fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillColor id checked fill circle else draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); //creating new path to draw circle
    ctx.moveTo(preMouseX, preMouseY); //moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); //creting first line accoding to the mouse pointer
    ctx.lineTo(preMouseX * 2 - e.offsetX, e.offsetY); //creting bottom line of triangle
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillcolor is checked fill triangle else draw border
}

//2
const drawing = (e) => {
    if (!isDrawing) return; //if isDrawing id false return from here
    ctx.putImageData(snapshot, 0, 0); //adding copied canvas data on to this canvas
    if (selectedTool === "brush" || selectedTool === "eraser") {
        //if selected tool is eraser then set strokeStyle to white
        //to paint white color on to the existing canvas content else set stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); //creting line according to the mouse pointer
        ctx.stroke(); //drawing/filling line with color
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") { //25
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { //adding click event to all tool option
        //removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id
        console.log(selectedTool)
        // console.log(btn.id) past
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); //passing slider vlaue as brushWidth

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        //removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        //passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
    });
});

colorPicker.addEventListener("change", () => {
    //passing picker color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing canvasData as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});

canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => isDrawing = false)