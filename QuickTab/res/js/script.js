// MAIN JS 
$(document).ready(function () {


    let key = "quicktab";
    let data = JSON.parse(localStorage.getItem(key));


    // INITIAL SETTINGS
    function setInitial(key) {

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
                "content": "Welcome to QuickTab!"
            }
        }
        localStorage.setItem(key, JSON.stringify(value));
    }
    if (!localStorage.getItem(key)) {
        setInitial(key);
        window.location.reload(true);
    }






    let selectedTheme = data.settings.theme;
    console.log(selectedTheme);

    $("#theme-container").load("/res/theme/" + selectedTheme + "/" + selectedTheme + ".html", function () {
        initTheme();
    });

    // LOAD WALLPAPER 
    if (selectedTheme !== "theme5") {
        let isDynamic = data.settings.wallpaper == "dynamic" ? true : false;
        if (isDynamic) {
            $("body").css("background-image", "url(https://picsum.photos/1920/1080)");
        } else {
            let link = "/bg.jpg";
            $("body").css("background-image", "url(" + link + ")");
        }
    } else {
        $("body").css("background-image", "none");
    }


    // APPLY WEATHER API
    function weather() {

        function fetchWeatherData() {
            const apiKey = '0d4fa78962b1bff5497c512a23db006d';
            // fetch location from localstorage 
            const location = data.settings.weatherLocation;
            const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&units=metric&appid=' + apiKey;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    // use int data

                    document.getElementById('temperature').textContent = parseInt(data.main.temp) + '°C';
                    document.getElementById('humidity').textContent = data.main.humidity + '%';

                    document.getElementById('windSpeed').textContent = data.wind.speed + 'km/h';
                    document.getElementById('feelsLike').textContent = parseInt(data.main.feels_like) + '°C';
                    document.getElementById('highTemp').textContent = parseInt(data.main.temp_max) + '°C' + '/' + parseInt(data.main.temp_min) + '°C';
                    document.getElementById('location').textContent = data.name + ', ' + data.sys.country;

                    // Update the weather icon based on the weather condition
                    const weatherIcon = document.getElementById('weatherIcon');
                    const iconCode = data.weather[0].icon;
                    weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}.png`; // You can use your own icons as well
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        }

        fetchWeatherData();
    } weather();


    // SHOW BOOKMARKS IS IN "widgets.js"


    // APPLY THEME 
    function theme() {
        // GET THEME DATA 
        let opacity = data.theme.opacity;
        let blur = data.theme.blur;
        let radius = data.theme.radius;
        let bgColor = data.theme.background;
        let txtColor = data.theme.text;
        let themeColor = data.theme.primary;

        // APPLY THEMES
        document.documentElement.style.setProperty('--bg-secondary', bgColor + opacity);
        // document.documentElement.style.setProperty('--opacity', opacity);
        document.documentElement.style.setProperty('--blur', blur + 'px');
        document.documentElement.style.setProperty('--radius', radius + 'px');
        document.documentElement.style.setProperty('--text-b', txtColor);
        document.documentElement.style.setProperty('--theme', themeColor);
    }
    theme();




    console.log("script.js loaded");



    // THEME JS 
    function initTheme() {


        // DATE TIME 
        function updateTimeDate() {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            minutes = minutes < 10 ? '0' + minutes : minutes;

            if (data.settings.timeFormat == "24") {
                $("#time").text(hours + ':' + minutes);
            } else {
                let ampm = hours >= 12 ? 'PM' : 'AM';
                let displayHours = hours % 12;
                displayHours = displayHours ? displayHours : 12;
                $("#time").text(displayHours + ':' + minutes + ' ' + ampm);
            }

            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            $("#date").text(now.toLocaleDateString('en-US', options));
        }
        updateTimeDate();
        setInterval(updateTimeDate, 1000);


        // TAB
        $("#tabBtn").click(function () {
            // $(".tabContainer").fadeToggle(100).css("display", "flex");
            window.location.href = "/res/theme/settings.html";
        })

        // SEARCH 
        $(".searchbar input").on("keypress", function (e) {
            if (e.which === 13) { // Enter key
                let query = $(this).val().trim();
                if (!query) return;

                let url;

                // Check if input looks like a URL
                if (query.match(/^https?:\/\//)) {
                    url = query;
                } else if (query.match(/\.[a-z]{2,}$/i)) {
                    if (!query.startsWith("http://") && !query.startsWith("https://")) {
                        url = "http://" + query;
                    } else {
                        url = query;
                    }
                } else {
                    switch (data.settings.searchEngine) {
                        case "bing":
                            url = "https://www.bing.com/search?q=" + encodeURIComponent(query);
                            break;
                        case "duckduckgo":
                            url = "https://duckduckgo.com/?q=" + encodeURIComponent(query);
                            break;
                        case "yandex":
                            url = "https://yandex.com/search/?text=" + encodeURIComponent(query);
                            break;
                        default: // google
                            url = "https://www.google.com/search?q=" + encodeURIComponent(query);
                    }
                }

                window.location.href = url;
            }
        });

        console.log("Theme JS Loaded");

        // Add smooth transition to UI elements
        $("#time, #date, .searchbar").css("opacity", "0").addClass("fade-in");

        $(document).ready(function () {
            $(".searchbar input").focus();
        });

        // THEME 5 BLOBS - PREMIUM EDITION
        if (selectedTheme === "theme5") {
            const canvas = document.getElementById('canvas-blobs');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                let width, height;
                let blobs = [];
                let config = {
                    blobCount: 4,
                    speed: 0.8,
                    blobSize: 350,
                    colors: ['#2986cc', '#00d4ff', '#7928ca', '#ff0080'],
                    background: "#02040a",
                    bgGradientColors: ["#02040a", "#050b1a", "#011627"],
                    animateBackground: true,
                    bgRotationSpeed: 0.002
                };

                // Use the configured blue or defaults
                $.getJSON("/res/theme/theme5/theme5.json", function (ext) {
                    config = Object.assign(config, ext);
                    $("#theme5-container").css("background", config.background);
                });

                let mouse = { x: -1000, y: -1000 };
                let bgTime = 0;

                class Blob {
                    constructor(color) {
                        this.color = color;
                        this.init();
                    }

                    init() {
                        this.x = Math.random() * width;
                        this.y = Math.random() * height;
                        this.radius = Math.random() * 150 + config.blobSize;
                        this.vx = (Math.random() - 0.5) * config.speed;
                        this.vy = (Math.random() - 0.5) * config.speed;
                        this.angle = Math.random() * Math.PI * 2;
                    }

                    update() {
                        // Organic Wandering
                        this.angle += (Math.random() - 0.5) * 0.1;
                        this.vx += Math.cos(this.angle) * 0.05 * config.speed;
                        this.vy += Math.sin(this.angle) * 0.05 * config.speed;

                        // Subtle Mouse Attraction
                        const dx = mouse.x - this.x;
                        const dy = mouse.y - this.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 800) {
                            this.vx += dx * 0.0001;
                            this.vy += dy * 0.0001;
                        }

                        // Hard friction to keep it slow and premium
                        this.vx *= 0.98;
                        this.vy *= 0.98;

                        this.x += this.vx;
                        this.y += this.vy;

                        // Wrap around edges
                        const m = this.radius;
                        if (this.x < -m) this.x = width + m;
                        if (this.x > width + m) this.x = -m;
                        if (this.y < -m) this.y = height + m;
                        if (this.y > height + m) this.y = -m;
                    }

                    draw() {
                        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
                        gradient.addColorStop(0, this.color);
                        gradient.addColorStop(0.5, this.color + "44");
                        gradient.addColorStop(1, 'transparent');

                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

                function resize() {
                    width = canvas.width = window.innerWidth;
                    height = canvas.height = window.innerHeight;
                }

                function animate() {
                    ctx.clearRect(0, 0, width, height);

                    if (config.animateBackground) {
                        bgTime += config.bgRotationSpeed;
                        const x = 50 + Math.cos(bgTime) * 15;
                        const y = 50 + Math.sin(bgTime * 0.8) * 15;
                        const bgColors = config.bgGradientColors;
                        const gradientStr = `radial-gradient(circle at ${x}% ${y}%, ${bgColors[2]}, ${bgColors[1]}, ${bgColors[0]})`;
                        $("#theme5-container").css("background", gradientStr);
                    }

                    ctx.globalCompositeOperation = 'screen';
                    blobs.forEach(blob => {
                        blob.update();
                        blob.draw();
                    });
                    ctx.globalCompositeOperation = 'source-over';

                    requestAnimationFrame(animate);
                }

                window.addEventListener('resize', resize);
                window.addEventListener('mousemove', (e) => {
                    mouse.x = e.pageX;
                    mouse.y = e.pageY;
                });

                resize();
                for (let i = 0; i < config.blobCount; i++) {
                    blobs.push(new Blob(config.colors[i % config.colors.length]));
                }
                animate();
            }

            $("#settings-btn").click(function () {
                window.location.href = "/res/theme/settings.html";
            });
        }

        $("#settings-btn").click(function () {
            window.location.href = "/res/theme/settings.html";
        });


    }

});





// WIDGETS JS
$(document).ready(function () {

    let key = "quicktab";
    let data = JSON.parse(localStorage.getItem(key)) || {};


    ////////// BOOKMARKS //////////
    function bookmarks() {
        $(".bookmark-body").empty();
        let bookmarks = data.bookmarks;
        for (let i = 0; i < bookmarks.length; i++) {
            let name = bookmarks[i].name;
            let link = bookmarks[i].url;
            // console.log("Name :"+name, "Link :"+link);
            $("#bookmark-body").append(`
                <a class="bookmark-option" href="${link}">
                    <img src="https://www.google.com/s2/favicons?domain=${link}&size=128" alt="${name}">
                    <p class="bookmark-value">${name}</p>
                </a>`);
        }
    }
    bookmarks();
    $("#manageBookmarkBtn").click(function () {
        window.location.href = "/res/theme/settings.html#bookmarks";
    });

    ////////// TO DO LIST //////////
    function todo() {
        function getTasks() {
            return data.todo || [];
        }

        function saveTasks(tasks) {
            data.todo = tasks;
            localStorage.setItem(key, JSON.stringify(data));
        }

        function generateId() {
            return 't_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        }

        function addTask(taskName) {
            const tasks = getTasks();
            const task_id = generateId();
            tasks.push({ id: task_id, name: taskName, completed: false });
            saveTasks(tasks);

            const $li = $(`
            <li style="display:none;" data-id="${task_id}">
                <div class="todo-task">
                    <span class="todo-check"></span>
                    <input class="taskName" data-id="${task_id}" value="${taskName}" readonly>
                </div>
                <img src="../res/logo/close.svg" class="deleteTask" alt="delete">
            </li>
        `);
            $('.todo-body ul').append($li);
            $li.slideDown(200);
        }

        function removeTask(task_id) {
            let tasks = getTasks();
            tasks = tasks.filter(t => t.id !== task_id);
            saveTasks(tasks);

            const $li = $(`li[data-id='${task_id}']`);
            $li.slideUp(200, function () {
                $(this).remove();
            });
        }

        function toggleTaskCompletion(task_id) {
            const tasks = getTasks();
            const task = tasks.find(t => t.id === task_id);
            if (task) {
                task.completed = !task.completed;
                saveTasks(tasks);
                displayTasks();
            }
        }

        function displayTasks() {
            const tasks = getTasks();
            const $list = $('.todo-body ul');
            $list.empty();
            tasks.forEach(task => {
                const $li = $(`
                <li data-id="${task.id}">
                    <div class="todo-task">
                        <span class="todo-check ${task.completed ? 'completed' : ''}"></span>
                        <input class="taskName ${task.completed ? 'completed' : ''}" data-id="${task.id}" value="${task.name}" readonly>
                    </div>
                    <img src="../res/logo/close.svg" class="deleteTask" alt="delete">
                </li>
            `);
                $list.append($li);
            });
        }

        // Toggle completion
        $('.todo-body ul').off("click", ".todo-check").on('click', '.todo-check', function () {
            const task_id = $(this).closest('li').data('id');
            toggleTaskCompletion(task_id);
        });

        // Delete task
        $('.todo-body ul').off("click", ".deleteTask").on('click', '.deleteTask', function () {
            const task_id = $(this).closest('li').data('id');
            removeTask(task_id);
        });

        // Add task button
        $('#addTaskBtn').off("click").on('click', function () {
            const taskName = $('#taskName').val().trim();
            if (taskName) {
                addTask(taskName);
                $('#taskName').val('');
            } else {
                alert('Please enter a task name.');
            }
        });

        // Delete all tasks
        $("#deleteAllTaskBtn").off("click").on('click', function () {
            if (confirm("Reset all tasks ?")) {
                data.todo = [];
                localStorage.setItem(key, JSON.stringify(data));
                displayTasks();
            }
        })

        // Enter key on input
        $('#taskName').off("keypress").on('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const taskName = $(this).val().trim();
                if (taskName) {
                    addTask(taskName);
                    $(this).val('');
                } else {
                    alert('Please enter a task name.');
                }
            }
        });

        // Click to Copy 
        $('.todo-body ul').on('click', '.taskName', function (e) {
            // Only copy if not in edit mode (readonly is true)
            if ($(this).attr('readonly')) {
                const text = $(this).val();
                navigator.clipboard.writeText(text).then(() => {
                    const $li = $(this).closest('li');
                    $li.css('background-color', 'rgba(255, 255, 255, 0.2)');
                    setTimeout(() => {
                        $li.css('background-color', '');
                    }, 200);
                });
            }
        });

        // EDIT TASK 
        $(".todo-body ul").on("dblclick", ".taskName", function () {
            $(this).attr("readonly", false);
            $(this).focus();
        });
        $(".todo-body ul").on("blur", ".taskName", function () {
            $(this).attr("readonly", true);
            let task_id = $(this).closest("li").data("id");
            let taskName = $(this).val().trim();
            if (taskName) {
                data.todo.forEach((t) => {
                    if (t.id == task_id) {
                        t.name = taskName;
                    }
                })
                localStorage.setItem(key, JSON.stringify(data));
                displayTasks();
            }
        })

        displayTasks();
    }



    ////////// NOTEPAD //////////
    function notepad() {
        const $notepad = $('#notepad');
        const $notepadPreview = $('#notepadPreview');
        const $resetBtn = $('#resetBtn');
        const $exportBtn = $('#exportBtn');
        const $exportMDBtn = $('#exportMDBtn');
        const $togglePreviewBtn = $('#togglePreviewBtn');
        const $toggleSplitBtn = $('#toggleSplitBtn');
        const $fullScreenBtn = $('#fullScreenBtn');
        const $notepadContainer = $('.notepad-container');
        const $notepadBody = $('.notepad-body');

        // Load saved content
        if (data.notepad.content) {
            $notepad.val(data.notepad.content);
        }

        let isSplit = false;
        let isPreview = false;
        let isFullScreen = false;

        // Autosave on input & Realtime Preview
        $notepad.on('input', function () {
            data.notepad.content = $notepad.val();
            localStorage.setItem(key, JSON.stringify(data));

            if (isSplit || isPreview) {
                const markdownText = $notepad.val();
                const htmlContent = marked.parse(markdownText);
                $notepadPreview.html(htmlContent);
            }
        });

        // Toggle Full Screen
        $fullScreenBtn.on('click', function () {
            isFullScreen = !isFullScreen;
            const $widgetContainer = $('#widget-container');

            $notepadContainer.toggleClass('full-screen');
            $notepadBody.toggleClass('full-screen');
            $widgetContainer.toggleClass('notepad-expanded');

            if (isFullScreen) {
                window.scrollTo(0, document.body.scrollHeight);
                $(this).attr('src', 'res/logo/compress.svg');
            } else {
                window.scrollTo(0, document.body.scrollHeight);
                $(this).attr('src', 'res/logo/expand.svg');
            }
        });

        // Toggle Split View (Switch Logic)
        $toggleSplitBtn.on('change', function () {
            isSplit = $(this).is(':checked');
            const $wrapper = $('.widget-wrapper');

            if (isSplit) {
                $notepadContainer.addClass('split-active');
                $notepadBody.addClass('split-active');
                $wrapper.addClass('split-mode');

                // Show both
                $notepad.show();
                $notepadPreview.show();

                // Render content
                const markdownText = $notepad.val();
                $notepadPreview.html(marked.parse(markdownText));

                // Reset Preview Mode state if it was active
                if (isPreview) {
                    isPreview = false;
                    $togglePreviewBtn.attr('src', 'res/logo/play.svg');
                }
            } else {
                $notepadContainer.removeClass('split-active');
                $notepadBody.removeClass('split-active');
                $wrapper.removeClass('split-mode');

                // Return to normal Edit mode
                $notepad.show();
                $notepadPreview.hide();
            }
        });

        // Toggle Preview (Single View)
        $togglePreviewBtn.on('click', function () {
            // If Split is active, turn it off first
            if (isSplit) {
                isSplit = false;
                $notepadContainer.removeClass('split-active');
                $notepadBody.removeClass('split-active');
                $('.widget-wrapper').removeClass('split-mode');
                $toggleSplitBtn.removeClass('active');
            }

            if (!isPreview) {
                // Switch to Full Preview
                const markdownText = $notepad.val();
                const htmlContent = marked.parse(markdownText);
                $notepadPreview.html(htmlContent);

                $notepad.hide();
                $notepadPreview.show();
                $(this).attr('src', 'res/logo/edit.svg');
                isPreview = true;
            } else {
                // Switch to Edit
                $notepadPreview.hide();
                $notepad.show();
                $(this).attr('src', 'res/logo/play.svg');
                isPreview = false;
            }
        });

        // Editor/Preview Sync on Reset
        function updatePreviewIfActive() {
            if (isPreview || isSplit) {
                const markdownText = $notepad.val();
                const htmlContent = marked.parse(markdownText);
                $notepadPreview.html(htmlContent);
            }
        }

        // Export notepad content (Original Save - TXT)
        $exportBtn.on('click', function () {
            const textToSave = $notepad.val();
            const blob = new Blob([textToSave], { type: "text/plain;charset=utf-8" });
            saveAs(blob, "QuickTab Note.txt");
        });

        // Export as Markdown (New Export - MD)
        $exportMDBtn.on('click', function () {
            const textToSave = $notepad.val();
            const blob = new Blob([textToSave], { type: "text/markdown;charset=utf-8" });
            saveAs(blob, "QuickTab Note.md");
        });

        function saveAs(blob, fileName) {
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        }

        // Reset button (Clear)
        $resetBtn.on('click', function () {
            let confirmReset = window.confirm("Clear Notepad?");
            if (confirmReset) {
                $notepad.val('');
                data.notepad.content = '';
                localStorage.setItem(key, JSON.stringify(data));
                updatePreviewIfActive();
            }
        });
    }


    ////////// CALCULATOR //////////
    function calculator() {
        const calcInput = $('#calcInput');
        const calcResult = $('#calcResult');

        // Simple CSP-safe parser
        function safeEval(expr) {
            // Allow only numbers, operators and parentheses
            if (!/^[0-9+\-*/().\s]+$/.test(expr)) throw "Invalid expression";

            // Tokenize
            let tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/|\(|\))/g);
            if (!tokens) throw "Invalid";

            // Shunting-yard algorithm for safe eval
            let output = [];
            let ops = [];
            const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
            tokens.forEach(t => {
                if (!isNaN(t)) output.push(parseFloat(t));
                else if (['+', '-', '*', '/'].includes(t)) {
                    while (ops.length && precedence[ops[ops.length - 1]] >= precedence[t]) {
                        output.push(ops.pop());
                    }
                    ops.push(t);
                } else if (t === '(') ops.push(t);
                else if (t === ')') {
                    while (ops.length && ops[ops.length - 1] !== '(') output.push(ops.pop());
                    if (ops[ops.length - 1] === '(') ops.pop();
                }
            });
            while (ops.length) output.push(ops.pop());

            // Evaluate RPN
            let stack = [];
            output.forEach(tok => {
                if (typeof tok === 'number') stack.push(tok);
                else {
                    let b = stack.pop();
                    let a = stack.pop();
                    if (tok === '+') stack.push(a + b);
                    if (tok === '-') stack.push(a - b);
                    if (tok === '*') stack.push(a * b);
                    if (tok === '/') stack.push(a / b);
                }
            });
            if (stack.length !== 1) throw "Error";
            return stack[0];
        }

        // Input event
        calcInput.on("input", function () {
            const expr = calcInput.val().trim();
            if (!expr) {
                calcResult.text('');
                return;
            }
            try {
                let res = safeEval(expr);
                calcResult.text(res);
            } catch (e) {
                calcResult.text('= ...');
            }
        });

        // Enter key → fill input
        calcInput.on('keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                calcInput.val(calcResult.text());
            }
        });

        // Escape → clear
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                calcInput.val('');
                calcResult.text('');
            }
        });
    }




    function calendar() {
        const $prevMonth = $('#prevMonth');
        const $nextMonth = $('#nextMonth');
        const $currentMonth = $('#currentMonth');
        const $daysContainer = $('.days');

        let today = new Date();
        let currentYear = today.getFullYear();
        let currentMonthIndex = today.getMonth();

        renderCalendar(currentYear, currentMonthIndex);

        $prevMonth.on('click', function () {
            currentMonthIndex--;
            if (currentMonthIndex < 0) {
                currentMonthIndex = 11;
                currentYear--;
            }
            renderCalendar(currentYear, currentMonthIndex);
        });

        $nextMonth.on('click', function () {
            currentMonthIndex++;
            if (currentMonthIndex > 11) {
                currentMonthIndex = 0;
                currentYear++;
            }
            renderCalendar(currentYear, currentMonthIndex);
        });

        function renderCalendar(year, month) {
            $daysContainer.empty();
            $currentMonth.text(getMonthName(month) + ' ' + year);

            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                $('<div>').addClass('empty-day').appendTo($daysContainer);
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const $day = $('<div>').addClass('day').text(i);
                if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    $day.addClass('current-date');
                }
                $daysContainer.append($day);
            }
        }

        function getMonthName(index) {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months[index];
        }
        // console.log("Calendar Ran")
    };



    // NOTEPAD PLACEHOLDER QUOTES
    // function quotes(){
    //     const category = 'inspirational';``
    //     const apiKey = ''; // Replace with your actual API key
    //     const apiUrl = `https://api.api-ninjas.com/v1/quotes?category=${category}`;
    //     const placeholder = document.getElementById('notepad'); // Make sure you have an element with this ID

    //     fetch(apiUrl, {
    //         method: 'GET',
    //         headers: {
    //             'X-Api-Key': apiKey,
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok ' + response.statusText);
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         // console.log(data);
    //         if (data.length > 0) {
    //             placeholder.placeholder = data[0].quote + " - " + data[0].author;
    //         } else {
    //             placeholder.placeholder = "No quote found.";
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //         placeholder.placeholder = "An error occurred ! - Developer.";
    //     });
    // }

    function initMediaController() {

        // CONTROLS
        const playPauseBtn = document.getElementById("playPauseBtn");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");

        const timeCurrent = document.getElementById("timeCurrent");
        const timeDuration = document.getElementById("timeDuration");

        const progressBar = document.getElementById("progressBar");
        const progressScrubber = document.getElementById("progressScrubber");

        const playPauseIcon = document.getElementById("playPauseIcon");

        let isPlaying = true;

        // SEND COMMANDS TO BACKGROUND
        function sendAction(action, value = null) {
            if (chrome.runtime?.id) {
                chrome.runtime.sendMessage({
                    type: "MEDIA_CONTROL",
                    action: action,
                    value: value
                }).catch(err => {
                    console.warn("Background script not ready.");
                });
            }
        }

        // PLAY / PAUSE
        playPauseBtn.addEventListener("click", () => {
            sendAction("togglePlay");
        });

        // PREV
        prevBtn.addEventListener("click", () => {
            sendAction("prev");
        });

        // NEXT
        nextBtn.addEventListener("click", () => {
            sendAction("next");
        });


        // RECEIVE updates from YouTube tab
        chrome.runtime.onMessage.addListener((msg) => {

            if (msg.type === "MEDIA_UPDATE") {

                let current = msg.currentTime || 0;
                let duration = msg.duration || 0;
                let paused = msg.paused;
                let title = msg.title || "YouTube Player";

                // TITLE
                document.getElementById("mediaTitle").innerText = title;

                // TIME
                timeCurrent.innerText = formatTime(current);
                timeDuration.innerText = formatTime(duration);

                // PROGRESS BAR
                let percent = duration ? (current / duration) * 100 : 0;

                progressBar.style.width = percent + "%";
                progressScrubber.style.left = percent + "%";

                // PLAY/PAUSE ICON SYNC
                if (paused) {
                    playPauseIcon.src = "res/logo/media/play.svg";
                    playPauseBtn.title = "Play";
                    isPlaying = false;
                } else {
                    playPauseIcon.src = "res/logo/media/pause.svg";
                    playPauseBtn.title = "Pause";
                    isPlaying = true;
                }
            }

        });

        // SEEKING
        const progressContainer = document.getElementById("progressContainer");
        progressContainer.addEventListener("click", (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            sendAction("seek", pos);
        });

    }

    function formatTime(sec) {
        if (!sec || isNaN(sec)) return "0:00";

        let m = Math.floor(sec / 60);
        let s = Math.floor(sec % 60);

        return `${m}:${s < 10 ? "0" + s : s}`;
    }

    // 🚀 auto init
    // document.addEventListener("DOMContentLoaded", initMediaController);

    todo();
    notepad();
    calculator();
    calendar();
    initMediaController();

    // quotes();
    console.log("widgets.js Loaded");

})



