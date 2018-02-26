function weibo() {
  var text, user, oText, oUser, oURL;
  var el = document.querySelector('.WB_detail > .WB_text');
  text = el.innerText;
  el = document.querySelector('.WB_detail > .WB_info > a');
  user = '@' + el.innerText;
  el = document.querySelector('.WB_expand > .WB_text');
  if (el) {
    oText = el.innerText;
    el = document.querySelector('.WB_expand > .WB_info > a');
    oUser = el.innerText;
    el = document.querySelector('.WB_expand .WB_from > a[node-type=feed_list_item_date]');
    oURL = el.href;
  }

  return {
    text: text,
    user: user,
    oText: oText,
    oUser: oUser,
    oURL: oURL
  }
}

weibo();