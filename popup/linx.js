function getCurrentTab(cb) {
  browser.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
    var currentTab;
    if (tabs[0]) {
      currentTab = tabs[0];
      cb(currentTab);
    }
  });
}

function transTab(tab) {
  var url = new URL(tab.url);
  var text = tab.title;
  if (url.hostname == 'weibo.com') {
    return [url.protocol + '//' + url.hostname + url.pathname, text];
  }
  return [url.href, text];
}

function processLink(tab) {
  var res = transTab(tab);
  document.querySelector("#url").value = res[0];
  document.querySelector("#text").value = res[1];
}

function setLink() {
  getCurrentTab(processLink);
}

setLink();

function copy(query) {
  var el = document.querySelector(query);
  el.select();
  document.execCommand("copy");
}

function copyURL() {
  copy("#url");
}

function copyText() {
  copy("#text");
}

document.querySelector("#url").addEventListener("click", copyURL);
document.querySelector("#text").addEventListener("click", copyText);