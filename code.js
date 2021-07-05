var selection = [];
var sudoku = new Sudoku();

function createCell(r, c) {
    var par = document.createElement("p");
    text = document.createTextNode("[" + r + "," + c+ "]");
    par.appendChild(text);
    var elem = document.createElement("div");
    elem.className = "cell";
    elem.id = "r" + r + "c" + c;
    elem.appendChild(par);
    elem.addEventListener("click", oncellselect)
    return elem;
}

function findParent(elem, localName) {
    if (elem.localName == localName)
        return elem;
    return findParent(elem.parentNode, localName);
}

function clearSelection() {
    selection = [];
    var elements = document.getElementById("content").getElementsByClassName("cell");
    elements.forEach(element => {
        element.style.backgroundColor = null;
    });
}

function oncellselect(e) {
    var current = e.target;
    if (current.localName != "div")
        current = findParent(current, "div");
    
    if (current.style.backgroundColor == "lightyellow")
        current.style.backgroundColor = null;
    else
        current.style.backgroundColor = "lightyellow";

    selection.push(sudoku.labels[elem.id])
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

function start() {    
    var mainarea = document.getElementById("content");
    mainarea.textContent = "";
    for (var i = 0; i < 9; i++)
    {
        var row = createRow(i);
        mainarea.appendChild(row);
    }   
}

function apply(value) {
    
}