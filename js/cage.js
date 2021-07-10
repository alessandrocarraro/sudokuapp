

function combinations(num, elements, root=[]) {
    if (num == 1)
        return elements.map(e => root.concat([e]));

    var results = []
    for(var i = 0; i < elements.length; i++) {
        var start = root.concat([elements[i]]);
        var combins = combinations(num-1, elements.slice(i+1), start);
        results = results.concat(combins);
    }
    return results;
}

class Combinations {
    static cache = {}

    static combinations(count, value) {
         if (!this.initilized) {
             this.compute();
             this.initilized = true;
         }

         if (count in this.cache) {
             var options = this.cache[count];
             if (value in options) {
                return this.cache[count][value];
             }
         }
         return new Set();
         
    }

    static initilized = false;
    static compute() {    
        var elements = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for(var i = 1; i < 10; i++) {
            var values = {};
            this.cache[i] = values;
            var combins = combinations(i, elements);
            for(var c of combins) {
                var sum = c.reduce((a, b) => a + b, 0);

                if  (sum in values) {
                    var set = values[sum];
                    for(const v of c) {
                        set.add(v);
                    }
                } 
                else {
                    values[sum] = new Set(c);
                }                
            }    
        }
    }
}
