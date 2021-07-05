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

class Sudoku
{
    constructor(cells)
    {
        if (cells == null)
            cells = createSudoku();
        this.cells = cells;
        this.colors = [null, "#a7f1a7", "PaleTurquoise", "#FFA953", "#FF7E77", "lightpink", "#DC76FF", "#FFFF66", "lightgray", "#99CCFF"]
    }

    update(elem, updatetype, value) {
        // this is a single cell value
        var cell  = this.cells[elem.id];
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
        var cell = this.cells[elem.id];
        elem.textContent = ''
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
        if (cell.color != '')
            elem.style.backgroundColor = this.colors[cell.color];
        else
            elem.style.backgroundColor = null;

    }

    renderAll() {
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