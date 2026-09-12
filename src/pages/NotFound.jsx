import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-pad">
      <div className="empty-state">
        <div className="empty-state__icon">404</div>
        <h3>Страница не найдена</h3>
        <p>
          Такой страницы не существует или она была перемещена.<br />
          Вернитесь на главную или загляните в каталог.
        </p>
        <Link to="/" className="empty-state__btn">На главную</Link>
      </div>
    </div>
  );
}
