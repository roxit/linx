function getCurrentTab() {
  return new Promise((resolv, reject) => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      resolv(tabs[0]);
    });
  })
}

function escapeHTML(str) {
    // https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
    // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
    // Most often this is not the case though.
    return String(str)
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function transHostname(h) {
  var splits = h.split('.');
  if (splits.length == 3 && ['www', 'blog'].includes(splits[0])) {
    return splits.slice(1).join('.');
  }
  return h;
}

function getSuffix(url) {
  return ' | ' + transHostname(url.hostname);
}

function ruleDefault(tab, url, title) {
  return new Promise((resolv, reject) => {
    // https://www.mozilla.org/en-US/firefox/
    var suffix = getSuffix(url);
    var t = title + suffix;
    resolv([LinkItem(url.href, title), LinkItem(url.href, t), LinkItem(url.href), TextItem(title)]);
  });
}

function ruleReplace(tab, url, title, pattern, replacement, appendSuffix = false) {
  return new Promise((resolv, reject) => {
    var newTitle = title.replace(pattern, replacement);
    if (appendSuffix) {
      newTitle = newTitle + getSuffix(url);
    }
    resolv([LinkItem(url.href, newTitle), LinkItem(url.href), TextItem(newTitle)]);
  });
}

function ruleBlogspot(tab, url, title) {
  // https://meanderful.blogspot.com.br/2017/05/oh-my-more-lions-radios-and-cables.html
  return new Promise((resolv, reject) => {
    var hostname = url.hostname.replace(/\.blogspot(\.[^.]+)+$/, '.blogspot.com')
    console.log(hostname);
    var href = url.protocol + '//' + hostname + url.pathname;
    var t = title + ' | ' + hostname;
    resolv([LinkItem(href, title), LinkItem(href, t), LinkItem(href)]);
  });
}

function ruleWiki(tab, url, title) {
  return new Promise((resolv, reject) => {
    var t;
    if (url.hostname == 'en.wikipedia.org') {
      // https://en.wikipedia.org/wiki/Wiki
      t = title.replace(' - Wikipedia', '');
    }
    if (url.hostname == 'zh.wikipedia.org') {
      // https://zh.wikipedia.org/wiki/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91
      title = title.replace('，自由的百科全书', '');
      t = title.replace(' - 维基百科', '');
    }
    if (url.hostname == 'en.wikivoyage.org') {
      // https://en.wikivoyage.org/wiki/Shanghai
      title = title.replace('Travel guide at ', '');
      t = title.replace(' – Wikivoyage', '');
    }
    if (url.hostname == 'zh.wikivoyage.org') {
      // https://zh.wikivoyage.org/wiki/%E4%B8%8A%E6%B5%B7
      title = title.replace('来自维基导游的旅行指南', '维基导游');
      t = title.replace(' - 维基导游', '');
    }
    resolv([LinkItem(url.href, title), LinkItem(url.href, t), LinkItem(url.href), TextItem(t)]);
  });
}

function itemWrapper(el) {
  var d = document.createElement('div');
  d.classList.add('linx-item-container');
  d.append(el);
  return d;
}

function LinkItem(href, text = null) {
  var a = document.createElement('a');
  a.href = href;
  if (text == null) {
    a.text = href;
  } else {
    a.text = text;
  }
  a.classList.add('linx-item');
  a.contentEditable = true;
  a.addEventListener('click', copyItem);
  return itemWrapper(a);
}

function TextItem(text) {
  var p = document.createElement('p');
  p.innerText = text;
  p.contentEditable = true;
  p.addEventListener('click', copyItem);
  p.classList.add('linx-item');
  return itemWrapper(p);
}

function IndentedItem(url, ...paragraphs) {
  var d = document.createElement('div');
  d.classList.add('linx-item');
  d.contentEditable = true;
  d.addEventListener('click', copyItem);
  var p = document.createElement('p');
  var a = document.createElement('a');
  a.href = url;
  a.text = url;
  p.appendChild(a);
  d.appendChild(a);
  for (var i = 0; i < paragraphs.length; i++) {
    p = document.createElement('p');
    p.style.marginLeft = '0.375in';
    var s = document.createElement('span');
    s.innerText = paragraphs[i];
    p.appendChild(s);
    d.appendChild(p);
  }
  return itemWrapper(d);
}

function ruleWeibo(tab, url, title) {
  return new Promise((resolv, reject) => {
    if (url.pathname == '/ttarticle/p/show') {
      // https://weibo.com/ttarticle/p/show?id=2309404200442107174498
      var params = url.searchParams;
      var p = new URLSearchParams();
      p.append('id', params.get('id'));
      var href = url.protocol + '//' + url.hostname + url.pathname + '?' + p.toString();
      resolv([LinkItem(href, title + ' | weibo'), LinkItem(href)]);
    }
    // https://weibo.com/1852299857/G1gDN5btF?ref=collection&rid=5_0_0_3071696340287161361
    // https://weibo.com/2020604851/G34Ca8qLB?ref=collection&rid=5_0_0_2606722991865294583&type=comment
    browser.tabs.executeScript({
      file: "/content_scripts/weibo.js"
    }).then((result) => {
      href = url.protocol + '//' + url.hostname + url.pathname;
      content = result[0];
      var items = [], item;
      item = IndentedItem(href, content.text)
      items.push(item);
      if (content.oText != null) {
        items.push(IndentedItem(href, content.text, content.oText));
      }
      items.push(LinkItem(href));
      items.push(TextItem(content.text))
      resolv(items);
    })
  });
}

function ruleWeixin(tab, url, title) {
  return new Promise((resolv, reject) => {
    // https://mp.weixin.qq.com/s/-vHLeu3ML7gX8ADeXzDpwA
    // https://mp.weixin.qq.com/s?__biz=MzI3NjczODk1MQ==&mid=2247483671&idx=1&sn=910d3ea82cc26de41b3a68bb62175db6&chksm=eb71a7ffdc062ee9a2f961e3187f58c3320da18dd363f414acbb80f722ed12993a0e5f54f6a6&scene=21#wechat_redirect
    var params = url.searchParams;
    var href = url.href;
    if (params.has('idx')) {
      var p = new URLSearchParams();
      var keys = ['__biz', 'mid', 'idx', 'sn'];
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        p.append(k, params.get(k));
      }
      var href = url.protocol + '//' + url.hostname + url.pathname + '?' + unescape(p.toString());
    }
    resolv([href, title + ' | weixin']);
  });
}

function route(tab) {
  var url = new URL(tab.url);
  var title = tab.title;
  var domain = url.hostname.split('.').slice(-2)[0];
  if (url.hostname == 'weibo.com') {
    return ruleWeibo(tab, url, title);
  }
  if (url.hostname == 'mp.weixin.qq.com') {
    return ruleWeixin(tab, url, title);
  }

  if (domain == 'blogspot' || url.hostname.split('.')[1] == 'blogspot') {
    return ruleBlogspot(tab, url, title);
  }
  if (url.hostname == 'www.reddit.com') {
    // https://www.reddit.com/r/travel/comments/546y7h/on_a_relatively_clear_day_shanghai_is_astounding/
    var i = title.lastIndexOf(' ');
    t = title.slice(0, i) + ' r/' + title.slice(i+1);
    return ruleReplace(tab, url, title, /.*/, t);
  }
  if (domain == 'wikipedia' || domain == 'wikivoyage') {
    return ruleWiki(tab, url, title);
  }

  if (url.hostname == 'coolshell.cn') {
    // https://coolshell.cn/articles/9104.html
    return ruleReplace(tab, url, title, ' | | 酷 壳 - CoolShell', ' | CoolShell');
  }
  if (url.hostname == 'www.infoq.com') {
    // https://www.infoq.com/articles/The-OpenJDK9-Revised-Java-Memory-Model
    return ruleReplace(tab, url, title, '', '', true);
  }
  if (url.hostname == 'blog.kubernetes.io') {
    // http://blog.kubernetes.io/2017/02/inside-jd-com-shift-to-kubernetes-from-openstack.html
    return ruleReplace(tab, url, title, /^Kubernetes: /, '', true);
  }
  if (url.hostname == 'blog.scottlowe.org') {
    // blog.scottlowe.org/2012/10/19/link-aggregation-and-lacp-with-open-vswitch/
    return ruleReplace(tab, url, title, ' - The weblog of an IT pro specializing in cloud computing, virtualization, and networking, all with an open source view', '');
  }
  return ruleDefault(tab, url, title);
}

function updateView(items) {
  var els = document.querySelector('#links');
  for (var i = 0; i < items.length; i++) {
    els.appendChild(items[i]);
  }
}

function linx() {
  getCurrentTab().then(
    (tab) => {
      return route(tab);
    }
  ).then(
    (items) => {
      updateView(items);
    }
  );
}

linx();

function copyItem(ev) {
  var el = ev.target;
  // https://stackoverflow.com/questions/6139107/programmatically-select-text-in-a-contenteditable-html-element
  var range = document.createRange();
  range.selectNodeContents(el);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  document.execCommand('copy');
}