chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // 🔥 FROM QUICKTAB UI → CONTROL MEDIA
    if (message.type === "MEDIA_CONTROL") {
        chrome.tabs.query({}, (tabs) => {
            // 🎯 find active/audible YouTube or YT Music tab
            let targetTab = tabs.find(tab => (tab.url && (tab.url.includes("youtube.com") || tab.url.includes("music.youtube.com")) && (tab.audible || tab.active)));

            if (!targetTab) {
                targetTab = tabs.find(tab => tab.url && (tab.url.includes("youtube.com") || tab.url.includes("music.youtube.com")));
            }

            if (targetTab) {
                chrome.tabs.sendMessage(targetTab.id, {
                    action: message.action,
                    value: message.value || null
                }).catch(err => {
                    console.warn("Could not send message to YouTube tab. Content script might not be loaded yet.");
                });
            }
        });
    }

    // 🔄 RELAY UPDATES FROM CONTENT SCRIPT → QUICKTAB UI
    if (message.type === "MEDIA_UPDATE") {
        // Broadcast to UI - catch error if UI is not listening
        chrome.runtime.sendMessage(message).catch(err => {
            // UI might be closed or not listening, which is fine
        });
    }

    return true; // Keep channel open
});

console.log("Background script loaded");