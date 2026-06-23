const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic tomato sauce, fresh mozzarella, basil leaves on a crispy crust",
    price: 12.99,
    image_url: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400",
    category: "Pizza",
  },
  {
    name: "Pepperoni Pizza",
    description: "Loaded with premium pepperoni slices, mozzarella and tomato sauce",
    price: 14.99,
    image_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
    category: "Pizza",
  },
  {
    name: "Classic Cheeseburger",
    description: "Juicy beef patty, cheddar cheese, lettuce, tomato, pickles and special sauce",
    price: 9.99,
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    category: "Burger",
  },
  {
    name: "BBQ Bacon Burger",
    description: "Double beef patty with crispy bacon, BBQ sauce, onion rings and coleslaw",
    price: 13.49,
    image_url: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400",
    category: "Burger",
  },
  {
    name: "Chicken Tikka Masala",
    description: "Tender chicken in a rich, creamy tomato-based curry sauce with aromatic spices",
    price: 11.99,
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    category: "Curry",
  },
  {
    name: "Paneer Butter Masala",
    description: "Soft paneer cubes in a velvety butter and tomato gravy, served with naan",
    price: 10.99,
    image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    category: "Curry",
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, parmesan shavings, croutons with classic Caesar dressing",
    price: 7.99,
    image_url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    category: "Salad",
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a gooey molten centre, served with vanilla ice cream",
    price: 5.99,
    image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
    category: "Dessert",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();

  // Insert menu items
  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }

  console.log(`✅ Seeded ${menuItems.length} menu items`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
