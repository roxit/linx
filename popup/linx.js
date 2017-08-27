function getCurrentTab(cb) {
  browser.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
    var currentTab;
    if (tabs[0]) {
      currentTab = tabs[0];
      cb(currentTab);
    }
  });
}

function escapeHTML(str) {
    // https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
    // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
    // Most often this is not the case though.
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
  var url = res[0];
  var text = res[1];
  document.querySelector("#url").value = url;
  document.querySelector("#text").value = text;
  var safeUrl = escapeHTML(url);
  link = `<a href="${safeUrl}">${text}</a>`;
  var el = document.querySelector('#link');
  el.href = safeUrl;
  el.text = text;
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

function copyLink() {
  var el = document.querySelector("#link");
  // https://stackoverflow.com/questions/6139107/programmatically-select-text-in-a-contenteditable-html-element
  var range = document.createRange();
  range.selectNodeContents(el);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  document.execCommand('copy');
}

document.querySelector("#url").addEventListener("click", copyURL);
document.querySelector("#text").addEventListener("click", copyText);
document.querySelector("#link").addEventListener("click", copyLink);