// Variables
const viewport = document.getElementById("mmViewport");

var startPosX = 50-7.5
var startPosY = 50+1.5


const selection = document.getElementById("selectionArea")

if (!viewport.style.left) viewport.style.left = startPosX + "%";
if (!viewport.style.top) viewport.style.top = startPosY + "%";

// Mouse Panning
function setupMoveable(obj,mover,condition) {
    var startX, startY, startLeft, startRight = 0;

    let mouseDown = false;

    function onHold(event) {
        if (condition(event) === false) {
            return
        }

        mouseDown = true;
        startX = event.clientX;
        startY = event.clientY;

		obj.setPointerCapture(event.pointerId)
		mover.setPointerCapture(event.pointerId)
		
        startLeft = stringToNumber(obj.style.left);
        startTop = stringToNumber(obj.style.top);
    }
    function onRelease(event) {
        mouseDown = false;
		if (obj.hasPointerCapture(event.pointerId)) {
            obj.releasePointerCapture(event.pointerId);
        }
		if (mover.hasPointerCapture(event.pointerId)) {
			mover.releasePointerCapture(event.pointerId)
		}
        // document.body.setPointerCapture(event.pointerId);
    }
    function onMove(event) {
        if (!mouseDown) {
            return;
        }

        const dragX = event.clientX - startX;
        const dragY = event.clientY - startY;

        if (obj.classList.contains("obj") && Math.max(dragX,dragY) > 2) {
            window.funcs.select(obj)
			event.preventDefault();
        }


        obj.style.left = (startLeft + pixelsToPerX(dragX,obj.parentElement)) + "%";
        obj.style.top = (startTop + pixelsToPerY(dragY,obj.parentElement)) + "%";
    }
    mover.addEventListener("pointerdown",onHold,{ passive: false, capture: true})
	for (const child of mover.children) {
		child.addEventListener("pointerdown",onHold,{ passive: false, capture: true})
	}
    window.addEventListener("pointerup",onRelease)
    mover.addEventListener("lostpointercapture",onRelease)
	mover.addEventListener("pointercancel",onRelease)
    window.addEventListener("pointermove",onMove,{ passive: false })
}
setupMoveable(viewport,selection,(event) => {return (inViewport(event))})

const observer2 = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        mutation.addedNodes.forEach(node => {
            if (node.dataset.nodeid) {
                setupMoveable(node,node,(event)=>{return (inViewport(event))})
            }
        });
    }
})
observer2.observe(document.getElementById("mmViewport"), { childList: true, subtree: true });

function inViewport(event) {
    if (event.clientX / window.innerWidth > 77.5 / 100) {
        return false;
    }
    if (event.clientY / window.innerHeight < 7 / 100) {
        return false;
    }
    return true;
}

function stringToNumber(string) {
    return Number(string.slice(0, -1))
}

function pixelsToPerY(pixels,parent) {
    return (pixels / parent.clientHeight) * 100
}
function pixelsToPerX(pixels,parent) {
    return (pixels / parent.clientWidth) * 100
}

// Arrow key (+ shift to speed up)
// Variables
var upPressed = false;
var leftPressed = false;
var rightPressed = false;
var downPressed = false;
var shiftPressed = false;

function keyDown(event) {
    switch (event.key) {
        case "ArrowUp":
            upPressed = true;
            break
        case "ArrowLeft":
            leftPressed = true;
            break
        case "ArrowDown":
            downPressed = true;
            break
        case "ArrowRight":
            rightPressed = true;
            break
        case "Shift":
            shiftPressed = true;
            break
    }
}
function keyUp(event) {
    switch (event.key) {
        case "ArrowUp":
            upPressed = false;
            break
        case "ArrowLeft":
            leftPressed = false;
            break
        case "ArrowDown":
            downPressed = false;
            break
        case "ArrowRight":
            rightPressed = false;
            break
        case "Shift":
            shiftPressed = false;
            break
    }
}
let lastTime = 0
function updateArrowkeys(time) {
    if ((document.activeElement?.tagName == "TEXTAREA" && !document.activeElement?.readOnly)) {
        requestAnimationFrame(updateArrowkeys);
        return
    }
    let directionX = 0;
    let directionY = 0;

    delta = (time - lastTime) / 1000;
    lastTime = time;
    const speed = shiftPressed ? 800 : 600;

    if (upPressed) directionY += 1;
    if (leftPressed) directionX += 1;
    if (downPressed) directionY -= 1;
    if (rightPressed) directionX -= 1;

    if (directionX !== 0 || directionY !== 0) {
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        directionX /= length;
        directionY /= length;
    }

    viewport.style.left = pixelsToPerX(directionX * speed * delta, document.body) + stringToNumber(viewport.style.left) + "%";
    viewport.style.top = pixelsToPerY(directionY * speed * delta, document.body) + stringToNumber(viewport.style.top) + "%";
    requestAnimationFrame(updateArrowkeys);
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
requestAnimationFrame(updateArrowkeys);

