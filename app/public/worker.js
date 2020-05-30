
self.addEventListener('message', function (e) {
  const { type, data } = e.data;
  if (type === 'PRE-CHECK-LANG') {
    console.log('[WORKER PRE-CHECK-LANG]', e.data);
    if (Array.isArray(data) && data.length) {
      importScripts('https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.0.0/build/highlight.min.js');
      const results = data.reduce((p, v) => {
        const { code, className } = v;
        if (code && className) {
          p.push({
            className: className,
            language: self.hljs.highlightAuto(code).language
          });
        }
        return p;
      }, []);
      self.postMessage(JSON.stringify({
        type: 'PRE-CHECK-LANG',
        data: results
      }));
    }
  }
}, false);