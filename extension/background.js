chrome.runtime.onInstalled.addListener(() => {

    chrome.contextMenus.create({

        id: "checkDeepfake",
        title: "Check Image for Deepfake",
        contexts: ["image"]

    });

});


chrome.contextMenus.onClicked.addListener((info) => {

    if(info.menuItemId === "checkDeepfake"){

        chrome.storage.local.set({
            imageUrl: info.srcUrl
        }, () => {

            chrome.action.openPopup();

        });

    }

});