//Websudoku: Medium Puzzle : https://www.websudoku.com/?level=2&set_id=7442827611
const p7442827611 = [,,7,5,,,6,,3,,,,6,,7,9,,,,6,,,2,3,,4,,2,8,,,,,,,,
    1,,,,7,,,,5,,,,,,,,6,8,,7,,1,8,,,9,,,,9,7,,4,,,,4,,2,,,6,7,,]
const p7442827611_solution = [9,2,7,5,4,8,6,1,3,3,4,8,6,1,7,9,5,2,5,6,1,9,2,3,8,4,7,2,8,5,4,6,1,3,7,9,
    1,3,6,8,7,9,4,2,5,7,9,4,2,3,5,1,6,8,6,7,3,1,8,2,5,9,4,8,1,9,7,5,4,2,3,6,4,5,2,3,9,6,7,8,1]

//Websudoku: Medium Puzzle : https://www.websudoku.com/?level=2&set_id=2670900998
const p2670900998 = [5,2,,,9,,,3,,9,,,,1,,,2,4,,,,,,7,9,,,7,,
    9,4,2,,,,,,8,,,,,,5,,,,,,8,6,4,,7,,,4,7,,,,,,6,5,,,3,,,,1,,3,,,4,,,7,9]
const p2670900998_solution = [5,2,1,8,9,4,7,3,6,9,7,6,5,1,3,8,2,4,3,4,8,2,6,7,9,1,5,7,6,
    9,4,2,5,1,8,3,4,8,3,1,7,9,6,5,2,2,1,5,3,8,6,4,9,7,1,9,4,7,5,2,3,6,8,6,5,7,9,3,8,2,4,1,8,3,2,6,4,1,5,7,9]

const fillOpenCells = (puzzle) => {
    for(let i = 0; i < 81; i++) {
        if(!puzzle[i])
            puzzle[i] = [1,2,3,4,5,6,7,8,9]
    }
}

const checkSolved = (puzzle) => {
    for(let i = 0; i < puzzle.length; i++)
        if(typeof puzzle[i] === 'object')
            return false
    return true
}

const checkCandidates = (markup, index) => {
    checkRow(markup, index)
    checkCol(markup, index)
    checkGrid(markup, index)
    checkSingleCandidate(markup, index)
}

const checkCol = (markup, index) => {
    if(typeof markup[index] === 'number')
        return
    let start = index % 9
    for(let c = start; c < 81; c += 9) {
        if(typeof markup[c] ==='number') {
            if(markup[c] == index)
                continue
            let value = markup[c]
            let valueIndex = markup[index].indexOf(value)
            if(valueIndex > -1)
                markup[index].splice(valueIndex, 1)
        }
    }
}

const checkRow = (markup, index) => {
    if(typeof markup[index] === 'number')
        return
    let start = index - (index % 9)
    for(let r = start; r < start+9; r += 1) {
        if(typeof markup[r] ==='number') {
            if(r === Math.floor(index / 9))
                continue
            let value = markup[r]
            let valueIndex = markup[index].indexOf(value)
            if(valueIndex > -1)
                markup[index].splice(valueIndex, 1)
        }
    }
}

const checkGrid = (markup, index) => {
    if(typeof markup[index] === 'number')
        return

    let row = Math.floor(index / 9)
    let col = index % 9
    let startRow = row - (row % 3)
    let startCol = col - (col % 3)

    for(let r = startRow; r < startRow + 3; r++) {
        for(let c = startCol; c < startCol + 3; c++) {
            let tempIndex = (9*r) + c
            if(tempIndex === index)
                continue
            if(typeof markup[tempIndex] === 'number') {
                let value = markup[tempIndex]
                let valueIndex = markup[index].indexOf(value)
                if(valueIndex > -1)
                    markup[index].splice(valueIndex, 1)
            }
        }
    }
}

const checkSingleCandidate = (markup, index) => {
    if(typeof markup[index] === 'object' && markup[index].length === 1) {
        let found = markup[index][0]
        markup[index] = found
        removeNumberFromCandidates(markup, index, found)
    }
}

const checkSingleLocationInGrid = (markup) => {
    let freq;
    for(let r = 0; r < 9; r += 3) {
        for(let c = 0; c < 9; c += 3) {
            freq = new Map();
            for(let ir = 0; ir < 3; ir += 1) {
                for(let ic = 0; ic < 3; ic += 1) {
                    let arrayIndex = ((ir+r)*9) + (ic+c)
                    if(typeof markup[arrayIndex] === 'object') {
                        for(let cand of markup[arrayIndex]) {
                            if(freq.has(cand))
                                freq.set(cand, [...freq.get(cand), arrayIndex])
                            else
                                freq.set(cand, [arrayIndex])
                        }
                    }
                }
            }
            for(let cands of freq.keys()) {
                if(freq.get(cands).length === 1) {
                    markup[freq.get(cands)[0]] = cands
                }
            }
        }
    }
}

const removeNumberFromCandidates = (markup, index, value) => {
    let row = Math.floor(index / 9)
    let col = index % 9
    let startRow = row - (row % 3)
    let startCol = col - (col % 3)
    
    for(let r = startRow; r < startRow + 3; r++) {
        for(let c = startCol; c < startCol + 3; c++) {
            let tempIndex = (9*r) + c
            if(tempIndex === index)
                continue
            if(typeof markup[tempIndex] === 'object') {
                let valueIndex = markup[tempIndex].indexOf(value)
                if(valueIndex > -1)
                    markup[tempIndex].splice(valueIndex, 1)
            }
        }
    }
}

const isSolutionCorrect = (markup, solution) => {
    if(markup.length !== solution.length) {
        console.log(`${markup.length} -> ${solution.length}`)
        console.error('Markup and solution array aren\'t equal in length')
        return
    }

    for(let i = 0; i < solution.length; i++) {
        if(markup[i] !== solution[i]) {
            console.error(`Solution is incorrect: Cell ${i} should be a ${solution[i]}, not a ${markup[i]}`)
            return
        }
    }

    console.log('Solution is correct')
}

const solve = (puzzle) => {
    let puzzleMarkup = [...puzzle]
    fillOpenCells(puzzleMarkup)

    let iterations = 0;
    while(!checkSolved(puzzleMarkup) && iterations < 15 ) {
        for(let cell = 0; cell < 81; cell++)
            checkCandidates(puzzleMarkup, cell)
        checkSingleLocationInGrid(puzzleMarkup)
        iterations += 1
    }
    console.log(`# Iterations: ${iterations}`)
    return puzzleMarkup
}

let test = solve(p7442827611)
isSolutionCorrect(test, p7442827611_solution)

let test2 = solve(p2670900998)
isSolutionCorrect(test2, p2670900998_solution)