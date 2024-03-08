var current_level = 1
var selected = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

function click_on_tile() {

    var row = this.parentElement.getAttribute("row");
    var col = this.getAttribute("col");

    selected[row][col] = 1 - selected[row][col];

    if (this.classList.contains("rc-imageselect-tileselected")) {
        this.classList.remove("rc-imageselect-tileselected");
    }
    else {
        this.classList.add("rc-imageselect-tileselected");
    }

    console.log(selected);
}

function on_load() {
    document.querySelectorAll('.rc-imageselect-tile').forEach(function (element) {
        element.addEventListener('click', click_on_tile);
    });

    set_level(1);
}

function set_level(i) {
    // Reset selected (visual)
    document.querySelectorAll('.rc-imageselect-tile').forEach(function (element) {
        if (element.classList.contains("rc-imageselect-tileselected")) {
            element.classList.remove("rc-imageselect-tileselected");
        }
    });
    // Reset selected (logical)
    selected = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    // Reset error message
    document.querySelector(".rc-imageselect-error-select-more").setAttribute("style", "display: none;");

    // Load prompt for this level
    document.getElementById("look-for").innerText = look_for(i);

    // Load image for this level
    document.querySelectorAll('.rc-image-tile-44').forEach(function (element) {
        element.setAttribute("src", "imgs/level_" + i + ".jpg")
    });
}

function prove_you_are_not_a(i) {
    switch (i) {
        case 1: return "robot";
        case 2: return "robot";
        case 3: return "dog";
        case 4: return "cat";
        case 5: return "bee";
    }
}

function look_for(i) {
    switch (i) {
        case 1: return "cats";
        case 2: return "dogs";
    }
}

function solution(i) {
    switch (i) {
        case 1: return [[0, 1, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]];
        case 2: return [[0, 1, 1, 0], [0, 1, 1, 1], [0, 1, 1, 1], [0, 1, 1, 1]];
    }
}

function next() {
    if (matrix_equals(selected, solution(current_level))) {

        set_level(++current_level);
    }
    else {
        document.querySelector(".rc-imageselect-error-select-more").setAttribute("style", "display: unset;");
    }
}

function matrix_equals(A, B) {
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            if (A[row][col] != B[row][col]) return false;
        }
    }
    return true;
}