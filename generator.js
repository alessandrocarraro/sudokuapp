function simplegenerator() {
    
}

function updateValue(data, idx, remove) {
    data[idx] = data[idx].replace(remove, "");
}

var numbers = '123456789';

function updateState(state, i, value) {
    var values = state.map((x) => x);
    
    var col = i % 9;
    var row = (i-col)/9;
    var boxcol = (col - col%3);
    var boxrow = (row - row%3);
    var boxorigin = boxrow*9 + boxcol;
    for(var o = 0; o < 9; o++)
    {
        updateValue(values, row*9 + o, value);
        updateValue(values, o*9 + col, value);
        var boxadd = o%3;
        var boxoffset = (o-boxadd)*3;
        updateValue(values, boxorigin + boxadd + boxoffset, value);
    }
    values[i] = data[i];
    return state;
}

function computeStates(data) {
    data = data.split('');

    var values = data.map((v) => "123456789");

    for(var i=0; i < data.length; i++)
    {
        var value = data[i]
        if (numbers.includes(data[i]))
        {
            var col = i % 9;
            var row = (i-col)/9;
            var boxcol = (col - col%3);
            var boxrow = (row - row%3);
            var boxorigin = boxrow*9 + boxcol;
            for(var o = 0; o < 9; o++)
            {
                updateValue(values, row*9 + o, value);
                updateValue(values, o*9 + col, value);
                var boxadd = o%3;
                var boxoffset = (o-boxadd)*3;
                updateValue(values, boxorigin + boxadd + boxoffset, value);
            }
            values[i] = data[i];
        }
    }
    return values;
}


function solve(data) {
    var grid = computeStates(data);
}

var state = '1' + new Array(79).fill(' ').join('') + '1';
var values = computeStates(state);
