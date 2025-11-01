// prisma/seed.ts
import { PrismaClient, Role, FoodType, ItemType, OrderStatus, User, MenuItem } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const saltRounds = 10

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds)
}

async function clearDB() {
  console.log("🧹 Clearing existing data...")
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.user.deleteMany()
}

// Alexandria coordinates bounds
const ALEXANDRIA_LOCATIONS = [
  { name: "City Center", lat: 31.2001, lng: 29.9187 },
  { name: "Mansheya", lat: 31.1934, lng: 29.8954 },
  { name: "Al Attarin", lat: 31.1978, lng: 29.9056 },
  { name: "San Stefano", lat: 31.2396, lng: 29.9487 },
  { name: "Sidi Bishr", lat: 31.2665, lng: 30.0165 },
  { name: "Miami", lat: 31.2892, lng: 30.0150 },
  { name: "Montaza", lat: 31.2896, lng: 30.0178 },
  { name: "Mandara", lat: 31.2794, lng: 30.0272 },
  { name: "Asafra", lat: 31.2931, lng: 30.0350 },
  { name: "Al Agamy", lat: 31.0667, lng: 29.7500 },
  { name: "Borg Al Arab", lat: 31.1333, lng: 29.8000 },
  { name: "King Mariout", lat: 31.1667, lng: 29.8667 },
  { name: "Gleem", lat: 31.2578, lng: 29.9950 },
  { name: "Sporting", lat: 31.2156, lng: 29.9464 },
  { name: "Sidi Gaber", lat: 31.2439, lng: 29.9661 },
  { name: "Smouha", lat: 31.2046, lng: 29.9461 },
  { name: "Roushdy", lat: 31.2100, lng: 29.9400 },
  { name: "Loran", lat: 31.2658, lng: 30.0069 },
  { name: "Victoria", lat: 31.2500, lng: 29.9833 },
  { name: "Maamoura", lat: 31.2665, lng: 30.0165 }
]

// Sample names for variety
const CHEF_NAMES = [
  "Chef Mario", "Chef Giovanni", "Chef Fatima", "Chef Ahmed", "Chef Sophia",
  "Chef Marco", "Chef Layla", "Chef Hassan", "Chef Isabella", "Chef Omar"
]

const CUSTOMER_NAMES = [
  "John Doe", "Sarah Smith", "Michael Brown", "Emma Wilson", "David Johnson",
  "Lisa Garcia", "Robert Miller", "Maria Martinez", "James Davis", "Laura Rodriguez",
  "Thomas Hernandez", "Jennifer Lopez", "Charles Gonzalez", "Susan Wilson", "Daniel Anderson"
]

// Menu items by cuisine
const MENU_ITEMS_BY_CUISINE = {
  ITALIAN: [
    { name: "Margherita Pizza", description: "Classic Italian pizza with fresh tomatoes, mozzarella, and basil.", price: 12.5, itemType: ItemType.MAINDISH },
    { name: "Spaghetti Carbonara", description: "Creamy pasta with eggs, cheese, pancetta, and pepper.", price: 15.0, itemType: ItemType.MAINDISH },
    { name: "Tiramisu", description: "Traditional Italian dessert with coffee and mascarpone.", price: 7.0, itemType: ItemType.DESSERT }
  ],
  LEBANESE: [
    { name: "Hummus", description: "Creamy chickpea dip with tahini and lemon.", price: 5.0, itemType: ItemType.MAINDISH },
    { name: "Shawarma Plate", description: "Marinated meat with rice and vegetables.", price: 18.0, itemType: ItemType.MAINDISH },
    { name: "Baklava", description: "Sweet pastry with nuts and honey.", price: 6.5, itemType: ItemType.DESSERT }
  ],
  EGYPTIAN: [
    { name: "Koshari", description: "Traditional Egyptian dish with rice, lentils, and pasta.", price: 8.0, itemType: ItemType.MAINDISH },
    { name: "Ful Medames", description: "Fava beans with garlic and lemon.", price: 6.0, itemType: ItemType.MAINDISH },
    { name: "Basbousa", description: "Semolina cake with syrup.", price: 4.5, itemType: ItemType.DESSERT }
  ],
  CHINESE: [
    { name: "Kung Pao Chicken", description: "Spicy stir-fried chicken with peanuts.", price: 14.0, itemType: ItemType.MAINDISH },
    { name: "Fried Rice", description: "Rice stir-fried with vegetables and egg.", price: 10.0, itemType: ItemType.MAINDISH },
    { name: "Fortune Cookies", description: "Crispy cookies with fortune messages.", price: 3.0, itemType: ItemType.DESSERT }
  ],
  SEAFOOD: [
    { name: "Grilled Sea Bass", description: "Fresh sea bass with herbs and lemon.", price: 22.0, itemType: ItemType.MAINDISH },
    { name: "Shrimp Scampi", description: "Garlic butter shrimp with pasta.", price: 19.0, itemType: ItemType.MAINDISH },
    { name: "Lemon Sorbet", description: "Refreshing lemon frozen dessert.", price: 5.5, itemType: ItemType.DESSERT }
  ]
}

// Helper to set location using PostGIS
async function setUserLocation(userId: string, lat: number, lng: number): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "User"
    SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
    WHERE id = ${userId};
  `
}

async function main() {
  console.log("🌱 Starting database seed...")

  await clearDB()

  // Create chefs
  console.log("👨‍🍳 Creating chefs...")
  const chefs: User[] = []
  for (let i = 0; i < 8; i++) {
    const location = ALEXANDRIA_LOCATIONS[i % ALEXANDRIA_LOCATIONS.length]
    const randomFoodType = Object.values(FoodType)[Math.floor(Math.random() * Object.values(FoodType).length)]
    const hashedPassword = await hashPassword("securepass123")

    const variedLat = location.lat + (Math.random() * 0.01 - 0.005)
    const variedLng = location.lng + (Math.random() * 0.01 - 0.005)

    const chef = await prisma.user.create({
      data: {
        name: CHEF_NAMES[i],
        email: `chef${i + 1}@kitchenly.com`,
        password: hashedPassword,
        role: Role.CHEF,
      },
    })

    await setUserLocation(chef.id, variedLat, variedLng)

    const cuisineKeys = Object.keys(MENU_ITEMS_BY_CUISINE)
    const cuisineKey = cuisineKeys[i % cuisineKeys.length] as keyof typeof MENU_ITEMS_BY_CUISINE
    const menuItemsData = MENU_ITEMS_BY_CUISINE[cuisineKey]

    for (const itemData of menuItemsData) {
      await prisma.menuItem.create({
        data: {
          ...itemData,
          foodType: randomFoodType,
          chef_id: chef.id,
        },
      })
    }

    chefs.push(chef)
    console.log(`✅ Created chef: ${chef.name} at ${location.name}`)
  }

  // Create customers
  console.log("👥 Creating customers...")
  const customers: User[] = []
  for (let i = 0; i < 15; i++) {
    const location = ALEXANDRIA_LOCATIONS[Math.floor(Math.random() * ALEXANDRIA_LOCATIONS.length)]
    const hashedPassword = await hashPassword("password123")
    const variedLat = location.lat + (Math.random() * 0.02 - 0.01)
    const variedLng = location.lng + (Math.random() * 0.02 - 0.01)

    const customer = await prisma.user.create({
      data: {
        name: CUSTOMER_NAMES[i],
        email: `customer${i + 1}@example.com`,
        password: hashedPassword,
        role: Role.CUSTOMER,
      },
    })

    await setUserLocation(customer.id, variedLat, variedLng)
    customers.push(customer)
    console.log(`✅ Created customer: ${customer.name} at ${location.name}`)
  }

  // Create orders
  console.log("📦 Creating orders...")
  const menuItems: MenuItem[] = await prisma.menuItem.findMany()

  for (let i = 0; i < 10; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const chef = chefs[Math.floor(Math.random() * chefs.length)]
    const chefMenuItems = menuItems.filter(item => item.chef_id === chef.id)

    if (chefMenuItems.length === 0) continue

    const selectedItems = chefMenuItems.slice(0, Math.floor(Math.random() * 3) + 1)
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * (Math.floor(Math.random() * 3) + 1), 0)

    await prisma.order.create({
      data: {
        customer_id: customer.id,
        chef_id: chef.id,
        order_status: Math.random() > 0.3 ? OrderStatus.ACCEPTED : OrderStatus.PENDING,
        total_price: totalPrice,
        orderitems: {
          create: selectedItems.map(item => ({
            menuitem_id: item.id,
            quantity: Math.floor(Math.random() * 3) + 1,
            item_price: item.price,
          })),
        },
      },
    })

    console.log(`📦 Created order #${i + 1} from ${customer.name} to ${chef.name}`)
  }

  // Create admin
  console.log("👑 Creating admin user...")
  const adminHashedPassword = await hashPassword("adminpass123")
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@kitchenly.com",
      password: adminHashedPassword,
      role: Role.ADMIN,
    },
  })
  await setUserLocation(admin.id, 31.2001, 29.9187)

  console.log("✅ Seeding finished!")

  // Verify data counts
  const [chefsCount, customersCount, adminCount, menuCount, orderCount, orderItemCount] = await Promise.all([
    prisma.user.count({ where: { role: Role.CHEF } }),
    prisma.user.count({ where: { role: Role.CUSTOMER } }),
    prisma.user.count({ where: { role: Role.ADMIN } }),
    prisma.menuItem.count(),
    prisma.order.count(),
    prisma.orderItem.count(),
  ])

  const usersWithLocation = await prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*) as count FROM "User" WHERE location IS NOT NULL
  `

  console.log(`
📊 Final Counts:
Chefs: ${chefsCount}
Customers: ${customersCount}
Admins: ${adminCount}
Menu items: ${menuCount}
Orders: ${orderCount}
Order items: ${orderItemCount}
Users with location set: ${usersWithLocation[0].count}
  `)

  // Verify sample data (with location as WKT)
  const sampleChefs = await prisma.$queryRaw<{ name: string; coords: string }[]>`
    SELECT name, ST_AsText(location) as coords FROM "User" WHERE role = 'CHEF' LIMIT 3;
  `
  console.log("👨‍🍳 Sample Chefs:", sampleChefs.map(c => `${c.name} (${c.coords})`).join(", "))

  const sampleCustomers = await prisma.$queryRaw<{ name: string; coords: string }[]>`
    SELECT name, ST_AsText(location) as coords FROM "User" WHERE role = 'CUSTOMER' LIMIT 3;
  `
  console.log("👥 Sample Customers:", sampleCustomers.map(c => `${c.name} (${c.coords})`).join(", "))

  // Test nearby query
  if (customers.length > 0) {
    const testCustomer = customers[0]
    const nearbyChefs = await prisma.$queryRaw<{ id: string; name: string; distance: number }[]>`
      SELECT 
        u.id,
        u.name,
        ST_Distance(u.location, ref.location) AS distance
      FROM "User" u
      JOIN "User" ref ON ref.id = ${testCustomer.id}
      WHERE u.id <> ref.id
      AND u.role = 'CHEF'
      AND ST_DWithin(u.location, ref.location, 10000)
      ORDER BY distance ASC
      LIMIT 3;
    `
    console.log(`🧭 Nearby chefs for ${testCustomer.name}:`, nearbyChefs.map(c => `${c.name} (${Math.round(c.distance)}m)`).join(", "))
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

