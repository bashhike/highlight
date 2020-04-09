/* initialise variables */

var inputTitle = document.querySelector('.new-note textarea');
var inputBody = document.querySelector('.new-note input');

var noteContainer = document.querySelector('.note-container');


var clearBtn = document.querySelector('.clear');
var addBtn = document.querySelector('.add');

/*  add event listeners to buttons */

addBtn.addEventListener('click', addNote);
clearBtn.addEventListener('click', clearAll);

/* generic error handler */
function onError(error) {
  console.log(error);
}

/* display previously-saved stored notes on startup */

initialize();

function initialize() {
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var noteKeys = Object.keys(results);
    for (let noteKey of noteKeys) {
      var curValue = results[noteKey];
      displayNote(noteKey,curValue);
    }
  }, onError);
}

/* Add a note to the display, and storage */

function addNote() {
  var noteTitle = inputTitle.value;
  var noteBody = inputBody.value;
  var gettingItem = browser.storage.local.get(noteTitle);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1 && noteTitle !== '' && noteBody !== '') {
      inputTitle.value = '';
      inputBody.value = '';
      storeNote(noteTitle,noteBody);
    }
  }, onError);
}

/* function to store a new note in storage */

function storeNote(title, body) {
  var storingNote = browser.storage.local.set({ [title] : body });
  storingNote.then(() => {
    displayNote(title,body);
  }, onError);
}

/* function to display a note in the note box */

function displayNote(title, body) {

  /* create note display box */
  var note = document.createElement('div');
  var noteDisplay = document.createElement('div');
  var noteH = document.createElement('p');
  var notePara = document.createElement('a');
  var deleteBtn = document.createElement('button');
  var clearFix = document.createElement('div');

  note.setAttribute('class','note');
  noteDisplay.setAttribute('class', 'noteDisplay w3-display-container w3-panel w3-white');
  notePara.setAttribute('class', 'w3-text-blue w3-small')

  noteH.innerHTML = title.replace(/(?:\r\n|\r|\n)/g, '<br/>');
  notePara.textContent = body;
  notePara.href = body;
  // Open in new tab.
  notePara.target = "_blank";

  deleteBtn.setAttribute('class','delete w3-display-bottomright w3-margin');
  deleteBtn.textContent = 'Delete note';
  clearFix.setAttribute('class','clearfix');

  noteDisplay.appendChild(noteH);
  noteDisplay.appendChild(notePara);
  noteDisplay.appendChild(deleteBtn);
  noteDisplay.appendChild(clearFix);

  note.appendChild(noteDisplay);

  /* set up listener for the delete functionality */

  deleteBtn.addEventListener('click',(e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
    browser.storage.local.remove(title);
  })

  /* create note edit box */
  var noteEdit = document.createElement('div');
  var noteTitleEdit = document.createElement('textarea');
  var noteBodyEdit = document.createElement('input');
  var clearFix2 = document.createElement('div');

  var updateBtn = document.createElement('button');
  var cancelBtn = document.createElement('button');

  noteEdit.setAttribute('class', 'noteEdit w3-display-container w3-panel w3-white')
  noteTitleEdit.setAttribute('class', 'w3-input')
  noteBodyEdit.setAttribute('class', 'w3-input')

  updateBtn.setAttribute('class','update w3-margin');
  updateBtn.textContent = 'Update note';
  cancelBtn.setAttribute('class','cancel w3-margin');
  cancelBtn.textContent = 'Cancel update';

  noteEdit.appendChild(noteTitleEdit);
  noteTitleEdit.textContent = title;
  noteEdit.appendChild(noteBodyEdit);
  noteBodyEdit.value = body;
  noteEdit.appendChild(updateBtn);
  noteEdit.appendChild(cancelBtn);

  noteEdit.appendChild(clearFix2);
  clearFix2.setAttribute('class','clearfix');


  note.appendChild(noteEdit);

  noteContainer.appendChild(note);
  noteEdit.style.display = 'none';

  /* set up listeners for the update functionality */

  noteH.addEventListener('click',() => {
    noteDisplay.style.display = 'none';
    noteEdit.style.display = 'block';
  })

  // notePara.addEventListener('click',() => {
  //   noteDisplay.style.display = 'none';
  //   noteEdit.style.display = 'block';
  // }) 

  cancelBtn.addEventListener('click',() => {
    noteDisplay.style.display = 'block';
    noteEdit.style.display = 'none';
    noteTitleEdit.value = title;
    noteBodyEdit.value = body;
  })

  updateBtn.addEventListener('click',() => {
    if(noteTitleEdit.value !== title || noteBodyEdit.value !== body) {
      updateNote(title,noteTitleEdit.value,noteBodyEdit.value);
      note.parentNode.removeChild(note);
    } 
  });
}


/* function to update notes */

function updateNote(delNote,newTitle,newBody) {
  var storingNote = browser.storage.local.set({ [newTitle] : newBody });
  storingNote.then(() => {
    if(delNote !== newTitle) {
      var removingNote = browser.storage.local.remove(delNote);
      removingNote.then(() => {
        displayNote(newTitle, newBody);
      }, onError);
    } else {
      displayNote(newTitle, newBody);
    }
  }, onError);
}

/* Clear all notes from the display/storage */

function clearAll() {
  while (noteContainer.firstChild) {
      noteContainer.removeChild(noteContainer.firstChild);
  }
  browser.storage.local.clear();
}
