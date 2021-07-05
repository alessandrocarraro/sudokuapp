class SudokuCell
{
    constrcutor(row, column, value)
    {
        this.row = row;
        this.column = column;
        this.value = value;
    }
}

class Sudoku
{
    constructor()
    {
        this.labels = {}
        this.cells = new Array(9);
        for (var i = 0; i < 9; i++)
        {
            var row = new Array(9);
            for(var j = 0; j < 9; j++)
            {
                var cell = new SudokuCell(i, j);
                row[i] = cell;
                var label = "r" + i + "c" + j;
                this.labels[label] = cell;
            }
            this.cells[i] = row;
        }
        this.cells = row;
    }
}