window.funcs = window.funcs || {};
window.props = window.props || {};

const keybinds = []
document.addEventListener("keydown", (event)=>{
    for (const i in keybinds) {
        tab = keybinds[i]
        let keybind = tab.keybind.slice(0,1)
        const isCtrl = tab.keybind.slice(1,2) == "1"
        const isShift = tab.keybind.slice(2,3) == "1"
        const isAlt =tab.keybind.slice(3,4) == "1"
        const canInFocus = tab.keybind.slice(4,5) == "1"
        if (document.activeElement?.tagName == "TEXTAREA" && !document.activeElement?.readOnly && !canInFocus) continue

        if (keybind != "-") {keybind = "Key"+keybind} else {keybind = "Delete"}

        if (event.code == keybind && (event.ctrlKey == isCtrl) && (event.shiftKey == isShift) && (event.altKey == isAlt)) {
            tab.func()
        }
    }
})

funcs = {
    getObj: function (id) {
        let result = null
        document.getElementById("mmViewport").childNodes.forEach(element => {
            if (element.data?.nodeid == id || element.dataset?.nodeid == id) {
                result = element
                return
            }
        });

        return result
    },
    getLine: function (id) {
        let result = null
        document.getElementById("mmViewport").childNodes.forEach(element => {
            if (element.data?.lineid == id || element.dataset?.lineid == id) {
                result = element
                return
            }
        });

        return result
    },

    select: function (Obj) {
        window.funcs.deselect()
        window.props.selected = Obj.dataset.nodeid
        Obj.classList.add("selected")
    },

    deselect: function () {
        let oldSelect = window.funcs.getSelected()

        if (oldSelect) {
            oldSelect.classList.remove("selected")
        }
        // window.props.selected = 0
    },
    createKeybind: function(func,mainkey,ctrl,shift,alt,description,canInFocus) {
        keybinds.push({keybind: mainkey+(ctrl?1:0)+(shift?1:0)+(alt?1:0)+(canInFocus?1:0), func: func,description: description})
    },
    getSelected: function () {
        return window.funcs.getObj(window.props.selected)
    },
    updateTheme: function () {
        const oldColour = document.documentElement.dataset.theme == "dark" ? "#000000" : "#b0b9c4"
        const newColour = document.documentElement.dataset.theme != "dark" ? "#000000" : "#b0b9c4"

        if (window.props.tcol == oldColour) window.props.tcol = newColour
        if (window.props.bcol == oldColour) window.props.bcol = newColour
        if (window.props.ocol == oldColour) window.props.ocol = newColour

        for (const obj of document.getElementById("mmViewport").children) {
            if (obj.classList.contains("node")) {
                obj.getElementsByClassName("description")[0].style["border-color"] = newColour
				obj.getElementsByClassName("description")[0].style["color"] = newColour
                obj.getElementsByClassName("info")[0].style["border-color"] = newColour
                obj.getElementsByClassName("info")[0].style["color"] = newColour
            }
        }
    }
}

props = {
    selected: 0,
    tcol: "#000000",
    bcol: "#000000",
    ocol: "#000000",
    tcMode: false,
    logs: []
}