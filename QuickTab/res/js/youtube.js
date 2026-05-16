
function getPlayer() {
    return document.querySelector('video');
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    const video = getPlayer();
    if (!video) return;

    const isMusic = window.location.hostname.includes("music.youtube.com");

    switch (msg.action) {
        case "togglePlay":
            if (video.paused) video.play();
            else video.pause();
            break;
        case "prev":
            const prevBtn = isMusic 
                ? document.querySelector('.previous-button') 
                : document.querySelector('.ytp-prev-button');
            if (prevBtn) prevBtn.click();
            break;
        case "next":
            const nextBtn = isMusic 
                ? document.querySelector('.next-button') 
                : document.querySelector('.ytp-next-button');
            if (nextBtn) nextBtn.click();
            break;
        case "seek":
            if (msg.value !== null) {
                video.currentTime = msg.value * video.duration;
            }
            break;
    }
});

// Periodic update of time
setInterval(() => {
    const video = getPlayer();
    if (video && chrome.runtime?.id) {
        const isMusic = window.location.hostname.includes("music.youtube.com");
        
        chrome.runtime.sendMessage({
            type: "MEDIA_UPDATE",
            currentTime: video.currentTime,
            duration: video.duration,
            paused: video.paused,
            title: isMusic 
                ? document.querySelector('.ytmusic-player-bar .title')?.innerText || document.title.replace("- YouTube Music", "").trim()
                : document.querySelector('h1.ytd-video-primary-info-renderer, #container > h1 > yt-formatted-string')?.innerText || document.title.replace("- YouTube", "").trim()
        }).catch(err => {
            // Background script might be reloaded
        });
    }
}, 1000);
