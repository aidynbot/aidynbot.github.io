// ==========================================================================
// Отправка формы через Formspree
// ==========================================================================

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdeneoea';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Отправка...';
    status.removeAttribute('data-state');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (res.ok) {
        status.textContent = 'Сообщение отправлено. Отвечу в ближайшее время.';
        status.dataset.state = 'ok';
        form.reset();
      } else {
        throw new Error('Formspree error');
      }
    } catch (err) {
      status.textContent = 'Не удалось отправить. Напишите напрямую в Telegram или на почту.';
      status.dataset.state = 'error';
      console.error(err);
    }
  });
});
