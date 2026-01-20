/* FORMAT
    ["PropName"]: {
        order: number,
        type: bool,text,choice,colour,
        options: ["op1","op2","op3"], (if choice, max 4)
        maxSize: number (if text) 
    }
*/
const nodeProps = {
    ["Is Connected"]: {
        order: 0,
        type: "bool",
        default: "true",
        getid: "hline"
    },
    ["Has Bubble"]: {
        order: 1,
        type: "bool",
        default: "true",
        getid: "hbub"
    },
    ["Text Colour"]: {
        order: 2,
        type: "colour",
        default: "#000000",
        getid: "tcol",
        linked: true
    },
    ["Bubble Colour"]: {
        order: 3,
        type: "colour",
        default: "#000000",
        getid: "bcol",
        linked: true
    },
    ["Size"]: {
        order: 4,
        type: "choice",
        options: ["Normal", "Subtitle", "Title"],
        default: 1,
        getid: "size"
    },
}

const listProps = {
    ["Is Connected"]: {
        order: 0,
        type: "bool",
        default: "true",
        getid: "hline"
    },
    ["Text Colour"]: {
        order: 1,
        type: "colour",
        default: "#000000",
        getid: "tcol",
    },
    ["Outline Colour"]: {
        order: 2,
        type: "colour",
        default: "#000000",
        getid: "ocol",
    },
    ["Title type"]: {
        order: 3,
        type: "choice",
        options: ["none", "top", "bottom"],
        default: 3,
        getid: "titype"
    }
}
const trunkProps = {
    ["Text Colour"]: {
        order: 1,
        type: "colour",
        default: "#000000",
        getid: "tcol",
    },
    ["Bubble Colour"]: {
        order: 2,
        type: "colour",
        default: "#000000",
        getid: "bcol",
    },
}

function sortPropT(propTable) {
    let newPropTable = []
    Object.entries(propTable).forEach(([key, prop]) => {
        let newProp = {}
        newProp.name = key
        newProp.type = prop.type
        newProp.options = prop.options
        newProp.default = prop.default
        newProp.getid = prop.getid
        newProp.linked = prop.linked
        newPropTable[prop.order] = newProp
    })

    return newPropTable
}

function renderProps(pt) { // "UhHhH AcTuAlLy ThIs Is A pRopOBJECT!!! Shut up."
    const propMenu = document.getElementById("propertiesMenu")
    const propBool = document.getElementById("propBool")
    const propColour = document.getElementById("propColour")
    const propChoice = document.getElementById("propChoice")

    let propTable = sortPropT(pt)
    for (const i in propTable) {
        const prop = propTable[i]
        let propObj = null

        switch (prop.type) {
            case "bool": {
                propObj = propBool.cloneNode(true)

                if (!prop.default) {
                    propObj.getElementsByClassName("propCheck")[0].style.visibility = "hidden"
                }
                break
            }
            case "colour": {
                propObj = propColour.cloneNode(true)
                propObj.getElementsByClassName("propColourBox")[0].value = prop.defaul
                break
            }
            case "choice": {
                propObj = propChoice.cloneNode(true)
                propObj.getElementsByClassName("propOption" + prop.default)[0].classList.add("propSelected")

                const po1 = propObj.getElementsByClassName("propOption1")[0]
                const po2 = propObj.getElementsByClassName("propOption2")[0]
                const po3 = propObj.getElementsByClassName("propOption3")[0]

                po1.innerText = prop.options[0]
                po2.innerText = prop.options[1]
                po3.innerText = prop.options[2]
                break
            }
        }
        propMenu.appendChild(propObj)
        let title = propObj.getElementsByClassName("propTitle")[0]

        title.innerText = prop.name + ":"
        propObj.dataset.getid = prop.getid

        if (pt != trunkProps) {
            const deleteButton = document.getElementById("propDelete").cloneNode()
            propMenu.appendChild(deleteButton)
            deleteButton.innerText = pt == nodeProps ? "Delete Node" : "Delete List"
            deleteButton.id = ""
        }
    }
}

function tickBox(checkbox) {
    let check = checkbox.getElementsByClassName("propCheck")[0]
    let isTicked = (check.style.visibility == "visible") || (check.style.visibility == "")
    check.style.visibility = (!isTicked) ? "visible" : "hidden"
    updateNodeProp(checkbox.parentElement.parentElement.dataset.getid, !isTicked + "")
    window.dispatchEvent(new CustomEvent("selectedChanged"))
}

function fixTitle(element) {
    element.value = element.value

    let size = element.clientWidth * 0.35;
    element.style.fontSize = size + "px";
    while (
        (
            element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) &&
        size > 5
    ) {
        size--;
        element.style.fontSize = size + "px";
    }
}

function selectChoice(choice) {
    let container = choice.parentElement
    let choice1 = container.getElementsByClassName("propOption1")[0]
    let choice2 = container.getElementsByClassName("propOption2")[0]
    let choice3 = container.getElementsByClassName("propOption3")[0]
    let choiceNum = 0

    if (choice1) { choice1.classList.remove("propSelected") }
    if (choice2) { choice2.classList.remove("propSelected") }
    if (choice3) { choice3.classList.remove("propSelected") }

    if (choice == choice1) { choiceNum = 1 }
    if (choice == choice2) { choiceNum = 2 }
    if (choice == choice3) { choiceNum = 3 }

    updateNodeProp(choice.parentElement.parentElement.dataset.getid, choiceNum + "")
    choice.classList.add("propSelected")

    window.dispatchEvent(new CustomEvent("selectedChanged"))
}

function updateNodeProp(getid, value) {
    const node = window.funcs.getSelected()
    if (!node) return
    node.dataset["prop" + getid] = value + ""
}

let lastSel = -1
function loadPropsToMenu() {
    let propMenu = document.getElementById("propertiesMenu")
    propMenu.replaceChildren()
    let selObject = window.funcs.getSelected()
    if (!selObject) {
        return
    }
    let propTable
    let type

    if (selObject.classList.contains("node")) {
        propTable = nodeProps
        type = "node"
    } else if (selObject.classList.contains("list")) {
        propTable = listProps
        type = "list"
    } else if (selObject.classList.contains("trunk")) {
        propTable = trunkProps
        type = "trunk"
    } else {
        return
    }
    renderProps(propTable)
    propTable = sortPropT(propTable)
    for (let i in propTable) {
        const prop = propTable[i]
        let obj = null

        const getid = prop.getid
        let value = selObject.dataset["prop" + getid]
        if (prop.type == "colour") {
            value = window.props[prop.getid]
        }

        if (value == null) {
            selObject.dataset["prop" + getid] = prop.default
            continue
        }
        for (const index in propMenu.children) {
            let child = propMenu.children[index]
            if (typeof (child) == "object" && child.getElementsByClassName("propTitle")[0]) {
                if (child.getElementsByClassName("propTitle")[0].innerHTML == prop.name + ":") {
                    obj = child
                    break
                }
            }
        }
        switch (prop.type) {
            case "bool": {
                let check = obj.getElementsByClassName("propCheck")[0]
                check.style.visibility = value == "true" ? "visible" : "hidden"
                break
            }
            case "colour": {
                let colourBox = obj.getElementsByClassName("propColourBox")[0]
                colourBox.value = value
                break
            }
            case "choice": {
                selectChoice(obj.getElementsByClassName("propOption" + value)[0])
                break
            }
        }
    }
}
function loopCheck() {
    const propMenu = document.getElementById("propertiesMenu")
    let lastTcol = window.props.tcol
    let lastBcol = window.props.bcol
    let lastOcol = window.props.ocol

    for (const obj of propMenu.children) {
        if (!obj.classList.contains("propColour")) continue
        const colourBox = obj.getElementsByClassName("propColourBox")[0]
        if (!colourBox || document.activeElement.parentElement.parentElement?.dataset?.getid != obj.dataset.getid) continue

        let type = obj.dataset.getid
        switch (type) {
            case "tcol": {
                if (lastTcol != colourBox.value) {
                    window.props.tcol = colourBox.value
                    lastTcol = colourBox.value
                    break
                }
            }
            case "bcol": {
                if (lastBcol != colourBox.value) {
                    window.props.bcol = colourBox.value
                    lastBcol = colourBox.value
                    break
                }
            }
            case "ocol": {
                if (lastOcol != colourBox.value) {
                    window.props.ocol = colourBox.value
                    lastOcol = colourBox.value
                    break
                }
            }
        }
    }

    setTimeout(() => {
        loopCheck()
    }, 20);
}

function fixInsertMenu() { // bonus!
    const noteB = document.getElementById("insertButtonsLD")
    const infoB = document.getElementById("insertButtonsRD")

    const obj = window.funcs.getSelected()
    if (obj && obj.classList.contains("node")) {
        noteB.disabled = false
        infoB.disabled = false
    } else {
        noteB.disabled = true
        infoB.disabled = true
    }
}

setTimeout(loopCheck, 100)

function loopLPTM() {
    if (lastSel != window.props.selected) {
        loadPropsToMenu()
        requestAnimationFrame(fixInsertMenu)
        lastSel = window.props.selected
    }
    requestAnimationFrame(loopLPTM)
}
setTimeout(loopLPTM, 100)