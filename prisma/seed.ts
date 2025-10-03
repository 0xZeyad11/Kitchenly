// prisma/seed.ts
import { PrismaClient, Role, FoodType, ItemType, OrderStatus } from '@prisma/client'
import { CreateUserService } from '../src/modules/user/user.service'

const prisma = new PrismaClient()


// async function clearDB() {
//   await prisma.orderItem.deleteMany()
//   await prisma.order.deleteMany()
//   await prisma.menuItem.deleteMany()
//   await prisma.user.deleteMany()
// }
async function main() {
  console.log("🌱 Starting database seed...")
  // await clearDB(); 
  // Create a chief
  const chief = await CreateUserService({
      name: "Chef Mario",
      email: "mario@kitchenly.com",
      password: "securepass",
      role: Role.CHEF,
      lat: 30.0444,
      lng: 31.2357,
  })

  // Create a customer
  const customer = await CreateUserService(
    {
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
      role: "CHEF",
      lat: 30.033,
      lng: 31.233,
  })

  // Add menu items for the chief
  const pizza = await prisma.menuItem.create({
    data: {
      name: "Margherita Pizza",
      description: "Classic Italian pizza with fresh tomatoes, mozzarella, and basil.",
      price: 12.5,
      foodType: FoodType.ITALIAN,
      itemType: ItemType.MAINDISH,
      chef_id: chief.id,
    },
  })

  const tiramisu = await prisma.menuItem.create({
    data: {
      name: "Tiramisu",
      description: "Traditional Italian dessert with coffee and mascarpone.",
      price: 7.0,
      foodType: FoodType.ITALIAN,
      itemType: ItemType.DESSERT,
      chef_id: chief.id,
    },
  })

  // Create an order for the customer
  const order = await prisma.order.create({
    data: {
      customer_id: customer.id,
      chef_id: chief.id,
      order_status: OrderStatus.PENDING,
      total_price: 102,
      orderitems: {
        create: [
          {
            menuitem_id: pizza.id,
            quantity: 2,
            item_price: 111,
          },
          {
            menuitem_id: tiramisu.id,
            quantity: 1,
            item_price: 23,
          },
        ],
      },
    },
    include: { orderitems: true },
  })

  console.log("✅ Seeding finished!")
  //TODO fix order status on the order seed data , and add order to the log 
  console.log({ chief, customer, pizza, tiramisu})

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
