const { db, initDb } = require('./database');

initDb();

// Give time for initDb to create tables
setTimeout(() => {
  const products = [
    { title: 'Executive Leather Couch', type: 'Couches', price: 'R 12,500', colour: 'Black', material: 'Genuine Leather', description: 'A premium 3-seater couch for executive lounges. Minimalist design with maximum comfort.', image_url: '' },
    { title: 'Ergonomic Office Chair', type: 'Chairs', price: 'R 2,800', colour: 'Grey', material: 'Mesh', description: 'Breathable mesh chair with adjustable lumbar support and armrests for all-day productivity.', image_url: '' },
    { title: 'Classic Wingback Chair', type: 'Wingback Chairs', price: 'R 6,000', colour: 'Navy Blue', material: 'Velvet', description: 'Elegant wingback chair perfect for reception areas or private offices.', image_url: '' },
    { title: 'Modern Boardroom Table', type: 'Tables', price: 'R 15,000', colour: 'Walnut', material: 'Wood & Steel', description: 'Large 10-seater boardroom table with built-in cable management and power docks.', image_url: '' },
    { title: 'Storage Ottoman', type: 'Ottomans', price: 'R 1,500', colour: 'Charcoal', material: 'Fabric', description: 'Versatile ottoman with hidden storage space. Can be used as extra seating.', image_url: '' }
  ];

  const stmt = db.prepare('INSERT INTO products (title, type, price, colour, material, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  let count = 0;
  products.forEach(p => {
    stmt.run([p.title, p.type, p.price, p.colour, p.material, p.description, p.image_url], () => {
      count++;
      if (count === products.length) {
        console.log('Seed complete!');
        process.exit(0);
      }
    });
  });
}, 1000);
