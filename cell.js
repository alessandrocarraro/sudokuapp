function merge(input, value) {
    if (value == '')
        return value;
    if (input != null && input.includes(value))
        return input.replace(value, "");
    var elements = input.split();
    elements.push(value);
    return elements.sort().join('');
}

function replace(input, value) {
    if (value == input)
        return '';
    return value;
}

function calculateCoordinates(label) {
    return  { "x": parseInt(label[1]), "y": parseInt(label[3])};
}

function calculateDistance(label) {
    var coord = calculateCoordinates(label);    
    return coord.x + coord.y;
}

function createSudoku() {
    sudoku = {};
    for (var i = 0; i < 9; i++) {
        for(var j = 0; j < 9; j++)
        {
            var label = "r" + i + "c" + j;
            var cell = {};
            cell.corner = '';
            cell.center = '';
            cell.value = '';
            cell.fixed = '';
            cell.color = null;
            sudoku[label] = cell;
        }
    }
    return sudoku;
}

function createMark(value, style) {
    var elem = document.createElement("div");
    elem.className = style;
    elem.appendChild(document.createTextNode(value));
    return elem;
}

function createCage(walls) {
    var elem = document.createElement("div");
    elem.classList.add("cage");
    if (walls.top)
        elem.style.borderTop = "1px dashed black";
    if (walls.bottom)
        elem.style.borderBottom = "1px dashed black";
    if (walls.left)
        elem.style.borderLeft = "1px dashed black";
    if (walls.right)
        elem.style.borderRight = "1px dashed black";
    return elem;
}

function checkCageWall(coord, others, x, y) {
    var other = "r" + (coord.x + x) + "c" + (coord.y + y);
    return !others.includes(other);
}

class Sudoku
{
    constructor(data)
    {
        this.inputData = data;
        if (data != null && data.r0c0 != null)
        {
            // old format
            this.cells = data;
        }
        else
        {
            this.cells = createSudoku();
            if (data != null)
                this.initPuzzle(data);    
        }
        this.colors = [null, "#a7f1a7", "PaleTurquoise", "#FFA953", "#FF7E77", "lightpink", "#DC76FF", "#FFFF66", "lightgray", "#99CCFF"]
    }

    initPuzzle(data) {
        for (const [key, value] of Object.entries(data.values))
            this.cells[key].fixed = value;        
        if (data.elements != null)
            data.elements.forEach(e => this.initElement(e));
   }

    initElement(element) {
        if (element.type == "cage")
            return this.initCage(element);
        console.log("element " + element.type + " is not implemented yet.");
    }

    initCage(cage) {
        // find smallest coordinate
        var distances = cage.cells.map(e=> calculateCoordinates(e)).map(e => e.x + e.y);
        var minDistance = Math.min.apply(null, distances);
        var valueCell = cage.cells[distances.indexOf(minDistance)];
        this.cells[valueCell].cagevalue = cage.value;

        for(const label of cage.cells)
        {
            var cell = this.cells[label];
            cell.cage = {}
            var coord = calculateCoordinates(label);
            cell.cage.left = checkCageWall(coord, cage.cells, 0, -1);
            cell.cage.right = checkCageWall(coord, cage.cells, 0, 1);
            cell.cage.top = checkCageWall(coord, cage.cells, -1, 0);
            cell.cage.bottom = checkCageWall(coord, cage.cells, 1, 0);
        }
        return;
    }

    update(elem, updatetype, value) {
        // this is a single cell value
        var cell = this.cells[elem.id];
        if (updatetype == "clearall")
        {
            cell.corner = '';
            cell.center = '';
            cell.value = '';
            cell.color = '';
        }
        if (updatetype == "mode-corner")
            cell.corner = merge(cell.corner, value)
        if (updatetype == "mode-center")
            cell.center = merge(cell.center, value)
        if (updatetype == "mode-value")
            cell.value = replace(cell.value, value);
        if (updatetype == "mode-color")
            cell.color = replace(cell.color, value);
        this.render(elem);
    }

    render(elem) {
        var original = elem;
        var cell = this.cells[elem.id];
        elem.textContent = ''
        if (cell.cage)
        {
            var cage = createCage(cell.cage);
            elem.appendChild(cage);
            elem = cage;
        }
        if(cell.cagevalue)
            elem.appendChild(createMark(cell.cagevalue, "pencilmark-cage"));

        if (cell.fixed)
        {
            var child = createMark(cell.fixed, "pencilmark-fixed");
            return elem.appendChild(child);
        }

        if (cell.value != '')
        {
            var child = createMark(cell.value, "pencilmark-value");
            return elem.appendChild(child);
        }

        if (cell.corner != '')
            elem.appendChild(createMark(cell.corner, "pencilmark-corner"));
        if (cell.center != '')
            elem.appendChild(createMark(cell.center, "pencilmark-center"));

        // color always applies to original div
        if (cell.color != '')
            original.style.backgroundColor = this.colors[cell.color];
        else
            original.style.backgroundColor = null;

    }

    renderAll() {
        var mainarea = document.getElementById("content");
        mainarea.textContent = "";
        for (var i = 0; i < 9; i++)
        {
            var row = createRow(i);
            mainarea.appendChild(row);
        } 
        document.querySelectorAll(".cell")
            .forEach(e => this.render(e));
    }

    updateCells(selection, updatetype, value)
    {
        selection.forEach(e => this.update(e, updatetype, value));
    }

    save() {
        return JSON.stringify(this.cells);
    }
}