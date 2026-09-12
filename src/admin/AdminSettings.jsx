import { useState } from 'react';

const DEFAULTS = {
  heroTitle: 'Новая коллекция street style.',
  heroSub: 'Скидки до 30% на весеннюю коллекцию. Доставка по всей России.',
  heroBtnText: 'Смотреть каталог',
  showBanner: true,
  bannerText: '🚚 Бесплатная доставка от 5 000 сом',
  phone: '+7 (495) 055-75-86',
  email: 'order@world-bike.ru',
  address: 'г. Москва, ул. Доватора, 7/8 с1',
  hours: 'Без выходных 10:00–20:00',
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('uw_settings') || '{}') };
    } catch {
      return DEFAULTS;
    }
  });
  const [saved, setSaved] = useState(false);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings((p) => ({ ...p, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('uw_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSettings(DEFAULTS);
    localStorage.removeItem('uw_settings');
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Настройки сайта</h1>
          <p>Тексты, контакты, баннеры</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="admin-settings-form">
        {/* Hero */}
        <div className="admin-settings-section">
          <h3>Главный баннер (Hero)</h3>
          <div className="admin-form-grid">
            <div className="admin-form-field admin-form-field--full">
              <label>Заголовок</label>
              <input type="text" value={settings.heroTitle} onChange={set('heroTitle')} />
            </div>
            <div className="admin-form-field admin-form-field--full">
              <label>Подзаголовок</label>
              <input type="text" value={settings.heroSub} onChange={set('heroSub')} />
            </div>
            <div className="admin-form-field">
              <label>Текст кнопки</label>
              <input type="text" value={settings.heroBtnText} onChange={set('heroBtnText')} />
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="admin-settings-section">
          <h3>Промо-баннер</h3>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label className="admin-flag">
                <input type="checkbox" checked={settings.showBanner} onChange={set('showBanner')} />
                Показывать баннер
              </label>
            </div>
            <div className="admin-form-field admin-form-field--full">
              <label>Текст баннера</label>
              <input type="text" value={settings.bannerText} onChange={set('bannerText')} disabled={!settings.showBanner} />
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="admin-settings-section">
          <h3>Контакты</h3>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label>Телефон</label>
              <input type="text" value={settings.phone} onChange={set('phone')} />
            </div>
            <div className="admin-form-field">
              <label>Email</label>
              <input type="email" value={settings.email} onChange={set('email')} />
            </div>
            <div className="admin-form-field admin-form-field--full">
              <label>Адрес</label>
              <input type="text" value={settings.address} onChange={set('address')} />
            </div>
            <div className="admin-form-field">
              <label>Режим работы</label>
              <input type="text" value={settings.hours} onChange={set('hours')} />
            </div>
          </div>
        </div>

        <div className="admin-settings-actions">
          <button type="button" className="admin-cancel-btn" onClick={handleReset}>Сбросить</button>
          <button type="submit" className="admin-save-btn">
            {saved ? '✓ Сохранено!' : 'Сохранить настройки'}
          </button>
        </div>
      </form>
    </div>
  );
}
