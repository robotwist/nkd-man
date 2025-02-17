chrome.action.onClicked.addListener((tab) => {
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("about:")) {
        console.log("NK D Man cannot streak on Chrome settings pages.");
        return; // Stop execution
    }

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["content.js"]
    }).catch(err => console.error("Error executing script:", err));
});
