function getCurrentTab(cb) {
  browser.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
    var currentTab;
    if (tabs[0]) {
      currentTab = tabs[0];
      cb(currentTab.url);
    }
  });
}

function transURL(url) {
  if (url.hostname == 'weibo.com') {
    return url.protocol + '//' + url.hostname + url.pathname;
  }
  return url.href;
}

function processURL(urlStr) {
  console.log(urlStr);
  var res = transURL(new URL(urlStr));
  var el = document.querySelector("#url");
  el.value = res;
}

function setLink() {
  getCurrentTab(processURL);
}

function copyURL() {
  var el = document.querySelector("#url");
  el.focus();
  el.select();
  document.execCommand("copy");
}

document.querySelector("#url").addEventListener("click", copyURL);

setLink();