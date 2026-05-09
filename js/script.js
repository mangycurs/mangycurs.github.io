// Тема (системная, светлая, тёмная)
const themeOptions = document.querySelectorAll('.theme-option');
const body = document.body;

function setTheme(theme) {
    body.classList.remove('light', 'dark', 'system');
    if (theme === 'light') {
        body.classList.add('light');
        localStorage.setItem('shavki-theme', 'light');
    } else if (theme === 'dark') {
        body.classList.add('dark');
        localStorage.setItem('shavki-theme', 'dark');
    } else {
        body.classList.add('system');
        localStorage.setItem('shavki-theme', 'system');
        // проверка системной темы
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }
    }
    // активировать кнопку
    themeOptions.forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.theme === theme) opt.classList.add('active');
    });
}
themeOptions.forEach(opt => {
    opt.addEventListener('click', () => setTheme(opt.dataset.theme));
});
const savedTheme = localStorage.getItem('shavki-theme') || 'system';
setTheme(savedTheme);
// слушать системные изменения
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('shavki-theme') === 'system') setTheme('system');
});

// Языки (ru/en)
const translations = {
    ru: {
        'nav.breeds': 'Породы',
        'nav.gallery': 'Галерея',
        'nav.care': 'Уход',
        'nav.facts': 'Факты',
        'hero.title': '🐾 Шавки – маленькие сокровища 🐾',
        'hero.sub': 'Самые милые, преданные и смешные собачки. Узнай всё о породах, уходе и характере.',
        'hero.button': 'Познакомиться с шавками',
        'breeds.title': '✨ Популярные породы шавок ✨',
        'breed.chihuahua': 'Маленькая, но с характером. Любит быть в центре внимания.',
        'breed.york': 'Шёлковая шерсть, энергичный и храбрый.',
        'breed.pomeranian': 'Пушистый комочек радости, очень умный.',
        'breed.pug': 'Вечный оптимист с забавной мордочкой.',
        'breed.shih': 'Львёнок-компаньон, обожает семью.',
        'gallery.title': '📸 ШавкоИнстаграм 📸',
        'care.title': '❤️ Как ухаживать за шавкой ❤️',
        'care.food.title': 'Питание',
        'care.food.text': 'Корм супер-премиум класса, маленькие порции, никакой еды со стола.',
        'care.groom.title': 'Груминг',
        'care.groom.text': 'Регулярное вычёсывание, стрижка когтей, чистка зубов.',
        'care.walk.title': 'Прогулки',
        'care.walk.text': 'Активные игры 2 раза в день, одевайте по погоде!',
        'facts.title': '🧠 Забавные факты о шавках 🧠',
        'fact.1': 'Чихуахуа — самая маленькая порода в мире.',
        'fact.2': 'Йорки были выведены для ловли крыс на шахтах.',
        'fact.3': 'Шпицы обожали королевские особы.',
        'fact.4': 'Мопсы умеют храпеть громче человека.',
        'footer.tagline': 'Маленькие лапки — большое счастье',
        'footer.nav': 'Навигация',
        'footer.social': 'Соцсети',
        'footer.rights': 'Все права защищены'
    },
    en: {
        'nav.breeds': 'Breeds',
        'nav.gallery': 'Gallery',
        'nav.care': 'Care',
        'nav.facts': 'Facts',
        'hero.title': '🐾 Shavki – tiny treasures 🐾',
        'hero.sub': 'The cutest, most loyal little dogs. Learn all about breeds, care and personality.',
        'hero.button': 'Meet the Shavki',
        'breeds.title': '✨ Popular Shavki breeds ✨',
        'breed.chihuahua': 'Small but confident. Loves being the center of attention.',
        'breed.york': 'Silky coat, energetic and brave.',
        'breed.pomeranian': 'Fluffy ball of joy, very smart.',
        'breed.pug': 'Eternal optimist with a funny face.',
        'breed.shih': 'Lion-like companion, adores family.',
        'gallery.title': '📸 Shavkogram 📸',
        'care.title': '❤️ How to care for a Shavka ❤️',
        'care.food.title': 'Nutrition',
        'care.food.text': 'Super-premium food, small portions, no human food.',
        'care.groom.title': 'Grooming',
        'care.groom.text': 'Regular brushing, nail clipping, teeth cleaning.',
        'care.walk.title': 'Walks',
        'care.walk.text': 'Active play 2 times a day, dress for the weather!',
        'facts.title': '🧠 Fun facts about Shavki 🧠',
        'fact.1': 'Chihuahua is the smallest breed in the world.',
        'fact.2': 'Yorkshires were bred to catch rats in mines.',
        'fact.3': 'Pomeranians were adored by royalty.',
        'fact.4': 'Pugs can snore louder than humans.',
        'footer.tagline': 'Small paws, big happiness',
        'footer.nav': 'Navigation',
        'footer.social': 'Social media',
        'footer.rights': 'All rights reserved'
    }
};

let currentLang = localStorage.getItem('shavki-lang') || 'ru';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('shavki-lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });
    // активировать кнопку языка
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.lang === lang) opt.classList.add('active');
    });
}
document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => setLanguage(opt.dataset.lang));
});
setLanguage(currentLang);

// Мобильное меню
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });
}
// Плавный скролл для якорей
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (mobileNav.classList.contains('open')) mobileNav.classList.remove('open');
        }
    });
});