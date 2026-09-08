$(document).ready(function() {
    // SETTINGS PAGE 

    
    let key = "quicktab";
    let data = JSON.parse(localStorage.getItem(key));
    console.log(data);
    

    // SET INITIAL DATA 
    function setInitial(key){
        
        let value = 
        {
            "bookmarks": [
                {
                    "name": "YouTube",
                    "url": "https://www.youtube.com"
                },
                {
                    "name": "Gmail",
                    "url": "https://mail.google.com"
                }
            ],

            "theme": {
                "background": "#dedede",
                "secondary": "#818181",
                "text": "#000000",
                "primary": "#e63e32",
                "blur": "5",
                "radius": "20",
                "opacity": "88"
            },

            "settings": {
                "timeFormat": "12h",
                "searchEngine": "google",
                "theme": "theme1",
                "wallpaper": "/bg.jpg",
                "weatherLocation": "Dhaka"
            },

            "todo": [

            ],

            "notepad": {
                "tabs": [
                    { "id": "nt_1", "name": "Tab 1", "content": "Welcome to QuickTab!" }
                ],
                "activeTab": "nt_1"
            }
        }
        localStorage.setItem(key, JSON.stringify(value));
    }
    if(!localStorage.getItem(key)){
        setInitial(key);
        window.location.reload(true);
    }

    // BOOKMARKS ---------------------------------------
    function bookmarks(){
        function getBookmarks(){
            // ADD DATA 
            let name = $("#bookmarkName").val();
            let url = $("#bookmarkUrl").val();
            if(name == "" || url == "https://" || url == ""){ return; }
            data.bookmarks.push({"name" : name, "url" : url});
            localStorage.setItem(key, JSON.stringify(data));
            console.log(data);
    
            // SMOOTH APPEND TO LIST
            $("#bookmarkList").append(`<li>
                <img class="bookmarkLogo" src="https://www.google.com/s2/favicons?domain=${url}&size=128" alt="logo"> 
                <input type="text" name="bookmarkName" id="bookmarkName" value="${name}" readonly>
                <input type="text" name="bookmarkUrl" id="bookmarkUrl" value="${url}" readonly>
                <button class="deleteBookmark">Delete</button>
            </li>`).hide().slideDown(200);
    
            // CLEAR VALUE 
            $("#bookmarkName").val("");
            $("#bookmarkUrl").val("https://");
        }
        $("#addBookmark").click(function(){
            getBookmarks();
        })
    

        function showBookmarks(){
            let bookmarks = data.bookmarks || [];
            $("#bookmarkList").empty();
            let html = "";
            for(let i = 0; i < bookmarks.length; i++){
                html += `<li>
                            <img class="bookmarkLogo" src="https://www.google.com/s2/favicons?domain=${bookmarks[i].url}&size=128" alt="logo"> 
                            <input type="text" name="bookmarkName" id="bookmarkName" value="${bookmarks[i].name}" readonly>
                            <input type="text" name="bookmarkUrl" id="bookmarkUrl" value="${bookmarks[i].url}" readonly>
                            <button class="deleteBookmark">Delete</button>
                        </li>`;
            }
            $("#bookmarkList").html(html);
        }
        showBookmarks();
    
        function deleteBookmarks(index){
            data.bookmarks.splice(index, 1);
            localStorage.setItem(key, JSON.stringify(data));
            showBookmarks();
        }
        $("#bookmarkList").on("click", ".deleteBookmark", function(){
            let index = $(this).closest("li").index();
            deleteBookmarks(index);
        
            // SMOOTH REMOVE FROM LIST
            $(this).closest("li").slideUp(200, function(){
                $(this).remove();
            });
        });
    
    
        // EDIT BOOKMARK 
        $("#bookmarkList").on("dblclick", "input", function(){
            $(this).prop("readonly", false).css("border", "1px solid blue").focus();
        });
    
        $("#bookmarkList").on("blur", "input", function(){
            $(this).prop("readonly", true).css("border", "");
            
            let index = $(this).closest("li").index();
            data.bookmarks[index].name = $(this).closest("li").find("#bookmarkName").val();
            data.bookmarks[index].url = $(this).closest("li").find("#bookmarkUrl").val();
            
            localStorage.setItem(key, JSON.stringify(data));
        });
        $("#bookmarkList").on("keypress", "input", function(e){
            if(e.which === 13){ $(this).blur(); }
        });

        // VISIT BOOKMARK
        $("#bookmarkList").on("click", ".bookmarkLogo", function(){
            let url = $(this).closest("li").find("#bookmarkUrl").val();
            window.open(url, "_blank");
        });
    }
    bookmarks();

    // SCHEDULES ---------------------------------------------------
    function schedules() {
        const SKEY = "quicktab_schedules";
        const PRESETS = ["#e63e32", "#1176ff", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"];
        const STATUS = ["not_started", "ongoing", "complete"];
        const STATUS_GLYPH = { "not_started": "&#9744;", "ongoing": "&#9680;", "complete": "&#10003;" };
        let editingId = null;

        function load() {
            try {
                const parsed = JSON.parse(localStorage.getItem(SKEY));
                if (!Array.isArray(parsed)) return [];
                return parsed
                    .filter(function (s) { return s && typeof s === "object"; })
                    .map(function (s, i) {
                        return {
                            id: s.id || ("sch_" + Date.now().toString(36) + "_" + i),
                            status: STATUS.indexOf(s.status) !== -1 ? s.status : "not_started",
                            color: (typeof s.color === "string" && s.color) ? s.color : PRESETS[0],
                            date: typeof s.date === "string" ? s.date : "",
                            time: typeof s.time === "string" ? s.time : "",
                            title: typeof s.title === "string" ? s.title : ""
                        };
                    })
                    .sort(function (a, b) {
                        const ak = a.date + (a.time || "");
                        const bk = b.date + (b.time || "");
                        return ak < bk ? -1 : ak > bk ? 1 : 0;
                    });
            } catch (e) { return []; }
        }
        function save(list) { localStorage.setItem(SKEY, JSON.stringify(list)); }

        function fmtDate(key) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return key || "No date";
            const p = key.split("-");
            return p[2] + "/" + p[1] + "/" + p[0];
        }
        function fmtTime(t) {
            if (!t) return "";
            const p = t.split(":");
            let h = parseInt(p[0], 10);
            const m = p[1] || "00";
            const ap = h >= 12 ? "PM" : "AM";
            h = h % 12; h = h ? h : 12;
            return h + ":" + m + " " + ap;
        }
        function isOverdue(s) {
            if (s.status === "complete" || !s.date) return false;
            return new Date(s.date + "T" + (s.time || "00:00")).getTime() < Date.now();
        }
        function statusText(s) {
            if (s.status === "complete") return "Done";
            if (s.status === "ongoing") return "Ongoing";
            return isOverdue(s) ? "Overdue" : "Upcoming";
        }

        function render() {
            const list = load();
            const $list = $("#scheduleList");
            const $empty = $("#scheduleEmpty");
            $list.empty();
            if (!list.length) { $empty.show(); return; }
            $empty.hide();

            list.forEach(function (s) {
                const overdue = isOverdue(s);
                const $li = $("<li>").attr("data-id", s.id);
                if (overdue) $li.addClass("overdue");
                if (s.status === "complete") $li.addClass("complete");

                const $dot = $("<span>").addClass("schedule-dot").css("background-color", s.color);
                const $title = $("<span>").addClass("schedule-title").attr("title", s.title).text(s.title);
                const $meta = $("<span>").addClass("schedule-meta")
                    .text(fmtDate(s.date) + " \u00B7 " + fmtTime(s.time));
                const $tag = $("<span>").addClass("schedule-tag" + (overdue ? " overdue" : ""))
                    .text(statusText(s));
                const $status = $("<button>").addClass("schedule-status-btn")
                    .attr("type", "button")
                    .attr("title", "Tick / toggle status (click to cycle)")
                    .html(STATUS_GLYPH[s.status]);
                const $edit = $("<button>").addClass("schedule-action-btn")
                    .attr("type", "button").text("Edit");
                const $del = $("<button>").addClass("schedule-action-btn delete")
                    .attr("type", "button").text("Delete");

                $li.append($dot, $title, $meta, $tag, $status, $edit, $del);
                $list.append($li);

                $status.on("click", function () {
                    const next = STATUS[(STATUS.indexOf(s.status) + 1) % STATUS.length];
                    updateSchedule(s.id, { status: next });
                });
                $edit.on("click", function () { openModal(s.id); });
                $del.on("click", function () { deleteSchedule(s.id); });
            });
        }

        function updateSchedule(id, patch) {
            const list = load();
            const idx = list.findIndex(function (x) { return x.id === id; });
            if (idx === -1) return;
            list[idx] = Object.assign({}, list[idx], patch);
            save(list);
            render();
        }

        function deleteSchedule(id) {
            if (!confirm("Delete this schedule?")) return;
            save(load().filter(function (x) { return x.id !== id; }));
            render();
        }

        // ---- Modal ----
        function buildPalette() {
            const $pal = $("#schedFieldColors");
            $pal.empty();
            PRESETS.forEach(function (c) {
                $("<button>")
                    .addClass("schedule-color-swatch")
                    .css("background-color", c)
                    .attr("type", "button")
                    .data("color", c)
                    .on("click", function () {
                        $pal.find(".schedule-color-swatch").removeClass("selected");
                        $(this).addClass("selected");
                    })
                    .appendTo($pal);
            });
        }
        function selectedColor() {
            const sel = $("#schedFieldColors .selected");
            return sel.length ? sel.data("color") : PRESETS[0];
        }
        function openModal(id) {
            editingId = id || null;
            const s = id ? load().find(function (x) { return x.id === id; }) : null;
            $("#scheduleModalTitle").text(s ? "Edit Schedule" : "Add Schedule");
            $("#schedFieldTitle").val(s ? s.title : "");
            $("#schedFieldDate").val(s ? s.date : "");
            $("#schedFieldTime").val(s ? s.time : "");
            $("#schedFieldStatus").val(s ? s.status : "not_started");
            buildPalette();
            const color = s ? s.color : PRESETS[0];
            $("#schedFieldColors .schedule-color-swatch").each(function () {
                if ($(this).data("color") === color) $(this).addClass("selected");
            });
            $("#scheduleModal").css("display", "flex");
            requestAnimationFrame(function () { $("#scheduleModal").addClass("show"); });
            $("#schedFieldTitle").focus();
        }
        function closeModal() {
            $("#scheduleModal").removeClass("show");
            setTimeout(function () { $("#scheduleModal").css("display", "none"); }, 250);
            editingId = null;
        }

        $("#scheduleModalCancel").on("click", closeModal);
        $("#scheduleModal").on("click", function (e) { if (e.target === this) closeModal(); });
        $(document).on("keydown", function (e) {
            if (e.key === "Escape" && $("#scheduleModal").is(":visible")) closeModal();
        });
        $("#schedFieldTitle, #schedFieldDate, #schedFieldTime").on("keydown", function (e) {
            if (e.key === "Enter") $("#scheduleModalSave").trigger("click");
        });

        $("#scheduleModalSave").on("click", function () {
            const title = $("#schedFieldTitle").val().trim();
            const date = $("#schedFieldDate").val();
            const time = $("#schedFieldTime").val();
            const status = $("#schedFieldStatus").val();
            if (!title) { $("#schedFieldTitle").focus(); return; }
            if (!date) { $("#schedFieldDate").focus(); return; }
            const patch = { title: title, date: date, time: time, color: selectedColor(), status: status };

            if (editingId) {
                const list = load();
                const idx = list.findIndex(function (x) { return x.id === editingId; });
                if (idx !== -1) {
                    list[idx] = Object.assign({}, list[idx], patch);
                    save(list);
                }
            } else {
                const list = load();
                list.push({
                    id: "sch_" + Date.now().toString(36) + "_" + Math.floor(Math.random() * 100000).toString(36),
                    status: patch.status,
                    color: patch.color,
                    date: patch.date,
                    time: patch.time,
                    title: patch.title
                });
                save(list);
            }
            closeModal();
            render();
        });

        $("#addScheduleBtn").on("click", function () { openModal(null); });
        render();
    }
    schedules();

    // WALLPAPER -----------------------------------------------------------
    function wallpaper(){
       let isDynamic = data.settings.wallpaper == "dynamic" ? true : false;
        if(isDynamic){
            $(".wallpaper-preview img").attr("src", "https://picsum.photos/1920/1080");
        }else{    
            let link = "/bg.jpg";
            $(".wallpaper-preview img").attr("src", link);
       }
    }
    wallpaper();
    function setWallpaper(){
        $("#useDynamicWallpaper").click(function(){
            data.settings.wallpaper = "dynamic";
            localStorage.setItem(key, JSON.stringify(data));
            wallpaper();
        })


        $("#useStaticWallpaper").click(function(){
            data.settings.wallpaper = "static";
            localStorage.setItem(key, JSON.stringify(data));
            wallpaper();
        })
    }
    setWallpaper();



    // GENERAL SETTINGS ---------------------------------------------------

    // TIME FORMAT
    let tf = data.settings.timeFormat;  
    $(`input[name="timeFormat"][value="${tf}"]`).prop("checked", true);
    $("input[name='timeFormat']").on("change", function(){
        data.settings.timeFormat = $(this).val();
        localStorage.setItem(key, JSON.stringify(data));
    });

    // SEARCH ENGINE 
    $("#searchEngine").val(data.settings.searchEngine);
    $("#searchEngine").on("change", function(){
        data.settings.searchEngine = $(this).val();
        localStorage.setItem(key, JSON.stringify(data));
    });

    // WEATHER 
    $("#weatherLocation").val(data.settings.weatherLocation);
    $("#setWeatherLocation").on("click", function(){
        data.settings.weatherLocation = $("#weatherLocation").val();
        localStorage.setItem(key, JSON.stringify(data));
    });

    // REFRESH QUICKTAB 
    $("#refreshBtn").click(function(){
        window.location.reload(true);
    });

    // RESET TO DEFAULT 
    $("#resetBtn").click(function(){
        let sure = confirm("Are you sure you want to reset to default settings?");
        if(!sure) return;
        localStorage.removeItem(key);
        window.location.reload(true);
        setInitial();
    });


    // EXPORT SETTINGS 
    $("#exportBtn").click(function(){
        let d = new Date();
        let fileName = `QuickTab-Backup-${d.getHours()}-${d.getMinutes()}-${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}.json`;
        let blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectUrl(url);
    });

    // IMPORT SETTINGS 
    $("#importBtn").click(function(){
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e){
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = function(e){
                let data = JSON.parse(e.target.result);
                localStorage.setItem(key, JSON.stringify(data));
                window.location.reload(true);
            }
            reader.readAsText(file);
        }
        input.click();
    });




    // THEME SETTINGS 
    function theme(){
        // SET THEME 
        $("#applyTheme1").click(function(){
            data.settings.theme = "theme1";
            localStorage.setItem(key, JSON.stringify(data));
            $(".theme").removeClass("selected-theme");
            $(this).closest(".theme").addClass("selected-theme");
            // window.location.reload(true);
        })
        $("#applyTheme2").click(function(){
            data.settings.theme = "theme2";
            localStorage.setItem(key, JSON.stringify(data));
            $(".theme").removeClass("selected-theme");
            $(this).closest(".theme").addClass("selected-theme");
            // window.location.reload(true);
        })
        $("#applyTheme3").click(function(){
            data.settings.theme = "theme3";
            localStorage.setItem(key, JSON.stringify(data));
            $(".theme").removeClass("selected-theme");
            $(this).closest(".theme").addClass("selected-theme");
            // window.location.reload(true);
        })
        $("#applyTheme4").click(function(){
            data.settings.theme = "theme4";
            localStorage.setItem(key, JSON.stringify(data));
            $(".theme").removeClass("selected-theme");
            $(this).closest(".theme").addClass("selected-theme");
            // window.location.reload(true);
        })
        $("#applyTheme5").click(function(){
            data.settings.theme = "theme5";
            localStorage.setItem(key, JSON.stringify(data));
            $(".theme").removeClass("selected-theme");
            $(this).closest(".theme").addClass("selected-theme");
            // window.location.reload(true);
        })
        $("#applyTheme6").click(function(){
            data.settings.theme = "theme6";
            localStorage.setItem(key, JSON.stringify(data));
            $(".theme").removeClass("selected-theme");
            $(this).closest(".theme").addClass("selected-theme");
            // window.location.reload(true);
        })
    
        // SHOW SELECTED 
        if(data.settings.theme == "theme1"){
            $(".theme").removeClass("selected-theme");
            $("#applyTheme1").closest(".theme").addClass("selected-theme");
        }else if(data.settings.theme == "theme2"){
            $(".theme").removeClass("selected-theme");
            $("#applyTheme2").closest(".theme").addClass("selected-theme");
        }else if(data.settings.theme == "theme3"){
            $(".theme").removeClass("selected-theme");
            $("#applyTheme3").closest(".theme").addClass("selected-theme");
        }else if(data.settings.theme == "theme4"){
            $(".theme").removeClass("selected-theme");
            $("#applyTheme4").closest(".theme").addClass("selected-theme");
        }else if(data.settings.theme == "theme5"){
            $(".theme").removeClass("selected-theme");
            $("#applyTheme5").closest(".theme").addClass("selected-theme");
        }else if(data.settings.theme == "theme6"){
            $(".theme").removeClass("selected-theme");
            $("#applyTheme6").closest(".theme").addClass("selected-theme");
        }
    }
    theme();

    
    // COLOR SETTINGS 

    // Initial load: set input values and spans from data.theme
    function loadThemeSettings(){
        $("#bgColor").val(data.theme.background);
        $("#bgColorValue").text(data.theme.background);
        $(".preview-div").css("background-color", data.theme.background+data.theme.opacity);

        $("#txtColor").val(data.theme.text);
        $("#textColorValue").text(data.theme.text);
        $(".preview-div p").css("color", data.theme.text);

        $("#themeColor").val(data.theme.primary);
        $("#themeColorValue").text(data.theme.primary);
        $(".preview-div").css("color", data.theme.primary);

        $("#opacity").val(parseInt(data.theme.opacity, 16) / 255 * 100);
        $("#opacityValue").text(data.theme.opacity);
        $(".preview-div").css("background-color", data.theme.background+data.theme.opacity);

        $("#blur").val(data.theme.blur);
        $("#blurValue").text(data.theme.blur + "px");
        $(".preview-div").css("backdrop-filter", "blur(" + data.theme.blur + "px)");

        $("#radius").val(data.theme.radius);
        $("#radiusValue").text(data.theme.radius + "px");
        $(".preview-div").css("border-radius", data.theme.radius + "px");
    }
    loadThemeSettings();

    // On change: update span, data.theme, localStorage
    $(".color input").on("input", function(){
        let id = $(this).attr("id");
        let val = $(this).val();

        switch(id){
            case "bgColor":
                data.theme.background = val;
                $("#bgColorValue").text(val);
                $(".preview-div").css("background-color", val);
                break;
            case "txtColor":
                data.theme.text = val;
                $("#textColorValue").text(val);
                $(".preview-div p").css("color", val);
                break;
            case "themeColor":
                data.theme.primary = val;
                $("#themeColorValue").text(val);
                // $(".preview").css("border", "2px solid " + val);
                break;
            case "opacity":
                let opacity = val / 100;
                let alphaHex = Math.round(opacity * 255).toString(16).toUpperCase();
                if (alphaHex.length == 1) alphaHex = "0" + alphaHex;

                data.theme.opacity = alphaHex; 

                $("#opacityValue").text(alphaHex); 
                $(".preview-div").css("background-color", data.theme.background + alphaHex);

                break;
            case "blur":
                data.theme.blur = val;
                $("#blurValue").text(val + "px");
                $(".preview-div").css("backdrop-filter", "blur(" + val + "px)");
                break;
            case "radius":
                data.theme.radius = val;
                $("#radiusValue").text(val + "px");
                $(".preview-div").css("border-radius", val + "px");
                break;
        }

        localStorage.setItem(key, JSON.stringify(data));
    });




    // FOOTER YEAR
    let year = new Date().getFullYear();
    $("#year").text(year);

    // HOME BTN
    $("#homeBtn").on("click", function(e){
        e.preventDefault();
        window.location.href = chrome.runtime.getURL("index.html");
    });





})