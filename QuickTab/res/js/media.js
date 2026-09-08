// Generic media content script — detects and controls local/HTML5 media
// (e.g. audio files opened from file:// paths). Not used on YouTube tabs.

(function () {
    if (window.__qtMediaInjected) return;
    window.__qtMediaInjected = true;

    if (location.hostname.includes("youtube.com")) return;

    let current = findActiveMedia();

    function findActiveMedia() {
        const els = document.querySelectorAll("audio, video");
        const playing = Array.prototype.find.call(els, function (el) {
            return !el.paused && !el.ended;
        });
        return playing || els[els.length - 1] || null;
    }

    function MediaTitleSources() {
        const meta = navigator.mediaSession && navigator.mediaSession.metadata;
        if (meta && meta.title) {
            return meta.artist ? meta.title + " - " + meta.artist : meta.title;
        }
        return "";
    }

    function elementSrc(el) {
        return el ? (el.currentSrc || el.src || "") : "";
    }

    function title() {
        const sessionTitle = MediaTitleSources();
        if (sessionTitle) return sessionTitle;

        const el = findActiveMedia() || current;
        const src = elementSrc(el);
        if (src && src.indexOf("file:") === 0) {
            try {
                return decodeURIComponent(src.split("/").pop() || "Local Media");
            } catch (e) {
                return src.split("/").pop() || "Local Media";
            }
        }
        return document.title || "Local Media";
    }

    function report() {
        const el = current || findActiveMedia();
        if (!el || !chrome.runtime?.id) return;
        chrome.runtime.sendMessage({
            type: "MEDIA_UPDATE",
            currentTime: el.currentTime || 0,
            duration: el.duration || 0,
            paused: el.paused,
            title: title()
        }).catch(function () { /* background not ready */ });
    }

    // Track the element that actually starts playing.
    document.addEventListener("play", function (e) {
        const t = e.target;
        if (t && (t.tagName === "AUDIO" || t.tagName === "VIDEO")) {
            current = t;
        }
    }, true);

    setInterval(report, 1000);

    chrome.runtime.onMessage.addListener(function (msg) {
        const el = current || findActiveMedia();
        if (!el) return;

        switch (msg.action) {
            case "togglePlay":
                if (el.paused) el.play();
                else el.pause();
                break;
            case "seek":
                if (msg.value !== null && el.duration) {
                    el.currentTime = msg.value * el.duration;
                }
                break;
            case "prev":
                el.currentTime = Math.max(0, el.currentTime - 10);
                break;
            case "next":
                el.currentTime = Math.min((el.duration || el.currentTime + 10), el.currentTime + 10);
                break;
            case "status":
                report();
                break;
        }
    });
})();