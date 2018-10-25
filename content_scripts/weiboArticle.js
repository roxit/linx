function weiboArticle() {
  let text, user;
  let el = document.querySelector('.title');
  text = el.innerText;
  el = document.querySelector('.W_autocut');
  user = el.innerText;
  return {
    text: text,
    user: user,
  }
}

weiboArticle();