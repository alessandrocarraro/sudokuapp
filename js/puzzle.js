var numbers = "123456789"
var identity = x => x;

function shuffle(value) {
    var a = value.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a;
}

class Puzzle {
    constructor(values, defn, state)
    {
        this.values = values.map(this.clean);
        this.defn = defn ?? this.standard();
        if (state != null)
            this.state = state;
        else
            this.compute();
    }

    clean(v) {
        v = v + '';
        return numbers.includes(v) ? v : '.';
    }

    clone() {
        return new Puzzle(this.values.map(identity), this.defn, this.state.map(identity));
    }

    standard() {
        // compute sets
        var sets = new Array();
        var elems = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        for(var i = 0; i < 9; i++)
        {
            // rows
            sets.push(elems.map(e => i*9+e));
            sets.push(elems.map(e => e*9+i));
            sets.push(elems.map((e)=> {
                var o = (i-i%3)*9 + (i%3)*3;                
                return o + (e-e%3)*3 + e%3;
            }));
        }

        // compute cells
        var cells = new Array();
        for(var i = 0; i < 81; i++)
            cells.push(sets.map((s,idx) => s.includes(i) ? idx : null).filter(w => w != null));
        return {"sets": sets, "cells": cells};
    }

    update(idx, value) {
        this.values[idx] = value;
        this.state[idx] = value;
        for(const setidx of this.defn.cells[idx]) {
            for(const peeridx of this.defn.sets[setidx]) {
                if (peeridx != idx)
                {
                    var current = this.state[peeridx];
                    if (current.includes(value))
                    {
                        var updated = current.replace(value, "");
                        this.state[peeridx] = updated;
                        if (updated.length == 1)
                        {
                            if(!this.update(peeridx, updated))
                                return false;
                        }
                        else if (updated.length == 0)
                            return false;
                    }
                }
            }
        }
        return true;
    }

    compute() {
        this.state = this.values.map((v) => "123456789");
        for(const [idx, value] of this.values.entries())
        {
            if (value != ".")
                this.update(idx, value);
        }
    }

    // check if all values are defined
    completed () {
        return this.values.every((v) => v != '.');
    }

    valid() {
        if (!this.completed())
            return false;
        
        // check all sets
        return this.defn.sets.every(s => this.unique(s));
    }

    unique(set) {
        var values = new Set(set.map((i) => this.values[i]));
        return values.size == set.length;
    }

    possible() {
        return this.state.every((x) => x.length > 0);
    }

    solve(depth=1) {
        if (depth > 81)
            console.log("something is wrong");
       
        var unknown = this.state.filter(x => x.length > 1).length;
        if (unknown == 0)
        {
            
            this.values = this.state;
            if (this.defn.sets.every(s => this.unique(s)))
            {
                console.log("found a valid solution");
                console.log(this.print());
                return this;
            }
            return;
        }

//        console.log("unknown cells: " + unknown + " [depth=" + depth + "]");
        var sizes = this.state.map(x => x.length > 1 ? x.length : 10);
        var minSize = Math.min.apply(null, sizes);
        var guessIdx = sizes.indexOf(minSize);
        var guessState = this.state[guessIdx];
        var guess = guessState.split(''); //shuffle(guessState);

//        console.log("best cell to guess is " + guessIdx);
//        console.log("guess state is " + guessState + ' in order ' + guess);
        for(const g of guess)
        {
            var clone = this.clone();
            clone.update(guessIdx, g);
            if (clone.possible())
            {
                var solution = clone.solve(depth+1);
                if (solution)
                    return solution;
            }
        }
        return;
    }

    print() {
        return [...Array(9).keys()].map(i => this.values.slice(i*9, i*9+9).join('')).join('\n');
    }
}


