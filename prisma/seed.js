"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// prisma/seed.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Starting database seed...");
    // Create a chief
    const chief = await prisma.user.create({
        data: {
            name: "Chef Mario",
            email: "mario@kitchenly.com",
            password: "securepass",
            role: client_1.Role.CHIEF,
            lat: 30.0444,
            lng: 31.2357,
        },
    });
    // Create a customer
    const customer = await prisma.user.create({
        data: {
            name: "John Doe",
            email: "john@example.com",
            password: "123456",
            role: client_1.Role.CUSTOMER,
            lat: 30.033,
            lng: 31.233,
        },
    });
    // Add menu items for the chief
    const pizza = await prisma.menuItem.create({
        data: {
            name: "Margherita Pizza",
            description: "Classic Italian pizza with fresh tomatoes, mozzarella, and basil.",
            price: 12.5,
            foodType: client_1.FoodType.ITALIAN,
            itemType: client_1.ItemType.MAINDISH,
            chief_id: chief.id,
        },
    });
    const tiramisu = await prisma.menuItem.create({
        data: {
            name: "Tiramisu",
            description: "Traditional Italian dessert with coffee and mascarpone.",
            price: 7.0,
            foodType: client_1.FoodType.ITALIAN,
            itemType: client_1.ItemType.DESSERT,
            chief_id: chief.id,
        },
    });
    // Create an order for the customer
    const order = await prisma.order.create({
        data: {
            customer_id: customer.id,
            chief_id: chief.id,
            orderitems: {
                create: [
                    {
                        menuitem_id: pizza.id,
                        quantity: 2,
                        order_status: client_1.OrderStatus.PENDING,
                    },
                    {
                        menuitem_id: tiramisu.id,
                        quantity: 1,
                        order_status: client_1.OrderStatus.PENDING,
                    },
                ],
            },
        },
        include: { orderitems: true },
    });
    console.log("✅ Seeding finished!");
    console.log({ chief, customer, pizza, tiramisu, order });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
