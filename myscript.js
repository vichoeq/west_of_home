const levels = [
    {
        not_a: "robot",
        instructions: "Select all squares with",
        lookfor: "bicycles",
        path: "imgs/bike.jpg",
        solution: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    },
    {
        not_a: "robot",
        instructions: "Select all squares with",
        lookfor: "buses",
        path: "imgs/bus.jpg",
        solution: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    },
    {
        not_a: "dog",
        instructions: "Select all squares with",
        lookfor: "a red ball",
        path: "imgs/ball.jpg",
        solution: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    },
    {
        not_a: "cat",
        instructions: "Select all squares that",
        lookfor: "don't call your attention",
        path: "imgs/laser.jpg",
        solution: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    }
];

var current_level = 0
var selected = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var checkmark_clicked = false;

// Animated elements
var checkbox;
var checkbox_transition;
var spinner;
var checkmark;
var image_select;
var not_a_box;

// Animation metadata
var checkbox_transition_frame;
var spinner_start_time;
var checkmark_frame;



function on_load() {
    // Animated elements
    checkbox = document.getElementById('recaptcha-checkbox-border');
    checkbox_transition = document.getElementById('recaptcha-checkbox-borderAnimation');
    spinner = document.getElementById('recaptcha-checkbox-spinner');
    checkmark = document.getElementById('recaptcha-checkbox-checkmark');
    image_select = document.getElementById('image-select');
    not_a_box = document.getElementById('recaptcha-anchor-label');

    // CHECKBOX HOVER
    var checkbox_anchor = document.getElementById("recaptcha-anchor");
    checkbox_anchor.addEventListener("mouseenter", function () {
        checkbox_anchor.classList.add("recaptcha-checkbox-hover");
    });
    checkbox_anchor.addEventListener("mouseleave", function () {
        checkbox_anchor.classList.remove("recaptcha-checkbox-hover");
    });

    // IMAGE SELECT
    document.querySelectorAll('.rc-imageselect-tile').forEach(function (element) {
        element.addEventListener('click', click_on_tile);
    });

    not_a_box.addEventListener("transitionend", not_a_box_transition_end);

    launch_level();
}

function launch_level() {
    if (current_level < levels.length) {
        launch_checkbox();
        launch_image_select();
    }
    else {

    }
}

function launch_checkbox() {

    // TODO ANIMATE TEXT CHANGE + BOX SIZE CHANGE
    if (current_level == 0) {
        not_a_box.innerText = levels[current_level].not_a;
    } else {
        // checkmark_frame = 0;
        // requestAnimationFrame(checkmark_animation_in_and_out);
        launch_checkmark_animation_in_and_wait()
    }
}

function launch_image_select() {
    // RESET
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

    // LOAD

    // Load prompt for this level
    document.getElementById("look-for").innerText = levels[current_level].lookfor;

    // Load image for this level
    document.querySelectorAll('.tile_image').forEach(function (element) {
        element.setAttribute("src", levels[current_level].path)
    });
}

function click_on_tile() {

    var row = this.parentElement.getAttribute("row");
    var col = this.getAttribute("col");

    selected[row][col] = 1 - selected[row][col];

    this.classList.toggle("rc-imageselect-tileselected");

    console.log(selected);
}

/** NEXT button behaviour */
function next() {
    if (matrix_equals(selected, levels[current_level].solution)) {

        // Stop spinner
        spinner.style = "display: block; animation-play-state: paused; opacity: 0; transform: scale(1);"

        image_select.style = "visibility: hidden; opacity: 0; transition: none";

        current_level++;

        launch_level();
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


function checkbox_click() {
    if (checkmark_clicked) return;

    checkmark_clicked = true;

    document.getElementById('recaptcha-checkbox-border').setAttribute('style', 'display: none;');

    checkbox_transition_frame = 0;
    requestAnimationFrame(border_animation_out);

    spinner_start_time = undefined;
    requestAnimationFrame(spinner_animation);
}

function border_animation_out(timestamp) {
    checkbox_transition.style = "background-position: -28px " + (-560 + checkbox_transition_frame * 28) + "px;"

    checkbox_transition_frame++;

    if (checkbox_transition_frame < 20) {
        requestAnimationFrame(border_animation_out);
    } else {
        checkbox_transition.style = "display: none";
    }
}

function border_animation_in(timestamp) {
    checkbox_transition.style = "background-position: -28px " + (-560 + checkbox_transition_frame * 28) + "px;"

    checkbox_transition_frame--;

    if (checkbox_transition_frame > 0) {
        requestAnimationFrame(border_animation_in);
    } else {
        checkbox_transition.style = "display: none";
        checkbox.setAttribute('style', '');
        checkmark_clicked = false;
    }
}


function spinner_animation(timestamp) {
    if (spinner_start_time === undefined) {
        spinner_start_time = timestamp;
        spinner.style = "display: block; animation-play-state: running; opacity: 1; transform: scale(1);"
    }
    const elapsed = timestamp - spinner_start_time;

    if (elapsed < 1000) {
        requestAnimationFrame(spinner_animation);
    } else {
        image_select.style = "visibility: visible; opacity: 1";
    }
}

function checkmark_animation_in_and_wait(timestamp) {
    if (checkmark_frame < 21) {
        checkmark.style = "background-position: 0px " + (Math.floor(checkmark_frame) * -30) + "px;"
    }

    checkmark_frame += 0.5;

    if (checkmark_frame < 42) {
        requestAnimationFrame(checkmark_animation_in_and_wait);
    }
    else {
        launch_checkmark_animation_out();
        not_a_box.style.opacity = 0;
    }
}

function launch_checkmark_animation_in_and_wait() {
    checkmark_frame = 0;
    requestAnimationFrame(checkmark_animation_in_and_wait);
}

function checkmark_animation_out(timestamp) {
    checkmark.style = "background-position: 0px " + (Math.floor(checkmark_frame) * -30) + "px;"

    checkmark_frame += 0.5;

    if (checkmark_frame < 42) {
        requestAnimationFrame(checkmark_animation_out);
    }
}

function launch_checkmark_animation_out() {
    checkmark_frame = 21;
    requestAnimationFrame(checkmark_animation_out);
}

function not_a_box_transition_end() {
    if (not_a_box.style.opacity == 0) {
        not_a_box.innerText = levels[current_level].not_a;
        not_a_box.style.opacity = 1;
        requestAnimationFrame(border_animation_in);
    }
    else {
    }
}