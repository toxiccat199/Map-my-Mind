let shiftDown = false
function setupText(Obj) {
    let isDblclick = false

    Obj.readOnly = true
    Obj.addEventListener("pointerdown", (event) => {		
		if (event.target.tagName === "TEXTAREA" || event.target.isContentEditable) {
            event.stopPropagation();
        }
		
        if (isDblclick == false) {

            if (window.props.selected != 0) {
                window.funcs.deselect()
            }

            if (window.props.selected != Obj.parentElement.dataset.nodeid) {
                window.funcs.select(Obj.parentElement);
            } else {
                window.props.selected = 0
            }

            isDblclick = true
            setTimeout(() => {
                isDblclick = false;
            }, 250);
            return
        }

        event.preventDefault()

        Obj.readOnly = false
        window.funcs.select(Obj.parentElement)
        // requestAnimationFrame(() => {Obj.focus()})
        setTimeout(() => {
            Obj.focus()
        }, 0);

        if (Obj.value === "") {
            // Obj.value = "\u200B"; // zero-width space
            Obj.selectionStart = Obj.selectionEnd = 1;
        } else {
            Obj.selectionStart = Obj.selectionEnd = Obj.value.length;
        }
    })
    Obj.addEventListener("focusout", () => {
        Obj.readOnly = true;
        window.getSelection().removeAllRanges()
    })
}

const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        mutation.addedNodes.forEach(node => {
            if (node.tagName == "TEXTAREA" || node.isContentEditable) {
                setTimeout(()=>setupText(node),0)
            }
            node.querySelectorAll("textarea, [contentEditable]").forEach((child)=> {
				setTimeout(()=>setupText(child),0)
			})
        });
    }
})
observer.observe(document.getElementById("mmViewport"), { childList: true, subtree: true });

document.getElementById("mmViewport").querySelectorAll("textarea").forEach(setupText)
//document.getElementById("selectionArea").addEventListener("pointerdown",()=>{window.funcs.deselect(); window.props.selected = 0; setTimeout(()=>document.activeElement?.blur(),100)})