/* ==========================================================================
   Irevive — интерактивност на сайта
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Мобилно меню
     --------------------------------------------------------------------- */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('main-nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('is-locked', open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('is-locked');
      }
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('is-locked');
        burger.focus();
      }
    });
  }

  /* ---------------------------------------------------------------------
     Форма за запитване
     Без бекенд: съобщението се отваря в пощенския клиент на потребителя.
     За автоматично изпращане вижте README.md (Formspree / Netlify Forms).
     --------------------------------------------------------------------- */
  var form = document.getElementById('inquiry-form');
  if (form) {
    var status = form.querySelector('.form__status');

    var show = function (msg, ok) {
      if (!status) { return; }
      status.textContent = msg;
      status.classList.add('is-visible');
      status.classList.toggle('form__status--ok', !!ok);
      status.classList.toggle('form__status--err', !ok);
    };

    form.addEventListener('submit', function (e) {
      // Ако формата е свързана с реален бекенд (action към http/https),
      // оставяме браузъра да я изпрати нормално.
      var action = form.getAttribute('action') || '';
      if (/^https?:/i.test(action)) { return; }

      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || '').toString().trim(); };

      var lines = [
        'Име: ' + get('name'),
        'Телефон: ' + get('phone'),
        'Имейл: ' + (get('email') || '-'),
        'Устройство: ' + (get('device') || '-'),
        'Услуга: ' + (get('service') || '-'),
        '',
        'Описание на проблема:',
        get('message') || '-'
      ];

      var subject = 'Запитване за ремонт — ' + (get('device') || 'Apple устройство');
      var mailto = 'mailto:' + (form.dataset.email || 'revivebg@gmail.com') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      window.location.href = mailto;
      show('Отваряме имейл клиента ви с готово запитване. Ако не се отвори, ' +
           'пишете ни във Viber — отговаряме до 10 минути.', true);
      form.reset();
    });
  }

  /* ---------------------------------------------------------------------
     Активна година във футъра
     --------------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }
})();
