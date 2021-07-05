function merge(input, value) {
    if (value == '')
        return value;
    if (input != null && input.includes(value))
        return input.replace(value, "");
    var elements = input.split();
    elements.push(value);
    return elements.sort().join('');
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
    }

    update(elem, updatetype, value) {
        // this is a single cell value
        var cell  = this.cells[elem.id];
        if (updatetype == "mode-corner")
            cell.corner = merge(cell.corner, value)
        if (updatetype == "mode-center")
            cell.center = merge(cell.center, value)
        if (updatetype == "mode-value")
            if (cell.value == value)
                cell.value = '';
            else
                cell.value = value
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
        elem.backgroundColor = cell.color;
    }

    updateCells(selection, updatetype, value)
    {
        selection.forEach(e => this.update(e, updatetype, value));
    }
}