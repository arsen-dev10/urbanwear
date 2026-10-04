# Urban Wear — Долбоор боюнча конспект

---

## 1. Долбоор жөнүндө жалпы маалымат

**Аты:** Urban Wear  
**Түрү:** Интернет-дүкөн (E-commerce)  
**Максаты:** Кийим сатуу сайты — каталог, корзина, буйрутма берүү, админ панел

---

## 2. Технологиялар (Стек)

| Технология | Колдонулушу |
|---|---|
| **React 19** | UI компоненттер |
| **React Router v7** | Беттер арасында өтүү |
| **Context API** | Глобал state (корзина, избранное, аутентификация) |
| **Firebase Auth** | Колдонуучу кирүү/чыгуу |
| **MockAPI** | Товарларды сактоо (REST API) |
| **Formspree** | Буйрутма формасын жөнөтүү |
| **Vite** | Проектти куруу инструменти |
| **CSS (index.css)** | Бардык стилдер |

---

## 3. Папка структурасы

```
src/
├── admin/          ← Админ панел беттери
├── components/     ← Кайра колдонулуучу компоненттер
├── context/        ← Global state (Cart, Auth, Products, Favorites)
├── data/           ← products.json (локал маалымат)
├── pages/          ← Сайттын беттери
├── utils/          ← Жардамчы функциялар
├── firebase.js     ← Firebase конфигурация
├── router.jsx      ← Бардык роуттар
└── App.jsx         ← Негизги компонент
```

---

## 4. Беттер жана Роуттар

| URL | Бет | Сыпаттамасы |
|---|---|---|
| `/` | Home | Башкы бет — Hero, каталог, бренддер, карта |
| `/catalog` | Catalog | Бардык товарлар + фильтр + сортировка |
| `/product/:id` | ProductDetail | Товардын толук маалыматы |
| `/cart` | Cart | Корзина + буйрутма формасы |
| `/favorites` | Favorites | Сакталган товарлар |
| `/login` | Login | Колдонуучу кирүү |
| `/register` | Register | Катталуу |
| `/profile` | Profile | Жеке кабинет (корголгон) |
| `/admin/login` | AdminLogin | Админ кирүү бети |
| `/admin` | AdminDashboard | Статистика |
| `/admin/products` | AdminProducts | Товарларды башкаруу |
| `/admin/settings` | AdminSettings | Сайт жөндөөлөрү |

---

## 5. Context (Global State)

### AuthContext
- `currentUser` — учурдагы колдонуучу
- `login()`, `register()`, `logout()`
- `updateDisplayName()`, `updateUserEmail()`, `updateUserPassword()`

### CartContext
- `cart` — корзинадагы товарлар
- `addToCart()`, `updateQty()`, `removeFromCart()`, `clearCart()`
- `cartCount`, `cartTotal`

### FavoritesContext
- `favorites` — сакталган товарлардын ID тизмеси
- `toggleFavorite()`, `isFavorite()`

### ProductsContext
- `products` — MockAPI дан келген товарлар
- `addProduct()`, `updateProduct()`, `deleteProduct()`, `toggleStock()`
- Биринчи жүктөлгөндө MockAPI бош болсо → локал JSON дан seed кылат

---

## 6. MockAPI

**URL:** `https://6aa130572703577aa1e36392.mockapi.io/products`

| Операция | Метод | URL |
|---|---|---|
| Баарын алуу | GET | `/products` |
| Бирини алуу | GET | `/products/:id` |
| Кошуу | POST | `/products` |
| Өзгөртүү | PUT | `/products/:id` |
| Жок кылуу | DELETE | `/products/:id` |

> **Маанилүү:** POST жөнөтүүдө `id` талаасын **берме** — MockAPI өзү уникалдуу id дайындайт.

---

## 7. Товар структурасы (Product)

```json
{
  "id": "1",
  "title": "Оверсайз худи",
  "price": 4500,
  "oldPrice": 5990,
  "category": "Худи",
  "brand": "Urban Wear",
  "colors": ["#202126", "#d6a77a"],
  "sizes": ["S", "M", "L", "XL"],
  "images": ["url1", "url2"],
  "fabric": "80% хлопок, 20% полиэстер",
  "material": "Полиэстер",
  "inStock": true,
  "isNew": false,
  "isBestseller": true
}
```

---

## 8. Firebase Auth

- **Email/Password** аутентификация
- Колдонуучу маалыматы Firebase Authentication да сакталат
- Корзина жана Избранное → `localStorage` да сакталат

**Админ аккаунт түзүү:**
1. [console.firebase.google.com](https://console.firebase.google.com) → project-60695
2. Authentication → Users → Add user
3. Email: `admin@urbanwear.com`, Пароль өзүң коюп ал

---

## 9. Админ панел

**Кирүү:** `/admin/login`  
**Корголуусу:** `AdminRoute` — email whitelist текшерет

**Мүмкүнчүлүктөр:**
- 📊 Дашборд — товарлар статистикасы
- 🛍 Товарларды кошуу / өзгөртүү / жок кылуу
- ✓/✗ Наличиени which басуу менен которуу
- ⚙ Сайт жөндөөлөрү (hero тексти, байланыш маалыматы)

**Админ email кошуу** (`AdminRoute.jsx` жана `AdminLogin.jsx`):
```js
const ADMIN_EMAILS = ['admin@urbanwear.com', 'сенин@email.com'];
```

---

## 10. Буйрутма (Formspree)

- Form ID: `myeynzeq`
- Жөнөтулган маалымат: аты, телефон, дарек, төлөм ыкмасы, корзина тизмеси
- Ийгиликтүү жөнөтүлгөндөн кийин → корзина тазаланат

---

## Суроолор жана Жооптор

**С: Долбоор кандай технологияда жазылган?**  
Ж: React 19, Vite, CSS, Firebase Auth, MockAPI REST, Formspree.

**С: Товарлар кайда сакталат?**  
Ж: MockAPI сервисинде — `https://6aa130572703577aa1e36392.mockapi.io/products`

**С: Корзина маалыматы кайда сакталат?**  
Ж: Браузердин `localStorage` ында — бет жабылса да жоголбойт.

**С: Колдонуучу системасы кантип иштейт?**  
Ж: Firebase Authentication аркылуу. Email/пароль менен катталуу жана кирүү.

**С: Админ панелге кантип кирүү керек?**  
Ж: `/admin/login` бетине өтүп, Firebase те катталган admin email менен кируу керек.

**С: Context API эмне үчүн колдонулат?**  
Ж: Глобал state башкаруу үчүн — корзина, избранное, аутентификация, товарлар. Props drilling болтурбоо үчүн.

**С: `ProductsContext` биринчи жүктөлгөндө эмне болот?**  
Ж: MockAPI дан маалымат алат. Эгер бош болсо — `products.json` дан 12 товарды MockAPI га POST жөнөтүп seed кылат.

**С: Товар кошкондо `id` берүү керекпи?**  
Ж: Жок. MockAPI өзү уникалдуу `id` дайындайт. `id` талаасы POST дан алынып ташталат.

**С: Сайт мобилдик телефондо кантип көрүнөт?**  
Ж: Responsive дизайн — 900px дан кичине экранда фильтрлер ⋮ баскычы аркылуу ачылат, navbar жашырылат, сетка 2 колоннага өзгөрөт.

**С: Роуттар кантип корголот?**  
Ж: `ProtectedRoute` — жарандар үчүн (профиль), `AdminRoute` — админ email whitelist текшерет.

**С: Buurtma кайда жөнөтүлөт?**  
Ж: Formspree сервисине — `myeynzeq` form ID аркылуу email жөнөтүлөт.
