var currentTab;

function getCurrentTab() {
  browser.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
    if (tabs[0]) {
      currentTab = tabs[0];
      console.log(currentTab.url);
    }
  });
}

function copyLink() {
  getCurrentTab();
  console.log("copyLink");
}

function copyText() {
  console.log("copyText");
}

browser.browserAction.onClicked.addListener(copyLink);
browser.commands.onCommand.addListener(function(command) {
  if (command == "copy-link") {
    copyLink();
  } else if (command == "copy-text") {
    copyText();
  }
})