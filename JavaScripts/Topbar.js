// This might be the longest of all scripts in this...

const topbar = document.getElementById("topbar")
const file = document.getElementById("file")
const edit = document.getElementById("edit")
const view = document.getElementById("view")
const help = document.getElementById("help")

// Add Clickability
function hideAll() {
    file.getElementsByClassName("tbContent")[0].style.visibility = "hidden"
    edit.getElementsByClassName("tbContent")[0].style.visibility = "hidden"
    view.getElementsByClassName("tbContent")[0].style.visibility = "hidden"
    help.getElementsByClassName("tbContent")[0].style.visibility = "hidden"
}

function openMenu(title) {
    const contents = title.parentElement.getElementsByClassName("tbContent")[0]
    if (contents.style.visibility == "visible") {
        hideAll()
        return
    }

    hideAll()
    contents.style.visibility = contents.style.visibility != "visible" ? "visible" : "hidden"
}

window.addEventListener("mousedown", hideAll)

//  EDIT MENU BUTTONS (note, file buttons in a seperate script.)
// RESTORE ORIGINAL COLOURS
{
    function main() {
        if (document.documentElement.dataset.theme != "dark") {
            window.props.tcol = "#000000"
            window.props.bcol = "#000000"
            window.props.ocol = "#000000"
        } else {
            window.props.tcol = "#b0b9c4"
            window.props.bcol = "#b0b9c4"
            window.props.ocol = "#b0b9c4"
        }
    }
    document.getElementById("tbDefaultCol").addEventListener("pointerdown", main)
} 

// TC MODE
{
    // let button = document.getElementById("tbTCmode")
    // button.addEventListener("mousedown", () => {
    //     if (window.props.tcMode) {
    //         button.innerText = button.innerText.slice(0, -2)
    //         window.props.tcMode = false
    //     } else {
    //         button.innerText = button.innerText + " ✔"
    //         window.props.tcMode = true
    //     }
    // })
}

// INSERT SIBLING NODE (in insert)
// INSERT SIBLING LIST (in insert)

// INSERT BULLETPOINT
{
    let lastFocusedType = null

    document.addEventListener("focusout", (event) => {
        lastFocusedType = null
        let obj = event.target
        if (event.target.parentElement.parentElement.id != "mmViewport") return
        if (edit.style.visibility == "hidden") return
        if (obj.classList.contains("nodeText") || obj.classList.contains("listContent") || obj.classList.contains("mmTitle")) {
            lastFocusedType = "text"
        }
        if (obj.classList.contains("description")) {
            lastFocusedType = "desc"
        }
        if (obj.classList.contains("info")) {
            lastFocusedType = "info"
        }
        if (obj.classList.contains("listTitle")) {
            lastFocusedType = "titl"
        }
    })

    function main() {
        const selectedObj = document.activeElement

        if (selectedObj && selectedObj.tagName == "TEXTAREA" && !selectedObj.readonly && selectedObj.parentElement.parentElement.id == "mmViewport") {
            const start = selectedObj.selectionStart
            selectedObj.value = selectedObj.value.slice(0,start) + "•" + selectedObj.value.slice(start)
            selectedObj.selectionStart,selectedObj.selectionEnd = start + 1
            return
        }
        const SelectedNode = window.funcs.getSelected()

        if (!SelectedNode || !lastFocusedType) return
        let obj
        switch(lastFocusedType) {
            case "text": {
                if (SelectedNode.classList.contains("node")) {
                    obj = SelectedNode.getElementsByClassName("nodeText")[0]
                }
                if (SelectedNode.classList.contains("list")) {
                    obj = SelectedNode.getElementsByClassName("listContent")[0]
                }
                if (SelectedNode.classList.contains("trunk")) {
                    obj = SelectedNode.getElementsByClassName("mmTitle")[0]
                }
                break
            }
            case "desc": {
                obj = SelectedNode.getElementsByClassName("description")[0]
                break
            }
            case "info": {
                obj = SelectedNode.getElementsByClassName("info")[0]
                break
            }
            case "titl": {
                obj = SelectedNode.getElementsByClassName("listTitle")[0]
                break
            }
        }

            const start = obj.selectionStart
            obj.value = obj.value.slice(0,start) + "•" + obj.value.slice(start)
            obj.selectionStart,obj.selectionEnd = start + 1
    }

    document.getElementById("tbIBP").addEventListener("pointerdown", main)
    window.funcs.createKeybind(main, "B", true, false, false, "Create Bulletpoint", true)
}


// VIEW BUTTONS
// ZOOM IN, ZOOM OUT, ZOOM FIT and ZOOM DEFAULT
{
    const zoomTypes = [10, 15, 25, 40, 60, 100, 150, 200, 300, 400, 500] // reminder: 100 = 70vw.
    let currentZoom = 5

    function zoomin() {
        if (currentZoom == zoomTypes.length) return
        currentZoom += 1
        document.getElementById("mmViewport").style.width = zoomTypes[currentZoom] * 0.7 + "vw"
    }
    function zoomout() {
        if (currentZoom == 0) return
        currentZoom -= 1
        document.getElementById("mmViewport").style.width = zoomTypes[currentZoom] * 0.7 + "vw"
    }
    function zoomfit() {
        let biggest = 0
        const viewport = document.getElementById("mmViewport")
        for (const obj of viewport.children) {
            let left = Number(obj.style.left.slice(0, -1))
            let top = Number(obj.style.top.slice(0, -1))

            if (left && Math.abs(left) > biggest) biggest = Math.abs(left)
            if (top && Math.abs(top) > biggest) biggest = Math.abs(top)
        }

        let newSize = biggest + 10
        originalWidth = 70

        viewport.style.width = 1 / (newSize / 100 * 2) * originalWidth + "vw"
        currentZoom = 5
    }
    function zoomDefault() {
        currentZoom = 5
        document.getElementById("mmViewport").style.width = "70vw"
    }

    document.getElementById("tbZoom").addEventListener("pointerdown", zoomin)
    document.getElementById("tbZoomOut").addEventListener("pointerdown", zoomout)
    document.getElementById("tbZoomFit").addEventListener("pointerdown", zoomfit)
     document.getElementById("tbZoomDefault").addEventListener("pointerdown", zoomDefault)
    window.funcs.createKeybind(zoomin, "Z", false, false, true, "Zoom In")
    window.funcs.createKeybind(zoomout, "Z", false, true, true, "Zoom Out")
}
// CHANGE THEME
{
    function main() {
        if (document.documentElement.dataset.theme != "dark") {
            document.documentElement.dataset.theme = "dark"
            document.getElementById("background").style["background-image"] = "url(Images/GridDark.png)"
        } else {
            document.documentElement.dataset.theme = undefined
            document.getElementById("background").style["background-image"] = "url(Images/Grid.png)"
        }
        window.funcs.updateTheme()
    }

    document.getElementById("tbChangeTheme").addEventListener("pointerdown", main)
}

// DONT CLICK THIS
{
    let propgress = 0
    let lasttime = 0
    const time = 5
    const viewport = document.getElementById("mmViewport")
    

    function update(delta) {
        propgress += (delta - lasttime) / 1000
        if (propgress > time) {
            viewport.style.rotate = "0deg"
            return
        }

        viewport.style.rotate = `${propgress * (360 / time)}deg`
        lasttime = delta
        requestAnimationFrame(update)
    }

    function main() {
        propgress = 0
        lasttime = 0
        requestAnimationFrame((d)=>{lasttime = d})
        requestAnimationFrame(update)
    }
    document.getElementById("tbDont").addEventListener("pointerdown",main)
}

// HIDE UI
{
    const uiLayer = document.getElementById("uiLayer")
    function main() {
       uiLayer.style.display = uiLayer.style.display == "none" ? "block" : "none" 
    }
    document.getElementById("tbHideUi").addEventListener("pointerdown",main)
    window.funcs.createKeybind(main,"H",false,false,true,"Hide/Show UI")
}

// HELP MENU (yes, all in one...)
{
    document.getElementById("tbGuide").addEventListener("pointerdown",()=>window.open("guide.html","_blank"))
    document.getElementById("tbKeybinds").addEventListener("pointerdown",()=>window.open("guide.html#keybinds","_blank"))
    document.getElementById("tbAboutMe").addEventListener("pointerdown",()=>window.open("guide.html#aboutMe","_blank"))
}