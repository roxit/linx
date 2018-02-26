function weibo() {
  var text, user, oText, oUser, oURL;
  var el = document.querySelector('.WB_detail > .WB_text');
  text = el.innerText;
  el = document.querySelector('.WB_detail > .WB_info > a');
  user = '@' + el.innerText;
  el = document.querySelectorAll('.WB_expand > .WB_text');
  if (el.length > 0) {
    if (el.length == 2) {
      // TODO: clicking the expand button is required to load the full text
      oText = el[1].innerText;
    } else {
      oText = el[0].innerText;
    }
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