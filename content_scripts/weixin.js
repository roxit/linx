function weixin() {
    var user, site;
    var el = document.querySelector('#meta_content > em.rich_media_meta_text:last-of-type');
    user = '@' + el.innerText;
    el = document.querySelector('#meta_content > a#post-user');
    site = '@' + el.innerText;
    return {
      user: user,
      site: site
    }
  }

  weixin();