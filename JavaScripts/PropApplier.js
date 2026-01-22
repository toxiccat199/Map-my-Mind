function updateNode(node) {
    // Is Connected
    let isConnected = node.dataset.prophline
    if (isConnected == null) isConnected = "true"
    let line = window.funcs.getLine(node.dataset.line)
    if (line) {
        line.style.visibility = isConnected == "true" ? "visible" : "hidden"
    }

    // Has Bubble
    let hasBubble = node.dataset.prophbub || "true"
    let bubble = node.getElementsByClassName("bubble")[0]
    if (bubble) {
        bubble.style["border-style"] = hasBubble == "true" ? "solid" : "none"
        bubble.style["opacity"] = hasBubble == "true" ? 1 : 0
        bubble.style["border-radius"] = "50%"
        if (node.getElementsByClassName("nodeText")[0].value == "") {
            bubble.style["opacity"] = hasBubble == "true" ? "1" : "0.1"
            bubble.style["border-radius"] = hasBubble == "true" ? "50% " : "10%"
        }
        if (node.classList.contains("selected")) {
            console.log(hasBubble == "true" ? window.props.tcol : "var(--selection)")
            node.querySelector(".nodeText").style.color = hasBubble == "true" ? window.props.tcol : "var(--selection)"
        }
    }

    // Size
    let size = node.dataset.propsize || "1"
    let lastSize = node.style.width == "10%" ? "1" : node.style.width == "12%" ? "2" : "3"
    switch (size) {
        case "1": {
            node.style.width = "10%"
            break
        }
        case "2": {
            node.style.width = "12%"
            break
        }
        case "3": {
            node.style.width = "14%"
            break
        }
    }
}

function updateList(list) {
    // Is Connected
    let isConnected = list.dataset.prophline || "true"
    let line = window.funcs.getLine(list.line)

    if (line) {
        line.style.visibility = isConnected == "true" ? "visible" : "hidden"
    }

    // Title Type
    let titleType = list.dataset.proptitype || "3"
    let title = list.getElementsByClassName("listTitle")[0]
    title.style.visibility = "visible"
    title.classList.remove("listTitleTop")
    title.classList.remove("listTitleBottom")
    switch (titleType) {
        case "1": {
            title.style.visibility = "hidden"
        }
        case "2": {
            title.classList.add("listTitleTop")
        }
        case "3": {
            title.classList.add("listTitleBottom")
        }
    }
}

function updateColours(obj) {
    if (obj.classList.contains("node")) {
        // Text Colour
        let textColour = window.props.tcol

        if ((obj.dataset.prophbub ?? "true") == "true" || window.props.selected != obj.dataset.nodeid) {
            obj.getElementsByClassName("nodeText")[0].style.color = textColour
        } else {
            obj.getElementsByClassName("nodeText")[0].style.color = "var(--selection)"
        }

        // Bubble Colour
        let bubbleColour = window.props.bcol
        obj.getElementsByClassName("bubble")[0].style["border-color"] = bubbleColour
    } else if (obj.classList.contains("list")) {
        // Text Colour
        let textColour = window.props.tcol
        obj.getElementsByClassName("listContent")[0].style.color = textColour
        obj.getElementsByClassName("listTitle")[0].style.color = textColour

        // Outline Colour
        let OutlineColour = window.props.ocol
        obj.getElementsByClassName("listContent")[0].style.setProperty("border-color", OutlineColour)
    } else if (obj.classList.contains("trunk")) {
        // Text Colour
        let textColour = window.props.tcol
        obj.getElementsByClassName("mmTitle")[0].style.color = textColour

        // Bubble Colour
        let bubbleColour = window.props.bcol
        obj.getElementsByClassName("bubble")[0].style["border-color"] = bubbleColour
    }
}

window.addEventListener("selectedChanged", () => {
    const selected = window.funcs.getSelected()
    if (!selected) return
    if (selected.classList.contains("node")) updateNode(selected)
    if (selected.classList.contains("list")) updateList(selected)
})

{
    let lastTcol = null
    let lastBcol = null
    let lastOcol = null
    let lastNodeCount = 1

    function checkForColour() {
        setTimeout(() => {
            checkForColour()
        }, (0));
        cfcCheck1()
        cfcCheck2()
    }

    function cfcCheck1() {
        const tcol = window.props.tcol
        const bcol = window.props.bcol
        const ocol = window.props.ocol

        // console.log(!prop, !prop.parentElement.parentElement, prop.parentElement.parentElement?, prop.tagName != "INPUT")
        if (tcol == lastTcol && bcol == lastBcol && ocol == lastOcol) return
        lastTcol = tcol
        lastBcol = bcol
        lastOcol = ocol

        for (const obj of document.getElementById("mmViewport").children) {
            updateColours(obj)
        }
    }
    function cfcCheck2() {
        const nodeCount = document.getElementById("mmViewport").children.length

        if (lastNodeCount != nodeCount) {
            lastBcol = nodeCount

            for (const obj of document.getElementById("mmViewport").children) {
                updateColours(obj)
            }
        }
    }
    document.addEventListener("DOMContentLoaded", checkForColour)
}

window.addEventListener("addlines", () => {
    for (const obj of document.getElementById("mmViewport").children) {
        if (obj.classList.contains("node")) updateNode(obj)
        if (obj.classList.contains("list")) updateList(obj)
        if (obj.classList.contains("obj")) updateColours(obj)
    }
})