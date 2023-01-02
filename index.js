"use strict";

// Minimum resizable area
var minWidth = 60;
var minHeight = 40;

// Thresholds
var MARGINS = 4;

// End of what's configurable.
var clicked = null;
var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

var rightScreenEdge, bottomScreenEdge;


var b, x, y;

var redraw = false;

var pane = document.getElementById('pane');


// Mouse events
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMove);
document.addEventListener('mouseup', onUp);


function onMouseDown(e) {
    onDown(e);
    e.preventDefault();
}

function onDown(e) {
    calc(e);
    // if (e.target.className)
    var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;
    console.log('Before==',clicked)

    clicked = {
        x: x,
        y: y,
        cx: e.clientX,
        cy: e.clientY,
        w: b.width,
        h: b.height,
        isResizing: isResizing,
        isMoving: !isResizing /* && canMove() */,
        onTopEdge: onTopEdge,
        onLeftEdge: onLeftEdge,
        onRightEdge: onRightEdge,
        onBottomEdge: onBottomEdge
    };
    console.log(clicked)
}

function canMove() {
    return x > 0 && x < b.width && y > 0 && y < b.height
        && y < 30;
}

function calc(e) {
    b = pane.getBoundingClientRect();
    x = e.clientX - b.left;
    y = e.clientY - b.top;

    onTopEdge = y < MARGINS;
    onLeftEdge = x < MARGINS;
    onRightEdge = x >= b.width - MARGINS;
    onBottomEdge = y >= b.height - MARGINS;

    rightScreenEdge = window.innerWidth - MARGINS;
    bottomScreenEdge = window.innerHeight - MARGINS;
}

var e;

function onMove(ee) {
    calc(ee);

    console.log(ee)
    e = ee;

    redraw = true;

}

function animate() {

    requestAnimationFrame(animate);

    if (!redraw) return;

    redraw = false;

    if (clicked && clicked.isResizing) {

        if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + 'px';
        if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + 'px';

        if (clicked.onLeftEdge) {
            var currentWidth = Math.max(clicked.cx - e.clientX + clicked.w, minWidth);
            if (currentWidth > minWidth) {
                pane.style.width = currentWidth + 'px';
                pane.style.left = e.clientX + 'px';
            }
        }

        if (clicked.onTopEdge) {
            var currentHeight = Math.max(clicked.cy - e.clientY + clicked.h, minHeight);
            if (currentHeight > minHeight) {
                pane.style.height = currentHeight + 'px';
                pane.style.top = e.clientY + 'px';
            }
        }

        // hintHide();

        return;
    }

    if (clicked && clicked.isMoving) {

        // moving
        pane.style.top = (e.clientY - clicked.y + document.body.scrollTop) + 'px';
        pane.style.left = (e.clientX - clicked.x + document.body.scrollLeft) + 'px';

        return;
    }

    // This code executes when mouse moves without clicking

    // style cursor
    if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
        pane.style.cursor = 'nwse-resize';
    } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
        pane.style.cursor = 'nesw-resize';
    } else if (onRightEdge || onLeftEdge) {
        pane.style.cursor = 'ew-resize';
    } else if (onBottomEdge || onTopEdge) {
        pane.style.cursor = 'ns-resize';
    } /* else if (canMove()) {
        pane.style.cursor = 'move';
    } */ else {
        pane.style.cursor = 'move';
    }
}

animate();

function onUp(e) {
    calc(e);
    clicked = null;

}
