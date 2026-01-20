//Basically, this contains all the tiny bugs and feature fixes. yeah

// Auto Height Tag
{
    function updateHeights() {
        const allElements = document.getElementsByClassName("tExpand")

        if (!allElements) {
            return
        };

        for (let i = 0; i <= allElements.length - 1; i++) {
            update1Height(allElements.item(i))
        }
    }

    function update1Height(element) {
        const text = element.value ?? element.innerText
        const width = element.clientWidth + ""

        if (element.dataset.lastText == text && element.dataset.lastWidth == width) return
        if (width == undefined || text == undefined) return

        element.dataset.lastText = text
        element.dataset.lastWidth = width

        element.style.height = "auto"
        if (element.style.scrollHeight == undefined) {
            requestAnimationFrame(()=>update1Height(element))
            return
        }

        let height = ((element.scrollHeight * 100) / window.innerHeight)
        if (element.classList.contains("extraH")) {
            element.style.height = "Calc(" + height + "vh + 40%)"
        } else {
            element.style.height = height + "vh";
        }
        element.style.fontSize = element.clientWidth / (Number(element.dataset.maxline) ?? 10) + "px"
    }

    function loopFun() {
        updateHeights()
        requestAnimationFrame(loopFun)
    }

    requestAnimationFrame(loopFun)
}

// Auto Scale Tag
{
    function updateSizes() {
        const allElements = document.getElementsByClassName("tScale")
        if (!allElements) {
            return
        };

        for (let i = 0; i <= allElements.length - 1; i++) {
            update1size(allElements.item(i))
        }
    }

    function update1size(element) {
        element.value = element.value
        element.offsetWidth;

        const text = element.value ?? element.innerText
        const width = element.clientWidth + ""

        if (element.dataset.lastText == text && element.dataset.lastWidth == width) return
        if (width == undefined || text == undefined) return
        console.log("workin")

        element.dataset.lastText = text
        element.dataset.lastWidth = width

        let size = element.clientWidth * (element.classList.contains("tScaleFull") ? 1 : 0.35);
        let max = element.dataset.max - size

        if (max && size > max) {
            size = max
        }


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
    function loopFun() {
        updateSizes()
        requestAnimationFrame(loopFun)
    }

    requestAnimationFrame(loopFun)
}

// do info scaling
{
    function updateInfos() {
        let allElements = document.getElementById("mmViewport").children

        for (let i = 0; i <= allElements.length - 1; i++) {
            update1Info(allElements.item(i))
        }
    }
    function update1Info(element) {
        if (!element.classList.contains("node")) return
        let info = element.getElementsByClassName("info")[0]
        if (!info) return
        if (info.value.length > 2) {
            info.classList.add("infoLarge")
            info.classList.remove("infoSmall")
        } else {
            info.classList.remove("infoLarge")
            info.classList.add("infoSmall")
        }
    }
    function loopFun() {
        updateInfos()
        requestAnimationFrame(loopFun)
    }
    requestAnimationFrame(loopFun)
}

// fix bubbles + borders
{
    function loop() {
        let viewport = document.getElementById("mmViewport")
        let size = viewport.clientWidth / window.innerWidth * 0.4
        for (const obj of viewport.children) {
            let bub = obj.getElementsByClassName("bubble")[0]
            let desc = obj.getElementsByClassName("description")[0]
            let info = obj.getElementsByClassName("info")[0]
            if (bub) {
                bub.style["border-width"] = size + "vw"
            }
            if (desc) {
                desc.style["border-width"] = size + "vw"
                info.style["border-width"] = size + "vw"
            }
        }
        for (const obj of viewport.children) {
            let listC = obj.getElementsByClassName("listContent")[0]
            if (listC) {
                listC.style["border-width"] = size + "vw"
            }
        }
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
}
// add the no leave text thing bagingy
{
    document.addEventListener("click", () => {
        window.onbeforeunload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };
    }, { once: true });
}

// fix background
{
    function loop() {
        const background = document.getElementById("background")
        const viewport = document.getElementById("mmViewport")

        background.style.backgroundPositionX = viewport.style.left
        background.style.backgroundPositionY = Number(viewport.style.top.slice(0, -1)) * (window.innerHeight / window.innerWidth) + "%"
        background.style.size = Number(viewport.style.width.slice(0, -2)) / 18 + "vw"
        requestAnimationFrame(loop)
    }
    setTimeout(loop, 100)
}

// fix app resise
{
    function resizeApp() {
        const vv = window.visualViewport;
        const app = document.getElementById("app");
        if (!app) return
        app.style.width = vv.width + "px";
        app.style.height = vv.height + "px";
    }

    resizeApp();
    window.visualViewport.addEventListener("resize", resizeApp);
}

// no bubble selection fix
{
    let lastSel = null

    function loop() {
        const selection = window.funcs.getSelected()
            if (selection != lastSel) {
                for (const text of document.querySelectorAll(".nodeText")) {
                        text.style.color = ""
                }
                if (selection && selection.dataset.prophbub == "false") selection.querySelector(".nodeText").style.color = "var(--selection)"
                // console.log(selection.dataset.prophbub == "false", selection.querySelector(".nodeText").style.color)
            }
        lastSel = selection
        requestAnimationFrame(loop)
    }
    document.addEventListener("DOMContentLoaded", loop)
}