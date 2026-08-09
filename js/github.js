// ==========================================================================
// Автоподгрузка репозиториев через GitHub REST API
// ==========================================================================

const GITHUB_USERNAME = 'aidynbot';

document.addEventListener('DOMContentLoaded', async () => {
  const list = document.querySelector('[data-repo-list]');
  const status = document.querySelector('[data-repo-status]');
  if (!list) return;

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`
    );

    if (!res.ok) {
      throw new Error(`GitHub API вернул ${res.status}`);
    }

    const repos = await res.json();
    const visible = repos.filter(
      (r) => !r.fork && r.name.toLowerCase() !== `${GITHUB_USERNAME}.github.io`
    );

    if (!visible.length) {
      status.textContent = `Репозитории не найдены для @${GITHUB_USERNAME}.`;
      return;
    }

    status.remove();
    list.innerHTML = visible
      .map((repo) => {
        const desc = repo.description
          ? `<p class="repo-item__desc">${escapeHtml(repo.description)}</p>`
          : '';
        const lang = repo.language ? `<span>${escapeHtml(repo.language)}</span>` : '';
        const updated = new Date(repo.updated_at).toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'short',
        });

        return `
          <a class="repo-item" href="${repo.html_url}" target="_blank" rel="noopener">
            <span class="repo-item__name">${escapeHtml(repo.name)}</span>
            <span class="repo-item__meta">
              ${lang}
              <span>★ ${repo.stargazers_count}</span>
              <span>${updated}</span>
            </span>
            ${desc}
          </a>
        `;
      })
      .join('');

    // Повторно навешиваем анимацию появления на подгруженные карточки
    if ('IntersectionObserver' in window) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const items = list.querySelectorAll('.repo-item');
      if (reduceMotion) {
        items.forEach((el) => el.classList.add('is-visible'));
      } else {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        items.forEach((el) => observer.observe(el));
      }
    }
  } catch (err) {
    if (status) {
      status.textContent =
        'Не удалось загрузить репозитории. Попробуйте открыть GitHub напрямую.';
    }
    console.error(err);
  }
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
