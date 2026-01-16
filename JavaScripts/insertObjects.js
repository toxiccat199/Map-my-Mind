function createObject(originalObject, isSibling) {
    console.log("Created!");
    const viewport = document.getElementById("mmViewport");

    const newObject = originalObject.cloneNode(true);
    viewport.appendChild(newObject);

    newObject.id = "";

    // newObject.style.left = ((stringToNumber(viewport.style.left) - 42.5) / -1) * window.innerWidth/viewport.clientWidth + "%";
    // newObject.style.top = ((stringToNumber(viewport.style.top) - 52) / -1) * window.innerHeight/viewport.clientHeight + "%";
    newObject.style.transform = "translate(-50%, -50%)";

    let id = 1
    while (true) {
        if (window.funcs.getObj(id)) {
            id += 1
        } else {
            break
        }
    }

    newObject.dataset.nodeid = id + ""

    newObject.dataset.parent = (!isSibling ? window.props.selected : window.funcs.getSelected()?.dataset.parent) ?? 1
    if (newObject.dataset.parent == "0") newObject.dataset.parent = "1"

    let parent = window.funcs.getObj(newObject.dataset.parent)

    if (parent.dataset.children?.length !== 0) {
        parent.dataset.children += ","
    }
    parent.dataset.children += id + ""
    newObject.dataset.children = ""

    newObject.style.left = ((stringToNumber(viewport.style.left) - 42.5) / -1) * window.innerWidth/viewport.clientWidth + "%";
    newObject.style.top = ((stringToNumber(viewport.style.top) - 52) / -1) * window.innerHeight/viewport.clientHeight + "%";

    window.funcs.deselect()
    window.funcs.select(newObject)

    const lineid = createLine(parent, newObject)
    newObject.dataset.line = lineid

    return newObject
}

function createNode(isSibling) {
    const node = createObject(document.getElementById("node"), isSibling)
    focus(node.getElementsByClassName("nodeText")[0])
    if (window.props.tcMode) {
        node.dataset.prophbub = "false"
        window.funcs.getObj(node.dataset.parent).dataset.prophbub = "true"
    }

    // node.getElementsByClassName("bubble")[0].style.backgroundColour = `var(--layer${window.funcs.getNodeDepth(node.dataset.nodeid)-1})`
}

function createList(isSibling) {
    const list = createObject(document.getElementById("list"),isSibling)
    focus(list.getElementsByClassName("listContent")[0])
}

function createLine(pnode, cnode) {
    const line = document.getElementById("line").cloneNode()
    document.getElementById("mmViewport").appendChild(line)
    let id = 1
    while (true) {
        if (window.funcs.getLine(id)) {
            id += 1
        } else {
            break
        }
    }

    line.dataset.lineid = id + ""
    line.dataset.pnode = pnode.dataset.nodeid
    line.dataset.cnode = cnode.dataset.nodeid
    line.id = ""

    const pnodeBubble = pnode.getElementsByClassName("bubble")[0]
    const cnodeBubble = cnode.getElementsByClassName("bubble")[0]

    let lastppos = [0,0]
    let lastcpos = [0,0]

    function lineLoop() {
        if (line && pnode && cnode) {
            updateLine(pnode, cnode, pnodeBubble, cnodeBubble, line,lastppos,lastcpos)
            lastppos = [pnode.style.left,pnode.style.top]
            lastcpos = [cnode.style.left,cnode.style.top]
            requestAnimationFrame(lineLoop)
        }
    }

    requestAnimationFrame(lineLoop)

    return id
}

function updateLine(pnode, cnode, pnodeBubble, cnodeBubble, line, lastppos, lastcpos) {
    if (lastppos[0] == pnode.style.left && lastppos[1] == pnode.style.top && lastcpos[0] == cnode.style.left && lastcpos[1] == cnode.style.top) return
    console.log(cnode.dataset.nodeid)
    function getRect(element, container) {
        const elementRect = element.getBoundingClientRect()
        const containerRect = document.getElementById("mmViewport").getBoundingClientRect()

        return {
            left: elementRect.left - containerRect.left,
            top: elementRect.top - containerRect.top,
            width: elementRect.width,
            height: elementRect.height
        }
    }

    const rectA = getRect(pnodeBubble ?? pnode);
    const rectB = getRect(cnodeBubble ?? cnode);

    const centerAX = rectA.left + rectA.width / 2
    const centerAY = rectA.top + rectA.height / 2
    const centerBX = rectB.left + rectB.width / 2
    const centerBY = rectB.top + rectB.height / 2

    const dirX = centerBX - centerAX
    const dirY = centerBY - centerAY
    const opDirX = -dirX
    const opDirY = -dirY

    function getEllipseEdge(rect, dx, dy) {
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const rx = rect.width / 2
        const ry = rect.height / 2

        const length = Math.hypot(dx, dy)

        if (length === 0) return {
            x: centerX, y: centerY
        }

        const unitX = dx / length
        const unitY = dy / length

        const scale = 1 / Math.sqrt(
            (unitX * unitX) / (rx * rx) +
            (unitY * unitY) / (ry * ry)) - 1

        return {
            x: centerX + unitX * scale,
            y: centerY + unitY * scale
        }
    }

    const start = getEllipseEdge(rectA, dirX, dirY)
    const end = getEllipseEdge(rectB, opDirX, opDirY)

    const lineDistX = end.x - start.x
    const lineDistY = end.y - start.y

    const length = Math.hypot(lineDistX, lineDistY)
    const angle = Math.atan2(lineDistY, lineDistX) * 180 / Math.PI

    const viewportX = document.getElementById("mmViewport").clientWidth
    const viewportY = document.getElementById("mmViewport").clientHeight

    line.style.left = start.x * 100 / viewportX + "%"
    line.style.top = start.y * 100 / viewportY + "%"
    line.style.width = (length) * 100 / viewportX + "%"
    line.style.transform = `rotate(${angle}deg)`
}

function CreateDesc() {
    selected = window.funcs.getSelected()
    if (!selected?.classList?.contains("node")) return
    
    if (!selected.classList.contains("hasDesc")) {
        selected.classList.add("hasDesc")
        focus(selected.getElementsByClassName("description")[0])
		selected.getElementsByClassName("description")[0].value = "•"
    } else {
        selected.classList.remove("hasDesc")
    }
}

function CreateInfo() {
    selected = window.funcs.getSelected()
    if (!selected?.classList?.contains("node")) return

    if (!selected.classList.contains("hasInfo")) {
        selected.classList.add("hasInfo")
        focus(selected.getElementsByClassName("info")[0])
    } else {
        selected.classList.remove("hasInfo")
        selected.getElementsByClassName("info")[0].innerText = ""
    }
}

function focus(obj) {
    obj.readOnly = false
    setTimeout(() => {
        obj.focus()
    }, 100);
}

function deleteObj(obj) {
    const selected = obj ?? window.funcs.getSelected()

    if (!selected) return
    if (!selected.classList.contains("node") && !selected.classList.contains("list")) return

    const line = window.funcs.getLine(selected.dataset.line)
    const children = selected.dataset.children
    const parent = window.funcs.getObj(selected.dataset.parent)
    if (children) {
        for (const i in children.split(",")) {
            const child = children.split(",")[i]
            if (child != "") {
                deleteObj(window.funcs.getObj(child))
            }
        }
    }
    parent.dataset.children = parent.dataset.children.replace(selected.dataset.nodeid, "")

    line.remove()
    selected.remove()
    window.props.selected = 0
}

setTimeout(() => {
    document.getElementById("tbISnode").addEventListener("mousedown", () => { createNode(true) })
    document.getElementById("tbISlist").addEventListener("mousedown", () => { createList(true) })
    window.funcs.createKeybind(createNode, "X", true, false, false, "Create Node")
    window.funcs.createKeybind(createList, "X", false, false, true, "Create List")
    window.funcs.createKeybind(() => { createNode(true) }, "X", true, true, false, "Create Sibling Node")
    window.funcs.createKeybind(() => { createList(true) }, "X", true, false, true, "Create Sibling List")
    window.funcs.createKeybind(CreateDesc, "D", false, true, false, "Create Notes")
    window.funcs.createKeybind(CreateInfo, "E", false, true, false, "Create Info")
    window.funcs.createKeybind(deleteObj, "-", false, false, false, "Delete")
    window.funcs.createKeybind(() => {
        const selected = window.funcs.getSelected()
        if (!selected || (!selected.classList.contains("node") && !selected.classList.contains("list"))) return
        document.getElementById("propertiesMenu").getElementsByClassName("propCheck")[0].style.visibility = selected.dataset.prophline == "false" ? "visible" : "hidden"
        selected.dataset.prophline = selected.dataset.prophline == "false" ? "true" : "false"
    }, "C", false, true, false, "Add/Remove Connection")
    window.funcs.createKeybind(() => {
        const selected = window.funcs.getSelected()
        if (!selected || !selected.classList.contains("node")) return
        document.getElementById("propertiesMenu").getElementsByClassName("propCheck")[1].style.visibility = selected.dataset.prophbub == "false" ? "visible" : "hidden"
        selected.dataset.prophbub = selected.dataset.prophbub == "false" ? "true" : "false"
    }, "B", false, true, false, "Show/Hide Bubble")
}, 100);

window.addEventListener("addlines", () => {
    for (const obj of document.getElementById("mmViewport").children) {
        if (obj.classList.contains("node") || obj.classList.contains("list")) {
            createLine(window.funcs.getObj(obj.dataset.parent), window.funcs.getObj(obj.dataset.nodeid))
        }
    }
})

function stringToNumber(string) {
    return Number(string.slice(0, -1))
}