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
  var text0 = tab.title;
  if (url.hostname.split('.').slice(-2)[0] == 'blogspot') {
    hostname = url.hostname.replace(/\.blogspot\.[^.]+$/, '.blogspot.com')
    href = url.protocol + '//' + hostname + url.pathname;
    text1 = text0 + ' | ' + hostname;
    return [href, text0, text1];
  }
  if (url.hostname == 'www.reddit.com') {
    i = text0.lastIndexOf(' ');
    text0 = text0.slice(0, i) + ' r/' + text0.slice(i+1);
    return [url.href, text0];
  }
  if (url.hostname == 'weibo.com' && url.pathname == '/ttarticle/p/show') {
    return [url.href, text0 + ' | weibo'];
  }
  if (url.hostname == 'weibo.com') {
    return [url.protocol + '//' + url.hostname + url.pathname, text0];
  }
  if (url.hostname == 'mp.weixin.qq.com') {
    return [url.href, text0 + ' | weixin'];
  }
  if (url.hostname == 'en.wikipedia.org') {
    text1 = text0.replace(' - Wikipedia', '');
    return [url.href, text0, text1];
  }
  if (url.hostname == 'zh.wikipedia.org') {
    text0 = text0.replace('，自由的百科全书', '');
    text1 = text0.replace(' - 维基百科', '');
    return [url.href, text0, text1];
  }
  if (url.hostname == 'en.wikivoyage.org') {
    text0 = text0.replace('Travel guide at ', '');
    text1 = text0.replace(' – Wikivoyage', '');
    return [url.href, text0, text1];
  }
  if (url.hostname == 'zh.wikivoyage.org') {
    text0 = text0.replace('来自维基导游的旅行指南', '维基导游');
    text1 = text0.replace(' - 维基导游', '');
    return [url.href, text0, text1];
  }

  if (url.hostname.endsWith('brendangregg.com')) {
    text0 = text0 + ' | brendangregg.com';
    return [url.href, text0];
  }
  if (url.hostname == 'blog.cloudflare.com') {
    text0 = text0 + ' | cloudflare.com';
    return [url.href, text0];
  }
  if (url.hostname == 'coolshell.cn') {
    text0 = text0.replace(' | | 酷 壳 - CoolShell', ' - CoolShell');
    return [url.href, text0];
  }
  if (url.hostname == 'www.infoq.com') {
    text0 = text0 + ' | infoq.com';
    return [url.href, text0];
  }
  if (url.hostname == 'blog.kubernetes.io') {
    text0 = text0.replace(/^Kubernetes: /, '') + ' | kubernetes.io';
    return [url.href, text0];
  }
  if (url.hostname == 'blog.scottlowe.org') {
    text0 = text0.replace(' - The weblog of an IT pro specializing in cloud computing, virtualization, and networking, all with an open source view', '');
    return [url.href, text0];
  }

  return [url.href, text0, text1];
}

function processLink(tab) {
  var res = transTab(tab);
  var url = res[0];
  var text = res[1];
  document.querySelector("#url").value = url;
  document.querySelector("#text").value = text;
  var safeUrl = escapeHTML(url);
  for (var i = 1; i < res.length; i++) {
    var a = document.createElement('a');
    a.href = safeUrl;
    a.text = res[i];
    a.classList.add('linx-link');
    a.contentEditable = true;
    a.addEventListener('click', copyLink);
    var el = document.querySelector('#links');
    el.appendChild(a);
  }
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

function copyLink(ev) {
  var el = ev.target;
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