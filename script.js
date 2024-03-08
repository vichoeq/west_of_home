function click_on_tile() {
    if (this.classList.contains("rc-imageselect-tileselected")) {
        this.classList.remove("rc-imageselect-tileselected");
    }
    else {
        this.classList.add("rc-imageselect-tileselected");
    }
}

function on_load() {
    document.querySelectorAll('.rc-imageselect-tile').forEach(function (element) {
        element.addEventListener('click', click_on_tile);
    });
}