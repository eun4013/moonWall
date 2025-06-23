function includeHTML() {
  const includes = document.querySelectorAll('[data-include]');

  includes.forEach(el => {
    const file = el.getAttribute('data-include');
    if (file) {
      fetch(file)
        .then(response => {
          if (!response.ok) throw new Error(`Failed to load ${file}`);
          return response.text();
        })
        .then(html => {
          el.innerHTML = html;

          // 삽입 후 script 태그들을 수동으로 로드
          const scripts = el.querySelectorAll('script');
          scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
              newScript.src = script.src;
              newScript.async = false;
            } else {
              newScript.textContent = script.textContent;
            }
            script.parentNode.replaceChild(newScript, script);
          });

        })
        .catch(err => {
          console.error(err);
          el.innerHTML = "<p>Failed to load content.</p>";
        });
    }
  });
}

document.addEventListener('DOMContentLoaded', includeHTML);