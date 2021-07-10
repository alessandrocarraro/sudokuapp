class Constraint {
    constructor(cells) {
        this.cells = cells;
    }

    initilize (puzzle) {
    }

    includes(idx) {
        return this.cells.includes(idx);
    }

    unique(puzzle) {
        var values = new Set(this.cells.map((i) => puzzle.values[i]));
        return values.size == this.cells.length;
    }

    possible(puzzle) {
        return true;
    }
}

class Unique extends Constraint {
    update(puzzle, idx, value) {
        for(const peeridx of this.cells) {  
            if (peeridx != idx)
            {
                var current = puzzle.state[peeridx];
                if (current.has(value))
                {
                    var updated = new Set(current);
                    updated.delete(value);
                    if (!puzzle.updateState(peeridx, updated)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    valid(puzzle) {
        return this.unique(puzzle);
    }
}


class CageInfo {
    constructor(puzzle, cage) {
        var unknowns = []
        var residual = cage.value;
        var state = new Set();

        for(var peeridx of cage.cells) {
            var peervalue = puzzle.values[peeridx];
            residual = residual - peervalue;
            if (peervalue == 0) {
                unknowns.push(peeridx);
                for(var v of puzzle.state[peeridx]) {
                    state.add(v)
                }
            }
        }
        this.unknowns = unknowns;
        this.residual = residual;
        this.state = state;
    }

    compute() {
        var state = new Set();
        combinations(this.unknowns.length, [...this.state.values()])
            .filter(x => x.sum() == this.residual)
            .forEach(x=> x.forEach(v => state.add(v)));
        return state;
    }

    possible() {
        if (this.unknowns.length == 0) {
            return this.residual == 0;
        }
        return this.compute().size > 0;
    }
}

class Cage extends Constraint {
    constructor(cells, value) {
        super(cells);
        this.value = value;
    }

    initilize (puzzle) {
        var possible = Combinations.combinations(this.cells.length, this.value);
        for(var idx of this.cells) {
            puzzle.updateState(idx, possible);
        }
    }

    compute(info) {
        var state = new Set();
        combinations(info.unknowns.length, [...info.possible.values()])
            .filter(x => x.sum() == info.residual)
            .forEach(x=> x.forEach(v => state.add(v)));
        return state;
    }

    update(puzzle, idx, value) {
        var info = new CageInfo(puzzle, this);
        if (info.unknowns.length == 0)
            return info.residual == 0;

        var state = info.compute(info);
        if (state.size == 0)
            return false;

        for(var peeridx of info.unknowns) {
            var current = puzzle.state[peeridx];
            var updated = new Set([...current].filter(x => state.has(x)));
            if (updated.size != current.size) {
                if (!puzzle.updateState(peeridx, updated)) {
                    return false;
                }
            }
        }
        return true;
    }

    valid(puzzle) {
        var values = this.cells.map((i) => puzzle.values[i]);
        return values.sum() == this.value && new Set(values).size == values.length;
    }

    possible(puzzle) {
        return new CageInfo(puzzle, this).possible();
    }
}