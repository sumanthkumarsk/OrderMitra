import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Database...')

  // 1. Create a dummy restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { phone: '+919876543210' },
    update: {},
    create: {
      name: 'Spicy Mitra Demo',
      slug: 'spicy-mitra-demo',
      phone: '+919876543210',
      currency: 'INR',
      plan: 'TRIAL',
      isActive: true,
    },
  })

  console.log(`Created Restaurant: ${restaurant.name} (ID: ${restaurant.id})`)

  // 2. Create Staff
  await prisma.staff.upsert({
    where: { restaurantId_phone: { restaurantId: restaurant.id, phone: '+919876543210' } },
    update: {},
    create: {
      restaurantId: restaurant.id,
      name: 'Demo Owner',
      phone: '+919876543210',
      role: 'OWNER',
    }
  })

  // 3. Create Menu Categories
  const catStarters = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: 'Starters', displayOrder: 1 }
  })
  const catMains = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: 'Main Course', displayOrder: 2 }
  })

  // 4. Create Menu Items
  await prisma.menuItem.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: catStarters.id,
      name: 'Paneer Tikka',
      description: 'Cottage cheese marinated in spices and grilled in a tandoor.',
      price: 220.00,
      isVeg: true,
      displayOrder: 1
    }
  })

  await prisma.menuItem.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: catMains.id,
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice cooked with tender chicken and authentic spices.',
      price: 350.00,
      isVeg: false,
      displayOrder: 1
    }
  })

  // 5. Create Tables
  await prisma.restaurantTable.create({
    data: { restaurantId: restaurant.id, tableNumber: '1' }
  })
  await prisma.restaurantTable.create({
    data: { restaurantId: restaurant.id, tableNumber: '2' }
  })

  console.log('Seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
