const BRANDS = [
  { name: 'Urban Wear', href: '/catalog?brand=Urban+Wear' },
  { name: 'Denim Lab',  href: '/catalog?brand=Denim+Lab' },
  { name: 'North Club', href: '/catalog?brand=North+Club' },
  { name: 'Monochrome', href: '/catalog?brand=Monochrome' },
];

export default function BrandsSection() {
  return (
    <section className="brands" id="about" aria-label="Бренды">
      {BRANDS.map(({ name, href }) => (
        <a key={name} href={href} className="brands__item">
          {name}
        </a>
      ))}
    </section>
  );
}
