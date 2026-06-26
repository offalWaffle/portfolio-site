// Inline media shorthand for project pages.
//
// Put a token on its own line in the body text:
//
//   IMAGES — loads images/<slug>-N.jpg (<slug> = page filename)
//     <p>[img:2]</p>
//     <p>[img:2|A short caption]</p>
//
//   YOUTUBE — accepts a bare video id or any youtube/youtu.be url
//     <p>[yt:dQw4w9WgXcQ]</p>
//     <p>[yt:https://youtu.be/dQw4w9WgXcQ|A short caption]</p>
//
// Missing images quietly hide themselves.

(function () {
  var file = location.pathname.split('/').pop() || '';
  var slug = file.replace(/\.html$/, '');

  var body = document.querySelector('.project-body');
  if (!body) return;

  // Whole-paragraph token: [type:value] or [type:value|caption]
  var re = /^\s*\[(img|yt):([^\]|]+)(?:\|([^\]]*))?\]\s*$/;

  body.querySelectorAll('p').forEach(function (el) {
    var match = el.textContent.match(re);
    if (!match) return;

    var type = match[1];
    var value = match[2].trim();
    var caption = (match[3] || '').trim();

    var node = type === 'img'
      ? buildImage(slug, value, caption)
      : buildVideo(value, caption);

    if (node) el.replaceWith(node);
  });

  function buildImage(slug, num, caption) {
    if (!slug) return null;

    var fig = document.createElement('figure');
    fig.className = 'project-figure';

    var img = document.createElement('img');
    img.src = 'images/' + slug + '-' + num + '.jpg';
    img.alt = caption || (slug + ' image ' + num);
    img.loading = 'lazy';
    img.onerror = function () {
      var parent = this.closest('.project-figure');
      if (parent) parent.style.display = 'none';
    };
    fig.appendChild(img);

    if (caption) fig.appendChild(makeCaption(caption));
    return fig;
  }

  function buildVideo(raw, caption) {
    var id = youtubeId(raw);
    if (!id) return null;

    var fig = document.createElement('figure');
    fig.className = 'project-embed';

    var frame = document.createElement('div');
    frame.className = 'embed-frame';

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id;
    iframe.title = caption || 'YouTube video';
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);
    fig.appendChild(frame);

    if (caption) fig.appendChild(makeCaption(caption));
    return fig;
  }

  function youtubeId(raw) {
    raw = raw.trim();
    // Bare id (no slash or dot) — accept as-is.
    if (/^[A-Za-z0-9_-]+$/.test(raw)) return raw;
    // Otherwise pull the id out of a url form.
    var m = raw.match(/(?:v=|\/embed\/|\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]+)/);
    return m ? m[1] : null;
  }

  function makeCaption(text) {
    var cap = document.createElement('figcaption');
    cap.textContent = text;
    return cap;
  }
})();
