const button = document.querySelector(".puzzle__button");
const preview = document.querySelector(".puzzle__preview");
const result = document.querySelector(".puzzle__result");

let text;

function readFile(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
        text = reader.result;
        render(getArray(text), preview, "Кількість елементів:");
        button.classList.add("show");
    }
}

function getArray(string) {
    const array = string.split('\n');
    return array;
}

function render(array, htmlElement, string) {
    let text = array.join(' ')
    let element = document.createElement("p");
    element.insertAdjacentHTML("beforeend", text);
    htmlElement.append(element);
    element = document.createElement("p");
    element.insertAdjacentHTML("beforeend", `<p>${string} ${array.length}</p>`);
    htmlElement.append(element);
}

function renderResult() {
    const arr = getArray(text);
    render(arr, result, "Задіяно елементів:")
}

button.addEventListener("click", renderResult)