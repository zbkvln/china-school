// ===== PRELOADER =====
var preloader = document.getElementById('preloader');
setTimeout(function() {
  preloader.classList.add('fade-out');
  setTimeout(function() { preloader.style.display = 'none'; }, 700);
}, 3400);


// ===== BURGER MENU =====
var burger     = document.getElementById('burger');
var mobileMenu = document.getElementById('mobile-menu');
var burgerIcon = document.getElementById('burger-icon');
var closeIcon  = document.getElementById('close-icon');

function openMenu() {
  mobileMenu.classList.add('is-open');
  burgerIcon.style.display = 'none';
  closeIcon.style.display  = 'block';
}
function closeMenu() {
  mobileMenu.classList.remove('is-open');
  burgerIcon.style.display = 'block';
  closeIcon.style.display  = 'none';
}

burger.addEventListener('click', function() {
  mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
});

mobileMenu.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', closeMenu);
});


// ===== SLIDER =====
var track        = document.getElementById('sliderTrack');
var dots         = document.querySelectorAll('.slider__dot');
var currentSlide = 0;
var totalSlides  = 3;

function goToSlide(index) {
  currentSlide = index;
  track.style.transform = 'translateX(-' + (index * 100) + '%)';
  dots.forEach(function(dot, i) {
    dot.classList.toggle('is-active', i === index);
  });
}

document.getElementById('slidePrev').addEventListener('click', function() {
  goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
});
document.getElementById('slideNext').addEventListener('click', function() {
  goToSlide((currentSlide + 1) % totalSlides);
});
dots.forEach(function(dot) {
  dot.addEventListener('click', function() {
    goToSlide(parseInt(this.dataset.index));
  });
});

// ── Touch-свайп для планшетов и телефонов ──
// Минимальное расстояние (px) для засчитывания свайпа
var SWIPE_THRESHOLD = 40;
var touchStartX = 0;
var touchStartY = 0;
var isSwiping   = false;

track.addEventListener('touchstart', function(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  isSwiping   = false;
}, { passive: true });

track.addEventListener('touchmove', function(e) {
  // Если палец движется преимущественно горизонтально — блокируем скролл страницы
  var dx = e.touches[0].clientX - touchStartX;
  var dy = e.touches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
    e.preventDefault();   // останавливаем вертикальный скролл только при горизонтальном жесте
    isSwiping = true;
  }
}, { passive: false });

track.addEventListener('touchend', function(e) {
  if (!isSwiping) return;
  var dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) < SWIPE_THRESHOLD) return; // слишком короткий жест — игнорируем
  if (dx < 0) {
    goToSlide((currentSlide + 1) % totalSlides);        // свайп влево → следующий
  } else {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides); // свайп вправо → предыдущий
  }
  isSwiping = false;
}, { passive: true });

// Автопрокрутка — сбрасывается при любом ручном листании
var autoplayTimer = setInterval(function() {
  goToSlide((currentSlide + 1) % totalSlides);
}, 7000);

// Сброс таймера при клике на стрелки/точки чтобы автопрокрутка не перебивала пользователя
function resetAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(function() {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 7000);
}
document.getElementById('slidePrev').addEventListener('click', resetAutoplay);
document.getElementById('slideNext').addEventListener('click', resetAutoplay);
track.addEventListener('touchend', resetAutoplay, { passive: true });


// ===== SCROLL TO FORM =====
document.querySelectorAll('.scroll-to-form').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    // Закрываем модалку курса если открыта
    document.getElementById('modalOverlay').classList.remove('is-open');
    document.body.style.overflow = '';
  });
});


// ===== FAQ ACCORDION — каждый открывается/закрывается независимо =====
document.querySelectorAll('.faq-item').forEach(function(item) {
  item.querySelector('.faq-item__question').addEventListener('click', function() {
    var isOpen = item.classList.contains('is-open');
    var vLine  = item.querySelector('.faq-plus-v');

    if (isOpen) {
      item.classList.remove('is-open');
      if (vLine) vLine.style.display = 'block';
    } else {
      item.classList.add('is-open');
      if (vLine) vLine.style.display = 'none';
    }
  });
});


// ===== МОДАЛКИ КУРСОВ =====
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

document.querySelectorAll('.open-modal').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var data = courseData[this.dataset.course];
    modalTitle.textContent = data.title;
    modalBody.innerHTML    = data.body;
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}
document.getElementById('modalClose').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) closeModal();
});


// ===== ФОРМА + ВАЛИДАЦИЯ =====
var nameInput  = document.getElementById('inputName');
var phoneInput = document.getElementById('inputPhone');
var nameError  = document.getElementById('nameError');
var phoneError = document.getElementById('phoneError');

// Поле имени: разрешаем только кириллицу, пробелы и дефисы
nameInput.addEventListener('input', function() {
  // Удаляем любые символы, кроме кириллицы, пробела и дефиса
  var cleaned = this.value.replace(/[^а-яёА-ЯЁ\s\-]/g, '');
  if (cleaned !== this.value) {
    this.value = cleaned;
    nameError.textContent = 'Только кириллица, пробелы и дефисы';
    nameError.classList.add('is-visible');
    this.classList.add('is-error');
    return;
  }
  this.classList.remove('is-error');
  nameError.classList.remove('is-visible');
});

phoneInput.addEventListener('input', function() {
  this.classList.remove('is-error');
  phoneError.classList.remove('is-visible');
});

// Валидация телефона: принимает +7/7/8 + 10 цифр или ровно 10 цифр.
// Допускает пробелы, скобки, дефисы в любых позициях.
function isValidPhone(val) {
  // Оставляем только цифры и ведущий '+'
  var stripped = val.replace(/[\s\-\(\)]/g, '');
  // +79991234567 или 79991234567 или 89991234567
  if (/^(\+7|7|8)\d{10}$/.test(stripped)) return true;
  // 9991234567 — 10 цифр без кода страны
  if (/^\d{10}$/.test(stripped)) return true;
  return false;
}

document.getElementById('submitBtn').addEventListener('click', function() {
  var ok = true;

  // Сброс всех ошибок
  nameInput.classList.remove('is-error');
  phoneInput.classList.remove('is-error');
  nameError.classList.remove('is-visible');
  phoneError.classList.remove('is-visible');

  // Проверяем имя
  if (!nameInput.value.trim()) {
    nameInput.classList.add('is-error');
    nameError.textContent = 'Пожалуйста, введите имя';
    nameError.classList.add('is-visible');
    ok = false;
  }

  // Проверяем телефон
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

  if (ok) {
    document.getElementById('successOverlay').classList.add('is-visible');
  }
});

document.getElementById('closeSuccess').addEventListener('click', function() {
  document.getElementById('successOverlay').classList.remove('is-visible');
  nameInput.value  = '';
  phoneInput.value = '';
});
