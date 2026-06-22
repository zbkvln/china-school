/* ============================================================
   ТЯНЬ-ЛУН — script.js
   Весь интерактив сайта: прелоадер, бургер, слайдер (+ свайп),
   скролл к форме, аккордеон FAQ, модалки курсов, валидация формы.
   ============================================================ */


/* ── ПРЕЛОАДЕР ── */
/* Ждём 3.4 сек (время анимации дракона), потом плавно скрываем */
var preloader = document.getElementById('preloader');
setTimeout(function() {
  preloader.classList.add('fade-out');
  /* После окончания transition убираем из потока документа */
  setTimeout(function() { preloader.style.display = 'none'; }, 700);
}, 3400);


/* ── БУРГЕР-МЕНЮ ── */
var burger     = document.getElementById('burger');
var mobileMenu = document.getElementById('mobile-menu');
var burgerIcon = document.getElementById('burger-icon');
var closeIcon  = document.getElementById('close-icon');

/* Открыть мобильное меню */
function openMenu() {
  mobileMenu.classList.add('is-open');
  burgerIcon.style.display = 'none';
  closeIcon.style.display  = 'block';
}

/* Закрыть мобильное меню */
function closeMenu() {
  mobileMenu.classList.remove('is-open');
  burgerIcon.style.display = 'block';
  closeIcon.style.display  = 'none';
}

/* Переключаем при клике на бургер */
burger.addEventListener('click', function() {
  mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
});

/* Закрываем при клике на любую ссылку меню */
mobileMenu.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', closeMenu);
});


/* ── СЛАЙДЕР ── */
var track        = document.getElementById('sliderTrack');
var dots         = document.querySelectorAll('.slider__dot');
var currentSlide = 0;
var totalSlides  = 3;

/* Переход к слайду index (0-based).
   Сдвигаем трек через translateX и обновляем активную точку. */
function goToSlide(index) {
  currentSlide = index;
  track.style.transform = 'translateX(-' + (index * 100) + '%)';
  dots.forEach(function(dot, i) {
    dot.classList.toggle('is-active', i === index);
  });
}

/* Кнопки-стрелки */
document.getElementById('slidePrev').addEventListener('click', function() {
  goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
  resetAutoplay();
});
document.getElementById('slideNext').addEventListener('click', function() {
  goToSlide((currentSlide + 1) % totalSlides);
  resetAutoplay();
});

/* Точки-индикаторы */
dots.forEach(function(dot) {
  dot.addEventListener('click', function() {
    goToSlide(parseInt(this.dataset.index));
    resetAutoplay();
  });
});

/* ── Автопрокрутка ──
   Таймер каждые 7 секунд. resetAutoplay() перезапускает его
   после ручного листания, чтобы не перебивать пользователя. */
var autoplayTimer = setInterval(function() {
  goToSlide((currentSlide + 1) % totalSlides);
}, 7000);

function resetAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(function() {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 7000);
}

/* ── Touch-свайп (планшет и телефон) ──
   Логика:
   1. touchstart — запоминаем начало касания.
   2. touchmove  — если жест горизонтальный (|dx| > |dy| и > 8px),
                   вызываем preventDefault() чтобы страница не скроллилась.
   3. touchend   — если суммарный |dx| > порога, листаем слайд.

   touch-action: pan-y в CSS разрешает браузеру вертикальный скролл,
   а горизонталь мы блокируем сами только при реальном горизонтальном жесте. */

var SWIPE_THRESHOLD = 40; /* минимальное смещение (px) для засчитывания свайпа */
var touchStartX = 0;
var touchStartY = 0;
var isSwiping   = false;  /* флаг: идёт ли горизонтальный свайп */

track.addEventListener('touchstart', function(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  isSwiping   = false;
}, { passive: true });

track.addEventListener('touchmove', function(e) {
  var dx = e.touches[0].clientX - touchStartX;
  var dy = e.touches[0].clientY - touchStartY;
  /* Только если явно горизонтальный жест — блокируем вертикальный скролл */
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
    e.preventDefault();
    isSwiping = true;
  }
}, { passive: false }); /* passive: false — нужен для preventDefault() */

track.addEventListener('touchend', function(e) {
  if (!isSwiping) return;
  var dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) < SWIPE_THRESHOLD) return; /* слишком короткий жест */
  if (dx < 0) {
    goToSlide((currentSlide + 1) % totalSlides);          /* свайп влево → следующий */
  } else {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides); /* свайп вправо → предыдущий */
  }
  isSwiping = false;
  resetAutoplay();
}, { passive: true });


/* ── СКРОЛЛ К ФОРМЕ ──
   Кнопки с классом scroll-to-form (в слайдере и модалке) плавно
   скроллят страницу к секции #contact. */
document.querySelectorAll('.scroll-to-form').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    /* Закрываем модалку курса, если была открыта */
    document.getElementById('modalOverlay').classList.remove('is-open');
    document.body.style.overflow = '';
  });
});


/* ── FAQ АККОРДЕОН ──
   Каждый элемент открывается и закрывается независимо.
   Вертикальная черта значка + скрывается при открытии (иконка → −). */
document.querySelectorAll('.faq-item').forEach(function(item) {
  item.querySelector('.faq-item__question').addEventListener('click', function() {
    var isOpen = item.classList.contains('is-open');
    var vLine  = item.querySelector('.faq-plus-v'); /* вертикальная черта SVG-плюса */

    if (isOpen) {
      item.classList.remove('is-open');
      if (vLine) vLine.style.display = 'block'; /* плюс → закрыто */
    } else {
      item.classList.add('is-open');
      if (vLine) vLine.style.display = 'none';  /* минус → открыто */
    }
  });
});


/* ── МОДАЛКИ КУРСОВ ──
   Данные для трёх курсов. При клике на «Подробнее» вставляем
   заголовок и тело в модальное окно и показываем его. */
var courseData = {
  '1': {
    title: 'Курс № 1: Стартовый HSK 1',
    body:  '<p><strong>Программа:</strong> Постановка 4-х тонов, правила написания черт, знакомство с ключами иероглифов, базовые фразы приветствия и рассказа о себе.</p>' +
           '<p><strong>Результат:</strong> Словарный запас — 150 слов. Вы сможете заказать еду в ресторане и понять простую речь собеседника.</p>' +
           '<p><strong>Длительность:</strong> 3 месяца (24 занятия).</p>'
  },
  '2': {
    title: 'Курс № 2: HSK 2–3',
    body:  '<p><strong>Программа:</strong> Прошедшее и будущее время, конструкции 把 и 被, тематические модули: «Путешествия», «Работа», «Здоровье».</p>' +
           '<p><strong>Результат:</strong> Словарный запас — до 600 слов. Свободное общение на бытовые темы и чтение несложных текстов без словаря.</p>' +
           '<p><strong>Длительность:</strong> 5 месяцев (40 занятий).</p>'
  },
  '3': {
    title: 'Курс № 3: HSK 4 + экзамен',
    body:  '<p><strong>Программа:</strong> Написание эссе, стратегии сдачи экзамена, идиомы (ченъюи), аудирование в быстром темпе, обсуждение культуры и политики.</p>' +
           '<p><strong>Результат:</strong> Подготовка к официальному тестированию. Возможность учиться или работать в Китае.</p>' +
           '<p><strong>Длительность:</strong> 6 месяцев (48 занятий).</p>'
  }
};

var modalOverlay = document.getElementById('modalOverlay');
var modalTitle   = document.getElementById('modalTitle');
var modalBody    = document.getElementById('modalBody');

/* Открыть модалку нужного курса */
document.querySelectorAll('.open-modal').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var data = courseData[this.dataset.course];
    modalTitle.textContent = data.title;
    modalBody.innerHTML    = data.body;
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden'; /* блокируем скролл страницы */
  });
});

/* Закрыть модалку */
function closeModal() {
  modalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

/* Кнопка ✕ */
document.getElementById('modalClose').addEventListener('click', closeModal);

/* Клик по затемнённому оверлею вне карточки */
modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) closeModal();
});


/* ── ФОРМА + ВАЛИДАЦИЯ ── */
var nameInput  = document.getElementById('inputName');
var phoneInput = document.getElementById('inputPhone');
var nameError  = document.getElementById('nameError');
var phoneError = document.getElementById('phoneError');

/* Поле имени: допускаем только кириллицу, пробелы и дефисы.
   Запрещаем латиницу и цифры — ошибка показывается мгновенно при вводе. */
nameInput.addEventListener('input', function() {
  var cleaned = this.value.replace(/[^а-яёА-ЯЁ\s\-]/g, '');
  if (cleaned !== this.value) {
    this.value = cleaned; /* убираем недопустимые символы */
    nameError.textContent = 'Только кириллица, пробелы и дефисы';
    nameError.classList.add('is-visible');
    this.classList.add('is-error');
    return;
  }
  /* Сброс ошибки при корректном вводе */
  this.classList.remove('is-error');
  nameError.classList.remove('is-visible');
});

/* Поле телефона: сбрасываем ошибку при любом вводе */
phoneInput.addEventListener('input', function() {
  this.classList.remove('is-error');
  phoneError.classList.remove('is-visible');
});

/* Валидация телефона.
   Принимает:
     +7 999 123-45-67  →  stripped: +79991234567  ✓
     8 (999) 123-45-67 →  stripped: 89991234567   ✓
     9991234567        →  10 цифр                  ✓
   Удаляем пробелы, скобки, дефисы — проверяем голые цифры (и +). */
function isValidPhone(val) {
  var stripped = val.replace(/[\s\-\(\)]/g, '');
  if (/^(\+7|7|8)\d{10}$/.test(stripped)) return true; /* с кодом страны */
  return false;
}

/* Кнопка «Отправить» — проверяем все поля */
document.getElementById('submitBtn').addEventListener('click', function() {
  var ok = true;

  /* Сброс всех предыдущих ошибок */
  nameInput.classList.remove('is-error');
  phoneInput.classList.remove('is-error');
  nameError.classList.remove('is-visible');
  phoneError.classList.remove('is-visible');

  /* Проверка имени */
  if (!nameInput.value.trim()) {
    nameInput.classList.add('is-error');
    nameError.textContent = 'Пожалуйста, введите имя';
    nameError.classList.add('is-visible');
    ok = false;
  }

  /* Проверка телефона */
  if (!phoneInput.value.trim()) {
    phoneInput.classList.add('is-error');
    phoneError.textContent = 'Пожалуйста, введите номер телефона';
    phoneError.classList.add('is-visible');
    ok = false;
  } else if (!isValidPhone(phoneInput.value.trim())) {
    phoneInput.classList.add('is-error');
    phoneError.textContent = 'Введите корректный номер, например +7 999 123-45-67';
    phoneError.classList.add('is-visible');
    ok = false;
  }

  /* Все поля валидны — показываем оверлей успеха */
  if (ok) {
    document.getElementById('successOverlay').classList.add('is-visible');
  }
});

/* Закрытие оверлея успеха + очистка полей */
document.getElementById('closeSuccess').addEventListener('click', function() {
  document.getElementById('successOverlay').classList.remove('is-visible');
  nameInput.value  = '';
  phoneInput.value = '';
});
