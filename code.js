var sudoku = new Sudoku();
var multiselect = false;

function createCell(c, r) {
    var elem = document.createElement("div");
    elem.className = "cell";
    elem.id = "r" + r + "c" + c;
    elem.addEventListener("click", oncellselect)

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

function oncellselect(e) {
    if (this.classList.contains("selectedcell"))
        this.classList.remove("selectedcell");
    else
    {
        if (!multiselect)
            resetSelectedCells();
        this.classList.add("selectedcell")    
    }
}

function resetSelectedCells() {
    document.querySelectorAll(".selectedcell").forEach(cell => {
        cell.classList.remove("selectedcell")});
}

function createRow(r) {
    var row = document.createElement("div");
    for (var i = 0; i < 9; i++)
    {
        var cell = createCell(r, i);
        row.appendChild(cell);
    }
    return row;
}

function start(data) {
    sudoku = new Sudoku(data);
    var mainarea = document.getElementById("content");
    mainarea.textContent = "";
    for (var i = 0; i < 9; i++)
    {
        var row = createRow(i);
        mainarea.appendChild(row);
    } 
    sudoku.renderAll();
    for(const element of document.getElementsByClassName("updatetype")) {
        element.addEventListener("click", toggleUpdateMode)
    }
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

function apply(value) {
    var updatemode = getUpdateMode();
    var selection = document.querySelectorAll(".selectedcell");
    sudoku.updateCells(selection, updatemode, value);
    if (multiselect)
        toggleSelectMode();
}

function loadfile() {
    document.getElementById('file-input').click();
}

function loadpuzzle(){
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

start();
