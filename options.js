//send message to background.js with theme option
function handleResponse(message) {
  console.log(`background script sent a response: ${message.response}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

function sendMessage(e) {
  const sending = chrome.runtime.sendMessage({content: e});
  sending.then(handleResponse, handleError);
}





// Saves options to chrome.storage
function save_options() {
  var theme = document.getElementById('theme').value;

  var changeLabel = document.getElementById('changeLabel').checked;
  var userLabel = document.getElementById('userLabel').value;

  var appendDomain = document.getElementById('appendDomain').checked;
  var domain = document.getElementById('domain').value;

  chrome.storage.sync.set({
    theme: theme,
    changeLabel: changeLabel,
    userLabel: userLabel,
    appendDomain: appendDomain,
    domain: domain
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';

    sendMessage(theme);

    //temp {type:"Fiat", model:"500", color:"white"};

    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}



// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {

  // Use default values if options aren't set
  chrome.storage.sync.get({
    theme: 'default',

    changeLabel: false,
    userLabel: null,

    appendDomain: false,
    domain: null
  }, function(items) {
    document.getElementById('theme').value = items.theme;

    document.getElementById('changeLabel').checked = items.changeLabel;
    document.getElementById('userLabel').value = items.userLabel;

    document.getElementById('appendDomain').checked = items.appendDomain;
    document.getElementById('domain').value = items.domain;

    if(items.changeLabel) {
      document.getElementById('userLabelOption').style.display = "block";
    }
    else{
      document.getElementById('userLabelOption').style.display = "none";
    }

    if(items.appendDomain) {
      document.getElementById('domainOption').style.display = "block";
    }
    else{
      document.getElementById('domainOption').style.display = "none";
    }

  });
}

function show_user_label() {

  userLabelOption =  document.getElementById('userLabelOption');

  if(document.getElementById('changeLabel').checked) {
    userLabelOption.style.display = "block";
  }
  else {
    userLabelOption.style.display = "none";
  }
}

function show_domain() {

  domainOption =  document.getElementById('domainOption');

  if(document.getElementById('appendDomain').checked) {
    domainOption.style.display = "block";
  }
  else {
    domainOption.style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('changeLabel').addEventListener('click', show_user_label);
document.getElementById('appendDomain').addEventListener('click', show_domain);