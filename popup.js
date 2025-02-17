document.getElementById("streak").addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (chrome.scripting) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                files: ["content.js"]
            });
        } else {
            chrome.tabs.executeScript(tabs[0].id, {file: "content.js"});
        }
    });
});
