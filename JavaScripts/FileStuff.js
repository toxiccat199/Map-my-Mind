function mindmapToJSON() {
    const json = {
        properties: {
            version: "1.0"
        },
        nodes: [

        ]
    }
    const mmViewport = document.getElementById("mmViewport")

    json.properties.title = document.getElementsByClassName("mmTitle")[0].value
    json.properties.textColour = window.props.tcol
    json.properties.bubbleColour = window.props.bcol
    json.properties.outlineColour = window.props.ocol
    for (const obj of mmViewport.children) {
        if (!obj.classList.contains("node") && !obj.classList.contains("list")) continue

        const table = {}
        table.type = obj.classList.contains("node") ? "node" : "list"
        table.id = obj.dataset.nodeid
        table.parent = Number(obj.dataset.parent)
        table.children = obj.dataset.children
        table.posx = obj.style.left
        table.posy = obj.style.top

        if (table.type == "node") {
            table.text = obj.getElementsByClassName("nodeText")[0].value
            table.properties = {
                hline: obj.dataset.prophline ?? "true",
                hbub: obj.dataset.prophbub ?? "true",
                size: obj.dataset.propsize ?? "1"
            }
            let desc = obj.getElementsByClassName("description")[0]
            let info = obj.getElementsByClassName("info")[0]
            table.additions = {
                desc: !obj.classList.contains("hasDesc") ? "" : desc.value,
                info: !obj.classList.contains("hasInfo") ? "" : info.value,
            }
        } else {
            table.text = obj.getElementsByClassName("listContent")[0].value
            table.title = obj.getElementsByClassName("listTitle")[0].value
            table.properties = {
                hline: obj.dataset.prophline ?? "true",
                titype: obj.dataset.propstitype ?? "3"
            }
        }

        json.nodes.push(table)
    }

    return JSON.stringify(json, null, 2)
}

function JSONtomindmap(JSONstring) {
    let mmViewport = document.getElementById("mmViewport")

    table = JSON.parse(JSONstring)

    clearMindmap()

    mmViewport.getElementsByClassName("mmTitle")[0].value = table.properties.title
    window.props.tcol = table.properties.textColour
    window.props.bcol = table.properties.bubbleColour
    window.props.ocol = table.properties.outlineColour

    for (const nodeProps of table.nodes) {
        const obj = nodeProps.type == "node" ? document.getElementById("node").cloneNode(true) : document.getElementById("list").cloneNode(true)
        obj.dataset.nodeid = nodeProps.id
        obj.dataset.parent = nodeProps.parent
        obj.dataset.children = nodeProps.children
        obj.style.left = nodeProps.posx
        obj.style.top = nodeProps.posy

        if (nodeProps.type == "node") {
            obj.getElementsByClassName("nodeText")[0].value = nodeProps.text

            obj.dataset.prophline = nodeProps.properties.hline
            obj.dataset.prophbub = nodeProps.properties.hbub
            obj.dataset.propsize = nodeProps.properties.size

            if (nodeProps.additions.desc != "") {
                obj.classList.add("hasDesc")
                obj.getElementsByClassName("description")[0].value = nodeProps.additions.desc
            }
            if (nodeProps.additions.info != "") {
                obj.classList.add("hasInfo")
                obj.getElementsByClassName("info")[0].value = nodeProps.additions.info
            }
        } else {
            obj.getElementsByClassName("listContent")[0].value = nodeProps.text
            obj.getElementsByClassName("listTitle")[0].value = nodeProps.title

            obj.dataset.prophline = nodeProps.properties.hline
            obj.dataset.proptitype = nodeProps.properties.titype
        }

        mmViewport.appendChild(obj)
    }

    const event = new CustomEvent("addlines")
    window.dispatchEvent(event)
}

function clearMindmap() {
    const toRemove = []
    for (const obj of mmViewport.children) {
        // obj = mmViewport.children[i]
        // if (Number.isNaN(Number(i))) return
        if (!obj.classList.contains("trunk")) {
            toRemove.push(obj)
        }
    }

    for (const obj of toRemove) {
        obj.remove()
    }
}

async function saveJSON(json) {
    if ("showSaveFilePicker" in window) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: "mapmymind.json",
                types: [{
                    description: "JSON Files",
                    accept: { "application/json": [".json"] }
                }]
            });

            const writable = await handle.createWritable();
            await writable.write(json);
            await writable.close();
        } catch {

        }
    } else {
        await navigator.clipboard.writeText(json);
        alert("Your school/work has blocked saving and downloading. Your mindmap has been saved to your clipboard. Place it in a document!")
    }
}
async function openJSON() {
    if (await mmlostWarning() == 0) return

    if ("showOpenFilePicker" in window) {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: 'JSON Files',
                accept: { 'application/json': ['.json'] }
            }],
            multiple: false
        });

        const file = await fileHandle.getFile();
        const text = await file.text();
        JSONtomindmap(text)
    } else {
        console.log(":(")
        if (await blockedOpen() == 0) return
        try {JSONtomindmap(document.getElementById("paMindmap").value)} catch {}
    }
    window.funcs.updateTheme()
}
document.addEventListener('DOMContentLoaded', () => {
    async function saveAsPNG() {
        const viewport = document.getElementById("mmViewport")
        document.getElementById("tbZoomFit").click()
        viewport.style.left = "50vw"
        viewport.style.top = "50vh"
        document.getElementById("uiLayer").style.visibility = "hidden"
        document.getElementById("noUiInfo").style.visibility = "hidden"
        await sleep(100)

        try {
            const dataUrl = await htmlToImage.toPng(viewport, { backgroundColor: "#ffffff" });
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = document.getElementById("mmTitle").value + ".png";
            a.click();
        } catch (err) {
            console.error("PNG export failed:", err);
        }
    }
    // document.getElementById("tbSavePng").addEventListener("mousedown", saveAsPNG)
})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function mmlostWarning() {
    return new Promise(resolve => {

        const warning = document.getElementById("warningPopup")
        const cancelB = document.getElementById("wpCancel")
        const continueB = document.getElementById("wpContinue")

        let result = null

        function onClickCancel() {
            warning.style.visibility = "hidden"
            cancelB.removeEventListener("mousedown", onClickCancel)
            continueB.removeEventListener("mousedown", onClickContinue)
            result = 0
        }
        function onClickContinue() {
            warning.style.visibility = "hidden"
            cancelB.removeEventListener("mousedown", onClickCancel)
            continueB.removeEventListener("mousedown", onClickContinue)
            result = 1
        }

        warning.style.visibility = "visible"
        cancelB.addEventListener("mousedown", onClickCancel)
        continueB.addEventListener("mousedown", onClickContinue)

        function loop() {
            if (result === null) { setTimeout(loop, 100) } else { resolve(result) }
        }
        loop()
    })
}

async function blockedOpen() {
    return new Promise(resolve => {
        document.getElementById("paMindmap").value = ""

        const popup = document.getElementById("pastePopup")
        const cancel = document.getElementById("paCancel")
        const open = document.getElementById("paOpen")

        let result = null

        function onClickCancel() {
            popup.style.visibility = "hidden"
            cancel.removeEventListener("mousedown", onClickCancel)
            open.removeEventListener("mousedown", onClickContinue)
            result = 0
        }
        function onClickContinue() {
            popup.style.visibility = "hidden"
            cancel.removeEventListener("mousedown", onClickCancel)
            open.removeEventListener("mousedown", onClickContinue)
            result = 1
        }

        popup.style.visibility = "visible"
        cancel.addEventListener("mousedown", onClickCancel)
        open.addEventListener("mousedown", onClickContinue)

        function loop() {
            console.log("cmon")
            if (result === null) { setTimeout(loop, 100) } else { resolve(result) }
        }
        loop()
    })
}

async function newMM() {
    const value = await mmlostWarning()

    if (value == 0) return
    clearMindmap()
}

document.getElementById("tbSave").addEventListener("mousedown", () => {
    saveJSON(mindmapToJSON())
})

document.getElementById("tbNew").addEventListener("mousedown", newMM)

document.getElementById("tbOpen").addEventListener("mousedown", openJSON)

document.getElementById("paHelp").addEventListener("mousedown", ()=>{
    window.open("guide.html#blocked","_blank")
})
