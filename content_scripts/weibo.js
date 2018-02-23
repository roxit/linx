function weibo() {
  wbText = document.querySelector(".WB_detail > .WB_text");
  origText = document.querySelector(".WB_expand > .WB_text");
  if (origText) {
    return [wbText.innerText, origText.innerText];
  } else {
    return [wbText.innerText];
  }
}

weibo();