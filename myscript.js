const levels = [
    {
        not_a: "a robot",
        instructions: "Select all squares with",
        lookfor: "traffic lights",
        path: "imgs/traffic_light.jpg",
        mode: "MATCH",
        error: "Please select all the matching images",
        solution: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 0]]
    },
    {
        not_a: "a robot",
        instructions: "Select all squares with",
        lookfor: "bicycles",
        path: "imgs/bike.jpg",
        mode: "MATCH",
        error: "Please select all the matching images",
        solution: [[0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]]
    },
    {
        not_a: "a dog",
        instructions: "Select all squares with",
        lookfor: "a red ball",
        path: "imgs/ball.jpg",
        mode: "MATCH",
        error: "Please select all the matching images",
        solution: [[0, 0, 0, 0], [0, 0, 1, 1], [0, 0, 2, 2], [0, 0, 0, 0]]
    },
    {
        not_a: "a cat",
        instructions: "Select all squares with",
        lookfor: "prey",
        path: "imgs/laser.jpg",
        mode: "MATCH",
        error: "Please select all the matching images",
        solution: [[2, 2, 0, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]]
    },
    {
        not_a: "guilty of murder",
        instructions: "Select the square with",
        lookfor: "your alibi",
        path: "imgs/alibi.jpg",
        mode: "SELECT ONE",
        error: "Please select one",
    },
    {
        not_a: "an infectious disease",
        instructions: "Select all squares with",
        lookfor: "friends",
        path: "imgs/white_blood_cell.jpg",
        mode: "MATCH",
        error: "Please select all the matching images",
        solution: [[2, 2, 2, 2], [1, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]]
    },
    {
        not_a: "the one who killed her",
        instructions: "",
        lookfor: "Then who did it?",
        path: "imgs/jimmy.jpg",
        mode: "SELECT SOME",
        error: "Who did it?",
    },
    {
        not_a: "an artificial intelligence",
        instructions: "Select all squares with",
        lookfor: "blueberry muffins",
        path: "imgs/chihuahua_muffin.jpg",
        mode: "MATCH",
        error: "Please select all the matching images",
        solution: [[0, 0, 1, 0], [0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]]
    },
    {
        not_a: "going to jail, am I?",
        instructions: "Select all squares containing",
        lookfor: "Jimmy's girlfriend",
        path: "imgs/dumpster.jpg",
        mode: "MATCH",
        error: "You know where she is",
        solution: [[0, 0, 0, 0], [0, 0, 2, 2], [0, 0, 1, 1], [0, 0, 1, 1]]
    },
    {
        not_a: "a robot",
        instructions: "Select all squares with",
        lookfor: "crosswalks",
        path: "imgs/crosswalk.jpg",
        mode: "MATCH",
        error: "Please select all the matching images",
        solution: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1]]
    },
];

var current_level = 0
var selected = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var checkmark_clicked = false;
var n_selected = 0;

// Animated elements
var checkbox;
var checkbox_transition;
var spinner;
var checkmark;
var image_select;
var not_a_box;
var next_button;

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
    next_button = document.getElementById('recaptcha-verify-button');

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
        launch_image_select();
        launch_checkbox();
    }
    else {

    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function launch_checkbox() {

    // TODO ANIMATE TEXT CHANGE + BOX SIZE CHANGE
    if (current_level == 0) {
        not_a_box.innerText = levels[current_level].not_a;
    } else {
        // If level has the same prompt as the previous one, jump to image select
        if (levels[current_level].not_a == not_a_box.innerText) {
            await sleep(1000);
            image_select.style = "visibility: visible; opacity: 1";
        }
        else {
            launch_checkmark_animation_in_and_wait()
        }
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
    n_selected = 0;
    next_button.innerText = "SKIP";

    // Reset error messages
    document.querySelector(".rc-imageselect-error-select-more").setAttribute("style", "display: none;");

    // LOAD

    // Load prompt for this level
    document.getElementById("look-for").innerText = levels[current_level].lookfor;
    document.getElementById("instructions").innerText = levels[current_level].instructions;

    // Load image for this level
    document.querySelectorAll('.tile_image').forEach(function (element) {
        element.setAttribute("src", levels[current_level].path)
    });
}

function click_on_tile() {

    var row = this.parentElement.getAttribute("row");
    var col = this.getAttribute("col");

    selected[row][col] = 1 - selected[row][col];

    if (selected[row][col] == 1) {
        n_selected++;
        next_button.innerText = "NEXT";
    } else {
        n_selected--;
        if (n_selected == 0) {
            next_button.innerText = "SKIP";
        }
    }

    this.classList.toggle("rc-imageselect-tileselected");

}

function next_level() {
    image_select.style = "visibility: hidden; opacity: 0; transition: none";

    current_level++;

    launch_level();
}

function error() {
    document.getElementById("rc-imageselect-error-select-more").innerText = levels[current_level].error;
    document.getElementById("rc-imageselect-error-select-more").setAttribute("style", "display: unset;");
}

/** NEXT button behaviour */
function next() {
    if (levels[current_level].mode == "SELECT ONE") {
        if (n_selected == 1) {
            next_level();
        }
        else {
            error();
        }

    }
    else if (levels[current_level].mode == "MATCH") {
        if (matrix_equals(selected, levels[current_level].solution)) {
            next_level();
        }
        else {
            error();
        }

    }
    else if (levels[current_level].mode == "SELECT SOME") {
        if (n_selected > 0) {
            next_level();
        }
        else {
            error();
        }
    }

}

function matrix_equals(selected, solution) {
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            if (solution[row][col] == 2) continue; // 2 means the actual value doesnt matter
            if (selected[row][col] != solution[row][col]) return false;
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
    // Stop spinner
    spinner.style = "display: block; animation-play-state: paused; opacity: 0; transform: scale(1);"
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