const MEDIA_SCRIPT = "res/js/media.js";

async function injectMediaScript(tabId) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: [MEDIA_SCRIPT]
        });
    } catch (e) {
        // Not injectable (e.g. restricted page / file URL access not enabled).
    }
}

function isYoutubeTab(tab) {
    return tab.url && (tab.url.includes("youtube.com") || tab.url.includes("music.youtube.com"));
}

async function sendControlToTab(tab, message) {
    if (!tab) return;
    if (!isYoutubeTab(tab)) {
        await injectMediaScript(tab.id);
    }
    try {
        await chrome.tabs.sendMessage(tab.id, {
            action: message.action,
            value: message.value || null
        });
    } catch (e) {
        console.warn("Could not send message to tab.");
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // 🔥 FROM QUICKTAB UI → CONTROL MEDIA
    if (message.type === "MEDIA_CONTROL") {
        chrome.tabs.query({}, (tabs) => {

            // 🎯 prefer active/audible YouTube or YT Music tab
            let targetTab = tabs.find(tab => (tab.audible || tab.active) && isYoutubeTab(tab));
            if (!targetTab) {
                targetTab = tabs.find(tab => isYoutubeTab(tab));
            }

            // 🎯 otherwise, detect any audible tab playing local/HTML5 media
            // (e.g. an audio file opened from a file:// path)
            if (!targetTab) {
                targetTab = tabs.find(tab => tab.audible && !isYoutubeTab(tab));
                if (!targetTab) {
                    targetTab = tabs.find(tab => tab.active && !isYoutubeTab(tab));
                }
            }

            sendControlToTab(targetTab, message);
        });
    }

    // 🔄 RELAY UPDATES FROM CONTENT SCRIPT → QUICKTAB UI
    if (message.type === "MEDIA_UPDATE") {
        const fromYt = sender.tab && isYoutubeTab(sender.tab);

        const relay = function (payload) {
            chrome.runtime.sendMessage(payload).catch(function () {
                // UI might be closed or not listening, which is fine
            });
        };

        if (fromYt) {
            // YouTube always wins with priority.
            relay(Object.assign({}, message, {
                mediaOwner: "youtube",
                mediaTabId: sender.tab && sender.tab.id
            }));
        } else {
            // Local/HTML5 media update — relay only when no YouTube tab is
            // audibly playing, so both playing together never flickers.
            chrome.tabs.query({}, (tabs) => {
                const ytAudible = tabs.some(function (t) { return isYoutubeTab(t) && t.audible; });
                if (!ytAudible) {
                    relay(Object.assign({}, message, {
                        mediaOwner: "local",
                        mediaTabId: sender.tab && sender.tab.id
                    }));
                }
            });
        }
    }

    return true; // Keep channel open
});

console.log("Background script loaded");