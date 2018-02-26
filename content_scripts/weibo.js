function weibo() {
  var text, oText;
  var textEl = document.querySelector(".WB_detail > .WB_text");
  var oTextEl = document.querySelector(".WB_expand > .WB_text");
  text = textEl.innerText;
  if (oTextEl) {
    oText = oTextEl.innerText;
  }
  return {
    text: text,
    oText: oText
  }
}

weibo();