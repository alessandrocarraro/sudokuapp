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

function showMessage(message, title="Message") {
    var elem = document.getElementById("modal-message");
    var msgbox = bootstrap.Modal.getOrCreateInstance(elem);

    var textElem = document.getElementById("message-text");
    textElem.innerText = message;

    var titleElem = document.getElementById("message-title");
    titleElem.innerText = title;

    msgbox.show();
}

function solvePuzzle() {
    var values = sudoku.getCurrentValues();
    var defn = Puzzle.fromjson(sudoku.inputData);
    var solver = new Puzzle(values, defn);
    var solution = solver.solve();
    if (solution == null){        
        showMessage("I cannot find a solution.", "Warning")
    }
    else {
        solution.values.map((v, idx) => {
            var c = idx % 9;
            var r = (idx-c)/9;
            var label = "r" + r + "c" + c;
            sudoku.cells[label].value = v;
            sudoku.renderAll();
        });    
    }
}

function testPuzzle() {
    var values = sudoku.getCurrentValues();
    var defn = Puzzle.fromjson(sudoku.inputData);
    var solver = new Puzzle(values, defn);
    var message = solver.valid() ? "Looks good to me!!!": "Something doesn't look right...";
    showMessage(message);
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


var puzzle = { "values" : {"r0c0": 7, "r6c3": 3, "r5c2": 2, "r8c8": 5},
  "elements": [{"type": "cage", "value": 23, "cells": ["r1c2", "r1c3", "r2c3"]},
                {"type": "cage", "value": 12, "cells": ["r0c0", "r0c1"]},
                {"type": "cage", "value": 27, "cells": ["r2c0", "r3c0", "r4c0", "r5c0", "r6c0", "r7c0"]},
                {"type": "cage", "value": 17, "cells": ["r6c6", "r6c7"]},
                {"type": "cage", "value": 12, "cells": ["r1c6", "r1c7", "r1c8"]},
                {"type": "cage", "value": 21, "cells": ["r5c5", "r5c6", "r5c7", "r5c8"]},
                {"type": "cage", "value": 18, "cells": ["r2c7", "r2c8", "r3c7", "r3c8"]},
            ]}

start(puzzle);
