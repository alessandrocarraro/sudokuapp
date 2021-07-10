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

Set.prototype.first = function(){return this.values().next().value;};

Set.prototype.equals = function(other) {
    if (this.size !== other.size) return false;
    for (var a of this) if (!other.has(a)) return false;
    return true;
}

Array.prototype.sum = function() { return this.reduce((a,b) => a + b, 0); };

class Puzzle {
    constructor(values, defn, state)
    {
        this.values = values.map(this.clean);
        this.defn = defn ?? Puzzle.create();
        if (state != null)
            this.state = state;
        else
            this.compute();
    }

    clean(v) {
        v = v + '';
        return numbers.includes(v) ? parseInt(v) : 0;
    }

    clone() {
        return new Puzzle(this.values.map(identity), this.defn, this.state.map(identity));
    }

    static create(constraints) {
        constraints = constraints ?? this.standardsets();
        var cells = this.constraints(constraints);
        return {"constraints": constraints, "cells": cells};
    }

    static constraints(values) {
        var cells = new Array();
        for(var i = 0; i < 81; i++)
            cells.push(values.map((s,idx) => s.includes(i) ? idx : null).filter(w => w != null));
        return cells;        
    }

    static indexFromLabel(label) {
        return parseInt(label[1]) * 9 + parseInt(label[3]);
    }

    static standardsets() {
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
        return sets.map((c) => new Unique(c));
    }

    static fromjson(defn) {
        var values = new Array(81).map((x) => 0);
        for(var label in defn.values) {
            values[this.indexFromLabel(label)] = defn.values[label];
        }

        var constraints = this.standardsets();
        if (defn.elements)
        {
            for(var elem of defn.elements) {
                if (elem.type == "cage") {
                    var cells = elem.cells.map(this.indexFromLabel);
                    constraints.push(new Cage(cells, elem.value));
                }
            }
        }
        return this.create(constraints)
    }

    remove(idx, values) {
        var current = this.state[idx];
        var updated = new Set(current);
        for(var v of values) {
            updated.delete(v);
        }
        if (updated.size != current.size) {
            if (!this.updateState(idx, updated))
                return false;
        }
        return true;
    }

    updateState(idx, state) {
        this.state[idx] = state;
        if (state.size == 0)
            return false;        
        if (state.size == 1) {
            if(!this.update(idx, state.first()))
                return false;
        }
        else if (state.size == 2) {
            for(const setidx of this.defn.cells[idx]) {                
                var set = this.defn.constraints[setidx];
                for(var peeridx of set.cells) {
                    if (idx != peeridx) {
                        var peerstate = this.state[peeridx];
                        if (state.equals(peerstate)) {
                            // I found a naked pair
                            // remove the pair from all other cells in the set
                            for(var cellidx of set.cells) {
                                if (cellidx != idx && cellidx != peeridx) {
                                    if (!this.remove(cellidx, state)) {
                                        return false;
                                    }
                                }
                            }
                        }    
                    }
                }
            }
        }
        return true;
    }

    find(idx) {
        return this.defn.cells[idx].forEach(i => this.defn.constraints[i]);
    }

    update(idx, value) {
        this.values[idx] = value;
        this.state[idx] = new Set([value]);
        for(const setidx of this.defn.cells[idx]) {
            var c = this.defn.constraints[setidx];
            if (!c.update(this, idx, value)) {
                return false;
            }
        }
        return true;
    }

    compute() {        
        this.state = this.values.map((v) => new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
        for(const constraint of this.defn.constraints) {
            constraint.initilize(this);
        }

        for(const [idx, value] of this.values.entries())
        {
            if (value)
                this.update(idx, value);
        }
    }

    // check if all values are defined
    completed () {
        return this.values.every((v) => v);
    }

    valid() {
        return this.defn.constraints.every(c => c.valid(this));
    }

    possible() {
        if (!this.state.every((x) => x.size > 0)) {
            return false;
        }
        return this.defn.constraints.every(set => set.possible(this));
    }

    solve(depth=1) {
        if (depth > 81)
            console.log("something is wrong");
        
        if (this.completed()) {
            if(this.valid())
                return this;
            return;
        }
        
        var minChoices = 10, guessIdx = -1;
        this.state.map((state, idx) => {
            var priority = state.size;
            if (priority > 1) {
                priority = priority / this.defn.cells[idx].length;

                if (priority < minChoices) {
                    minChoices = priority;
                    guessIdx = idx;
                }
            }
        })
        var guessState = this.state[guessIdx];
        console.log("guessing [" + guessIdx + "] from { " + [...guessState].join(', ') + " }");
        for(const g of guessState)
        {
            var clone = this.clone();
            if (clone.update(guessIdx, g)) {
                console.log(clone.print())
                if (clone.possible()) {
                    var solution = clone.solve(depth+1);
                    if (solution) {
                        return solution;
                    }
                }
            }
        }
        return;
    }

    print() {
        return "=========\n" + [...Array(9).keys()].map(i => this.values.slice(i*9, i*9+9).join('')).join('\n');
    }
}


