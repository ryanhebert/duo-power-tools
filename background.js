var tabs = getDuoCentralTabs();

function getDuoCentralTabs() {

  chrome.tabs.query({url: "https://*.login.duosecurity.com/central/*"}, function(results) {
    tabs = [];
    results.forEach(element => tabs.push(element.id));
    //tabs.forEach(tab => console.log(tab));
  });
  return tabs;
}

function updateTheme(tab, theme){

  if(theme === 'default') {
    chrome.tabs.reload(tab);
  }
  else{

    var stylesheet = `themes/${theme}`;

    try {
          chrome.scripting.insertCSS({
              target: {
                tabId: tab,
              },
              files: [stylesheet],
            });
          } catch (err) {
            console.error(`failed to insert CSS: ${err}`);
          }
  }
}


//Set theme on initial load
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if(tab.url.includes("login.duosecurity.com/central")){
    if (changeInfo.status == 'complete') {
      chrome.storage.sync.get().then((options) => {
        if(options.theme != 'default') {
          updateTheme(tabId, options.theme);
        }
      });
    }
  }
});

//Load scrypts.js
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if(tab.url.includes("login.duosecurity.com/email_first")){
    //if(tab.url.includes("login.duosecurity.com/")){
    if (changeInfo.status == 'complete') {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['script.js'],
      });
    }
  }
});

// Watch for changes to the user's options & apply them

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.theme?.newValue) {
    const theme = changes.theme.newValue;
    console.log('Setting theme to:', theme);

    tabs.forEach(tab => updateTheme(tab, theme));
  }
});