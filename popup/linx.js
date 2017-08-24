function getCurrentTab(cb) {
  browser.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
    var currentTab;
    if (tabs[0]) {
      currentTab = tabs[0];
      cb(currentTab);
    }
  });
}

function transURL(url) {
  if (url.hostname == 'weibo.com') {
    return url.protocol + '//' + url.hostname + url.pathname;
  }
  return url.href;
}

function processURL(tab) {
  var res = transURL(new URL(tab.url));
  var el = document.querySelector("#url");
  el.value = res;
}

function transText(text) {
  return text;
}

function processText(tab) {
  var res = transText(tab.title);
  var el = document.querySelector("#text");
  el.value = res;
}

function setLink() {
  getCurrentTab(processURL);
}

function setText() {
  getCurrentTab(processText);
}

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

setLink();
setText();