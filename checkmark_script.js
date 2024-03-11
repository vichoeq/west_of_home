var checkmark_clicked;

// Animated elements
var checkbox_transition;
var spinner;
var checkmark;

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
    checkbox_transition = document.getElementById('recaptcha-checkbox-borderAnimation');
    spinner = document.getElementById('recaptcha-checkbox-spinner');
    checkmark = document.getElementById('recaptcha-checkbox-checkmark');
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

        checkmark_frame = 0;
        requestAnimationFrame(checkmark_animation_in);
    }
}


function checkmark_animation_in(timestamp) {
    checkmark.style = "background-position: 0px " + (Math.floor(checkmark_frame) * -30) + "px;"

    checkmark_frame += 0.5;

    if (checkmark_frame < 21) {
        requestAnimationFrame(checkmark_animation_in);
    }
    else {
        // TODO Spawn image select
    }
}

function checkbox_click() {
    if (checkmark_clicked) return;

    checkmark_clicked = true;

    document.getElementById('recaptcha-checkbox-border').setAttribute('style', 'display: none;');

    checkbox_transition_frame = 0;
    requestAnimationFrame(border_animation_out);

    requestAnimationFrame(spinner_animation);
}