import { useState, useRef, useEffect } from 'react';

/* Список стран: [название, код страны ISO, телефонный код, маска, флаг emoji] */
const COUNTRIES = [
  ['Россия',              'ru', '7',    '+7 (###) ###-##-##',  '🇷🇺'],
  ['Кыргызстан',          'kg', '996',  '+996 (###) ##-##-##', '🇰🇬'],
  ['Казахстан',           'kz', '7',    '+7 (###) ###-##-##',  '🇰🇿'],
  ['Беларусь',            'by', '375',  '+375 (##) ###-##-##', '🇧🇾'],
  ['Украина',             'ua', '380',  '+380 (##) ###-##-##', '🇺🇦'],
  ['Узбекистан',          'uz', '998',  '+998 (##) ###-##-##', '🇺🇿'],
  ['Таджикистан',         'tj', '992',  '+992 (##) ###-##-##', '🇹🇯'],
  ['Азербайджан',         'az', '994',  '+994 (##) ###-##-##', '🇦🇿'],
  ['Армения',             'am', '374',  '+374 (##) ##-##-##',  '🇦🇲'],
  ['Грузия',              'ge', '995',  '+995 (###) ##-##-##', '🇬🇪'],
  ['Германия',            'de', '49',   '+49 (###) #######',   '🇩🇪'],
  ['США',                 'us', '1',    '+1 (###) ###-####',   '🇺🇸'],
  ['Великобритания',      'gb', '44',   '+44 (##) ####-####',  '🇬🇧'],
  ['Турция',              'tr', '90',   '+90 (###) ###-##-##', '🇹🇷'],
  ['Китай',               'cn', '86',   '+86 (###) ####-####', '🇨🇳'],
  ['ОАЭ',                 'ae', '971',  '+971 (##) ###-####',  '🇦🇪'],
  ['Франция',             'fr', '33',   '+33 # ## ## ## ##',   '🇫🇷'],
  ['Польша',              'pl', '48',   '+48 ### ### ###',     '🇵🇱'],
  ['Чехия',               'cz', '420',  '+420 ### ### ###',    '🇨🇿'],
  ['Австрия',             'at', '43',   '+43 ### #######',     '🇦🇹'],
];

/* Применить маску к цифрам */
function applyMask(digits, mask) {
  let di = 0;
  let result = '';
  for (let i = 0; i < mask.length && di < digits.length; i++) {
    if (mask[i] === '#') {
      result += digits[di++];
    } else {
      result += mask[i];
    }
  }
  return result;
}

/* Сколько цифр (без кода страны) нужно для полного номера */
function digitsNeeded(mask) {
  return (mask.match(/#/g) || []).length;
}

/* Валидация — номер полностью заполнен */
function isComplete(localDigits, mask) {
  return localDigits.length === digitsNeeded(mask);
}

export default function PhoneField({ value, onChange, error, onValidChange }) {
  const [country, setCountry]   = useState(COUNTRIES[0]); // по умолчанию Россия
  const [digits, setDigits]     = useState('');            // только локальные цифры
  const [open, setOpen]         = useState(false);
  const [search, setSearch]     = useState('');
  const dropRef  = useRef(null);
  const inputRef = useRef(null);

  /* закрыть dropdown при клике снаружи */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* уведомить родителя */
  useEffect(() => {
    const full = digits.length > 0 ? `+${country[2]}${digits}` : '';
    onChange(full);
    if (onValidChange) onValidChange(isComplete(digits, country[3]));
  }, [digits, country]);

  /* при смене страны — сбросить цифры */
  const selectCountry = (c) => {
    setCountry(c);
    setDigits('');
    setOpen(false);
    setSearch('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  /* обработка ввода */
  const handleInput = (e) => {
    const raw = e.target.value.replace(/\D/g, ''); // только цифры
    const max = digitsNeeded(country[3]);
    setDigits(raw.slice(0, max));
  };

  const displayValue = digits.length > 0 ? applyMask(digits, country[3]) : '';
  const placeholder  = country[3].replace(/#/g, '_');

  const filtered = COUNTRIES.filter(
    (c) => c[0].toLowerCase().includes(search.toLowerCase()) || c[2].includes(search)
  );

  const complete = isComplete(digits, country[3]);

  return (
    <div className={`pf-wrap${error ? ' pf-wrap--error' : ''}`} ref={dropRef}>
      {/* Кнопка выбора страны */}
      <button
        type="button"
        className="pf-flag-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Выбрать страну"
      >
        <span className="pf-flag">{country[4]}</span>
        <span className="pf-code">+{country[2]}</span>
        <svg className={`pf-arrow${open ? ' pf-arrow--open' : ''}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Поле ввода */}
      <input
        ref={inputRef}
        className="pf-input"
        type="tel"
        inputMode="numeric"
        value={displayValue}
        onChange={handleInput}
        placeholder={placeholder}
        aria-label="Номер телефона"
        aria-invalid={!!error}
      />

      {/* Индикатор */}
      {digits.length > 0 && (
        <span className={`pf-indicator${complete ? ' pf-indicator--ok' : ''}`}>
          {complete ? '✓' : `${digits.length}/${digitsNeeded(country[3])}`}
        </span>
      )}

      {/* Dropdown */}
      {open && (
        <div className="pf-dropdown">
          <div className="pf-search-wrap">
            <input
              className="pf-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск страны…"
              autoFocus
            />
          </div>
          <div className="pf-list">
            {filtered.length === 0 && (
              <div className="pf-empty">Страна не найдена</div>
            )}
            {filtered.map((c) => (
              <button
                key={c[1] + c[2]}
                type="button"
                className={`pf-option${c[1] === country[1] ? ' pf-option--active' : ''}`}
                onClick={() => selectCountry(c)}
              >
                <span className="pf-flag">{c[4]}</span>
                <span className="pf-country-name">{c[0]}</span>
                <span className="pf-country-code">+{c[2]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
