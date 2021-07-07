var sudoku = new Renderer();
var multiselect = false;
var mousedown = false;

function createCell(c, r) {
    var elem = document.createElement("div");
    elem.className = "cell";
    elem.id = "r" + r + "c" + c;
    elem.addEventListener("mousedown", oncellmousedown);
    elem.addEventListener("mouseenter", oncellmouseenter);

    if (r % 3 == 0)
        elem.style.borderTop = "3px solid black";
    else
        elem.style.borderTop = "1px solid black";
    if (r == 8)
        elem.style.borderBottom = "3px solid black";
    if (c % 3 == 0)
        elem.style.borderLeft = "3px solid black";
    else
        elem.style.borderLeft = "1px solid black";
    if (c == 8)
        elem.style.borderRight = "3px solid black";
    return elem;
}

function oncellmousedown(e) {
    if (!e.ctrlKey)
        resetSelectedCells();
    mousedown = true;
    this.classList.add("selectedcell");
}

function oncellmouseenter(e) {    
    if (mousedown)
        this.classList.add("selectedcell")
}

function resetSelectedCells() {
    document.querySelectorAll(".selectedcell").forEach(cell => {
        cell.classList.remove("selectedcell")});
}

function start(data) {
    sudoku = new Renderer(data);
    sudoku.renderAll();
}

function toggleUpdateMode(e) {
    updatemode = this.id;
    document.querySelectorAll(".updatetype").forEach(element => {
        selectButton(element, element.id == this.id);
    });
}

function toggleSelectMode() {
    multiselect = !multiselect;
    if (!multiselect)
        resetSelectedCells();
    selectButton(document.getElementById("btn-select-mode"), multiselect)
}

function selectButton(element, condition) {
    if (condition)
    {
        element.classList.remove("btn-outline-secondary");
        element.classList.add("btn-secondary");
    }        
    else
    {
        element.classList.remove("btn-secondary");
        element.classList.add("btn-outline-secondary");
    }
}

function getUpdateMode() {
    for(const elem of document.getElementsByName("updatetype"))
    {
        if (elem.checked)
            return elem.id;
    }
    console.log("this is impossible");
    return "mode-value";
}

function apply(value, updatemode) {
    var updatemode = updatemode ?? getUpdateMode();
    var selection = document.querySelectorAll(".selectedcell");
    sudoku.updateCells(selection, updatemode, value);
    if (multiselect)
        toggleSelectMode();
}

function loadpuzzle(){
    console.log("file input changed");
    var loader = document.getElementById('file-input');
    var reader = new FileReader();
    reader.readAsText(loader.files[0]);
    reader.onload = function () {
        var data = JSON.parse(reader.result);
        start(data);
    }
    reader.onerror = function() {
        console.log(reader.error);
    }    
}

function resetPuzzle() {
    start(sudoku.inputData);
}

function solvePuzzle() {
    var values = sudoku.getCurrentValues();
    var solver = new Puzzle(values);
    var solution = solver.solve();
    solution.values.map((v, idx) => {
        var c = idx % 9;
        var r = (idx-c)/9;
        var label = "r" + r + "c" + c;
        sudoku.cells[label].value = v;
        sudoku.renderAll();
    });
}

function testPuzzle() {
    var values = sudoku.getCurrentValues();
    var solver = new Puzzle(values);
    var id = solver.valid() ? "modal-success" : "modal-failure";
    var elem = document.getElementById(id);
    var msgbox = bootstrap.Modal.getOrCreateInstance(elem);
    msgbox.show();
}

function closeModal(id) {
    var elem = document.getElementById(id);
    var modal = bootstrap.Modal.getInstance(elem);
    modal.hide();
}

function loadfile() {
    var elem = document.getElementById("file-input");
    elem.value = null;
    elem.click();
}

function savefile() {
    var jsonData = sudoku.save();
    download(jsonData, 'puzzle.json', 'application/json');
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

window.onmouseup = e => { mousedown = false; }

start();
