export default function SortBar({ count, query, onQuery, sort, onSort }) {
  return (
    <div className="sort-bar">
      <div className="sort-bar__left">
        <small>Каталог</small>
        <h1>Вся коллекция</h1>
      </div>
      <div className="sort-bar__right">
        <input
          className="sort-bar__search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Поиск по каталогу…"
          aria-label="Поиск по каталогу"
        />
        <select
          className="sort-bar__select"
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          aria-label="Сортировка"
        >
          <option value="popular">По популярности</option>
          <option value="price_asc">Сначала дешевле</option>
          <option value="price_desc">Сначала дороже</option>
        </select>
      </div>
    </div>
  );
}
