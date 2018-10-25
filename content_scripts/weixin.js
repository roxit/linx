function weixin() {
  let text = '', user = '', site = '';
  let el = document.querySelector('#activity-name')
  if (el) {
    text = el.innerText;
  }
  el = document.querySelector('#meta_content #js_author_name');
  if (el) {
    user = '@' + el.innerText;
  }
  el = document.querySelector('#meta_content #js_name');
  if (el) {
    site = '@' + el.innerText;
  }
  return {
    text: text,
    user: user,
    site: site
  }
}

weixin();