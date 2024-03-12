var levels = [
    {
        "not_a": "I'm not a robot",
        "instructions": "Select all squares with",
        "lookfor": "bicycles",
        "path": "imgs/bike.jpg"
    },
    {
        "not_a": "I'm not a robot",
        "instructions": "Select all squares with",
        "lookfor": "buses",
        "path": "imgs/bus.jpg"
    },
    {
        "not_a": "I'm not a dog",
        "instructions": "Select all squares with",
        "lookfor": "a red ball",
        "path": "imgs/ball.jpg"
    },
    {
        "not_a": "I'm not a cat",
        "instructions": "Select all squares that",
        "lookfor": "don't call your attention",
        "path": "imgs/laser.jpg"
    },
];

var current_level = 0;
var checkmark_clicked = false;

// Animated elements
var checkbox;
var checkbox_transition;
var spinner;
var checkmark;

// Animation metadata
var checkbox_transition_frame;
var spinner_start_time;
var checkmark_frame;

function on_load() {

    var checkbox_anchor = document.getElementById("recaptcha-anchor");

    checkbox_anchor.addEventListener("mouseenter", function () {
        checkbox_anchor.classList.add("recaptcha-checkbox-hover");
    });
    checkbox_anchor.addEventListener("mouseleave", function () {
        checkbox_anchor.classList.remove("recaptcha-checkbox-hover");
    });

    // Animated elements
    checkbox = document.getElementById('recaptcha-checkbox-border');
    checkbox_transition = document.getElementById('recaptcha-checkbox-borderAnimation');
    spinner = document.getElementById('recaptcha-checkbox-spinner');
    checkmark = document.getElementById('recaptcha-checkbox-checkmark');

    launch_level();
}

function launch_level() {
    document.getElementById('recaptcha-anchor-label').innerText = levels[current_level].not_a;

    if (current_level > 0) {
        checkmark_frame = 0;
        requestAnimationFrame(checkmark_animation_in_and_out);
    }
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
        spinner.style = "display: block; animation-play-state: paused; opacity: 0; transform: scale(1);"

        // TODO spawn image select
        current_level++;
        launch_level();
    }
}


function checkmark_animation_in_and_out(timestamp) {
    checkmark.style = "background-position: 0px " + (Math.floor(checkmark_frame) * -30) + "px;"

    checkmark_frame += 0.5;

    if (checkmark_frame < 42) {
        requestAnimationFrame(checkmark_animation_in_and_out);
    }
    else {
        checkmark_clicked = false;

        requestAnimationFrame(border_animation_in);
    }
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