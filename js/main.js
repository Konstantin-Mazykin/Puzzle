const button = document.querySelector(".puzzle__button");
const buttonLabel = document.querySelector(".button-label");
const preview = document.querySelector(".puzzle__preview");
const result = document.querySelector(".puzzle__result");
const finishedPuzzle = document.querySelector(".puzzle__finished");

button.addEventListener("click", outputResult)

let text;

function readFile(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
        text = reader.result;
        render(getArray(text), preview, "Завантажено з файла", "елементів:");
        button.classList.add("show");
        buttonLabel.classList.add("show");
    }
}

function outputResult() {
    const arr = getArray(text);
    const necessaryElements = findAndDeleteUnnecessaryElements(arr);
    const firstElements = findFirstElements(necessaryElements);
    const arrayWithoutFirstElements = deleteElements(necessaryElements, firstElements);
    const duplicateElements = findDuplicateElements(arrayWithoutFirstElements);
    const elementsForPuzzle = deleteElements(arrayWithoutFirstElements, duplicateElements);
    const puzzleArray = gettingLongestSequence(firstElements, duplicateElements, elementsForPuzzle);
    render(puzzleArray, result, "Найдовша послідовність складається з", "елементів:")
    let puzzle = putTogetherPuzzle(puzzleArray);
    renderResult(puzzle, finishedPuzzle, "Складений пазл складаєтся з")
}

function getArray(string) {
    const array = string.split('\n');
    return array;
}

function render(array, htmlElement, string1, string2) {
    let text = array.join(' ')
    htmlElement.innerHTML = '';
    result.innerHTML = '';
    finishedPuzzle.innerHTML = '';
    let element = document.createElement("p");
    element.insertAdjacentHTML("beforeend", `${string1} ${array.length} ${string2}`);
    htmlElement.append(element);
    element = document.createElement("p");
    element.insertAdjacentHTML("beforeend", text);
    htmlElement.append(element);
}

function renderResult(result, htmlElement, string) {
    let element = document.createElement("p");
    element.insertAdjacentHTML("beforeend", `${string} ${result.length} символів`);
    htmlElement.append(element);
    element = document.createElement("p");
    element.classList.add("puzzle__finishe-result");
    element.insertAdjacentHTML("beforeend", `${result}`);
    htmlElement.append(element);
}

function findAndDeleteUnnecessaryElements(array) {
    const arrayWantedElements = array.slice();
    for (let element of arrayWantedElements) {
        if (checkCondition1(element, arrayWantedElements) && checkCondition2(element, arrayWantedElements)) {
            arrayWantedElements.splice(arrayWantedElements.indexOf(element), 1)
        }
    }
    return arrayWantedElements;
}

function findFirstElements(array) {
    const arrayFirstElements = [];
    for (let element of array) {
        if (checkCondition1(element, array) && !checkCondition2(element, array)) {
            arrayFirstElements.push(element);
        }
    }
    return arrayFirstElements;
}

function findDuplicateElements(array) {
    const arrayDuplicateElements = [];
    for (let element of array) {
        if (!checkCondition3(element, array)) {
            arrayDuplicateElements.push(element);
        }
    }
    return arrayDuplicateElements;
}

function deleteElements(array, arrayOfElementsToRemove) {
    const pureArray = array.slice();
    arrayOfElementsToRemove.forEach(element => {
        pureArray.splice(pureArray.indexOf(element), 1)
    });
    return pureArray;
}

function checkCondition1(element, array) {
    const firstTwo = element.slice(0, 2);
    for (const otherElement of array) {
        if (element !== otherElement && firstTwo === otherElement.slice(-2)) {
            return false;
        }
    }
    return true;
}

function checkCondition2(element, array) {
    const lastTwo = element.slice(-2);
    for (const otherElement of array) {
        if (element !== otherElement && lastTwo === otherElement.slice(0, 2)) {
            return false;
        }
    }
    return true;
}

function checkCondition3(element, array) {
    const firstTwo = element.slice(0, 2);
    for (const otherElement of array) {
        if (element !== otherElement && firstTwo === otherElement.slice(0, 2)) {
            return false;
        }
    }
    return true;
}

function fillingArrayFromDuplicatesArray(arr, duplicates) {
    for (elem of arr) {
        let lastTwo = elem[elem.length - 1].slice(-2);
        for (key in duplicates) {
            if (!elem.includes(duplicates[key]) && duplicates[key].slice(0, 2) === lastTwo) {
                const newElem = Array.from(elem);
                newElem.push(duplicates[key]);
                arr.push(newElem);
            }
        }
    }
}

function fillingArrayFromUnsortedArray(arr, unsorted) {
    for (elem of arr) {
        unsorted.forEach((el) => {
            let lastTwo = elem[elem.length - 1].slice(-2);
            if (!elem.includes(el) && lastTwo === el.slice(0, 2)) {
                elem.push(el);
            }
        });
    }
}

function findLongestElementsInArray(arr) {
    const longest = Array.from(arr);
    let indexLongestElement = 0;
    for (index in longest) {
        if (longest[index].length > longest[indexLongestElement].length) {
            indexLongestElement = index;
        }
    }
    return longest[indexLongestElement];
}

function arrayLengthOptimization(arr) {
    const arrStrings = new Array();
    let maxLengthElement = 0;
    arr.forEach(el => {
        let string = el.join(" ");
        if (string.length > maxLengthElement) {
            maxLengthElement = string.length;
        }
        arrStrings.push(string)
    });

    const newSet = new Set(arrStrings);
    const arrUniqueStrings = Array.from(newSet);

    arr.splice(0, arr.length);
    arrUniqueStrings.forEach(el => {
        if (el.length > (maxLengthElement * 0.75)) {
            arr.push(el.split(" "));
        }
    });
}

function findingAllVariantsArrays(arr, double, unsorted) {
    let variants = true;
    let lengtlongestArray = 0;
    while (variants) {

        fillingArrayFromUnsortedArray(arr, unsorted);
        fillingArrayFromDuplicatesArray(arr, double);
        arrayLengthOptimization(arr);

        const lengtArray = findLongestElementsInArray(arr).length;
        if (lengtArray > lengtlongestArray) {
            lengtlongestArray = lengtArray;
        } else { variants = false; }
    }
}

function gettingLongestSequence(arr, double, unsorted) {
    const longestArrays = new Array();

    for (elem of arr) {
        const newArray = new Array();
        newArray.push(new Array(elem));

        findingAllVariantsArrays(newArray, double, unsorted);
        longestArrays.push(findLongestElementsInArray(newArray));
        newArray.splice(0, newArray.length);
    }
    const longestArray = findLongestElementsInArray(longestArrays);
    return longestArray;
}

function putTogetherPuzzle(arr) {
    for (let i = 1; i < arr.length; i++) {
        arr[i] = arr[i].substring(2)
    }
    return arr.join('');
}