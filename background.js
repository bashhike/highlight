browser.contextMenus.create({
    id: "save-selection",
    title: "Save selection",
    contexts: ["selection", "tab"],
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "save-selection") {
        // Examples: text and HTML to be copied.
        const text = info.selectionText;
        console.log(text);
        // Always HTML-escape external input to avoid XSS.
        const pageUrl = escapeHTML(tab.url);
        console.log(pageUrl);

        addNote(text, pageUrl);
      }
});

// Add listener to open the quicknote.html file in new tab whenever the extension is clicked. 
browser.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "popup/quicknote.html";
    browser.tabs.create({ url: newURL });
});

/* generic error handler */
function onError(error) {
  console.log(error);
}
/* Add a note to the display, and storage */

function addNote(noteTitle, noteBody) {
  var gettingItem = browser.storage.local.get(noteTitle);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1 && noteTitle !== '' && noteBody !== '') {
      storeNote(noteTitle,noteBody);
    }
  }, onError);
}

/* function to store a new note in storage */

function storeNote(title, body) {
  var storingNote = browser.storage.local.set({ [title] : body });
  storingNote.then(() => {
    console.log("Note stored.");
  }, onError);
}

// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str) {
    // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
    // Most often this is not the case though.
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}