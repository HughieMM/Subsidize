import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data in development
  console.log('🗑️  Cleaning existing data...');
  await prisma.priceObservation.deleteMany({});
  await prisma.storeProduct.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.store.deleteMany({});
  console.log('✅ Cleaned existing data\n');

  // Seed Stores
  console.log('🏪 Seeding stores...');
  const stores = await Promise.all([
    prisma.store.create({
      data: {
        id: 'store-1',
        name: 'MarketPlace',
        websiteUrl: 'https://marketplace.bm',
        supportsDelivery: true,
        parishes: ['Hamilton', 'Pembroke', 'Devonshire', 'Paget', 'Warwick'],
      },
    }),
    prisma.store.create({
      data: {
        id: 'store-2',
        name: "Lindo's Family Foods",
        websiteUrl: 'https://lindos.bm',
        supportsDelivery: true,
        parishes: ['Hamilton', 'Pembroke', 'Devonshire', 'Paget', 'Warwick', 'Southampton', 'Sandys'],
      },
    }),
    prisma.store.create({
      data: {
        id: 'store-3',
        name: 'Supermart',
        websiteUrl: 'https://supermart.bm',
        supportsDelivery: false,
        parishes: ['Hamilton', 'Pembroke'],
      },
    }),
  ]);
  console.log(`✅ Created ${stores.length} stores\n`);

  // Seed Products
  console.log('🥬 Seeding products...');
  const productData = [
    {
      id: 'prod-1',
      canonicalName: 'organic bananas',
      brand: 'Local Farms',
      sizeValue: 1,
      sizeUnit: 'lb',
    },
    {
      id: 'prod-2',
      canonicalName: 'whole milk',
      brand: 'Bermuda Dairy',
      sizeValue: 1,
      sizeUnit: 'gallon',
    },
    {
      id: 'prod-3',
      canonicalName: 'sourdough bread',
      brand: 'Island Bakery',
      sizeValue: 24,
      sizeUnit: 'oz',
    },
    {
      id: 'prod-4',
      canonicalName: 'free range eggs',
      brand: 'Happy Hens',
      sizeValue: 12,
      sizeUnit: 'count',
    },
    {
      id: 'prod-5',
      canonicalName: 'extra virgin olive oil',
      brand: 'Mediterranean Gold',
      sizeValue: 500,
      sizeUnit: 'ml',
    },
    {
      id: 'prod-6',
      canonicalName: 'atlantic salmon fillet',
      brand: null,
      sizeValue: 1,
      sizeUnit: 'lb',
    },
    {
      id: 'prod-7',
      canonicalName: 'organic baby spinach',
      brand: 'Green Valley',
      sizeValue: 10,
      sizeUnit: 'oz',
    },
    {
      id: 'prod-8',
      canonicalName: 'greek yogurt',
      brand: 'Horizon',
      sizeValue: 32,
      sizeUnit: 'oz',
    },
    {
      id: 'prod-9',
      canonicalName: 'jasmine rice',
      brand: 'Royal Umbrella',
      sizeValue: 5,
      sizeUnit: 'lb',
    },
    {
      id: 'prod-10',
      canonicalName: 'dark chocolate 70%',
      brand: 'Lindt',
      sizeValue: 3.5,
      sizeUnit: 'oz',
    },
  ];

  const products = await Promise.all(
    productData.map(data =>
      prisma.product.create({
        data,
      })
    )
  );
  console.log(`✅ Created ${products.length} products\n`);

  // Seed StoreProducts and PriceObservations
  console.log('🏷️  Seeding store products and prices...');

  const storeProductPrices: Array<{
    productId: string;
    storeSku: string;
    rawName: string;
    rawSize: string;
    prices: Array<{ storeId: string; price: number; salePrice?: number }>;
  }> = [
    {
      productId: 'prod-1',
      storeSku: 'BAN-ORG-001',
      rawName: 'Organic Bananas',
      rawSize: '1 lb',
      prices: [
        { storeId: 'store-1', price: 1.99 },
        { storeId: 'store-2', price: 1.79, salePrice: 1.49 },
        { storeId: 'store-3', price: 2.29 },
      ],
    },
    {
      productId: 'prod-2',
      storeSku: 'MLK-WHT-001',
      rawName: 'Bermuda Dairy Whole Milk - 1 Gallon',
      rawSize: '1 gal',
      prices: [
        { storeId: 'store-1', price: 8.99 },
        { storeId: 'store-2', price: 8.49 },
        { storeId: 'store-3', price: 9.29 },
      ],
    },
    {
      productId: 'prod-3',
      storeSku: 'BRD-SRD-001',
      rawName: 'Island Bakery Sourdough Loaf',
      rawSize: '24oz',
      prices: [
        { storeId: 'store-1', price: 5.99 },
        { storeId: 'store-2', price: 6.49 },
        { storeId: 'store-3', price: 5.49, salePrice: 4.99 },
      ],
    },
    {
      productId: 'prod-4',
      storeSku: 'EGG-FRE-012',
      rawName: 'Happy Hens Free Range Eggs (Dozen)',
      rawSize: '12 count',
      prices: [
        { storeId: 'store-1', price: 7.99 },
        { storeId: 'store-2', price: 7.49 },
        { storeId: 'store-3', price: 8.49 },
      ],
    },
    {
      productId: 'prod-5',
      storeSku: 'OIL-OLV-500',
      rawName: 'Mediterranean Gold EVOO',
      rawSize: '500ml',
      prices: [
        { storeId: 'store-1', price: 12.99 },
        { storeId: 'store-2', price: 11.99 },
        { storeId: 'store-3', price: 13.49 },
      ],
    },
    {
      productId: 'prod-6',
      storeSku: 'FSH-SAL-LB',
      rawName: 'Fresh Atlantic Salmon Fillet',
      rawSize: 'per lb',
      prices: [
        { storeId: 'store-1', price: 18.99 },
        { storeId: 'store-2', price: 16.99, salePrice: 14.99 },
        { storeId: 'store-3', price: 19.99 },
      ],
    },
    {
      productId: 'prod-7',
      storeSku: 'PRD-SPN-010',
      rawName: 'Green Valley Organic Baby Spinach',
      rawSize: '10oz',
      prices: [
        { storeId: 'store-1', price: 4.99 },
        { storeId: 'store-2', price: 4.79 },
        { storeId: 'store-3', price: 5.29 },
      ],
    },
    {
      productId: 'prod-8',
      storeSku: 'DRY-YGT-032',
      rawName: 'Horizon Greek Yogurt Plain',
      rawSize: '32oz',
      prices: [
        { storeId: 'store-1', price: 6.99 },
        { storeId: 'store-2', price: 6.49 },
        { storeId: 'store-3', price: 7.49 },
      ],
    },
    {
      productId: 'prod-9',
      storeSku: 'RIC-JAS-5LB',
      rawName: 'Royal Umbrella Jasmine Rice',
      rawSize: '5 lb',
      prices: [
        { storeId: 'store-1', price: 14.99 },
        { storeId: 'store-2', price: 13.99, salePrice: 12.99 },
        { storeId: 'store-3', price: 15.99 },
      ],
    },
    {
      productId: 'prod-10',
      storeSku: 'CHC-LNT-035',
      rawName: 'Lindt Excellence 70% Dark',
      rawSize: '3.5oz',
      prices: [
        { storeId: 'store-1', price: 3.99 },
        { storeId: 'store-2', price: 3.79 },
        { storeId: 'store-3', price: 4.29, salePrice: 3.49 },
      ],
    },
  ];

  let storeProductCount = 0;
  let priceObservationCount = 0;

  for (const item of storeProductPrices) {
    for (const priceData of item.prices) {
      // Create StoreProduct
      const storeProduct = await prisma.storeProduct.create({
        data: {
          storeId: priceData.storeId,
          productId: item.productId,
          storeSku: `${priceData.storeId}-${item.storeSku}`,
          rawName: item.rawName,
          rawSize: item.rawSize,
        },
      });
      storeProductCount++;

      // Create current PriceObservation
      await prisma.priceObservation.create({
        data: {
          storeProductId: storeProduct.id,
          price: priceData.salePrice || priceData.price,
          currency: 'BMD',
          sourceType: 'seed',
          observedAt: new Date(),
        },
      });
      priceObservationCount++;

      // If there's a sale, create historical observation at regular price
      if (priceData.salePrice) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        await prisma.priceObservation.create({
          data: {
            storeProductId: storeProduct.id,
            price: priceData.price,
            currency: 'BMD',
            sourceType: 'seed',
            observedAt: weekAgo,
          },
        });
        priceObservationCount++;
      }
    }
  }

  console.log(`✅ Created ${storeProductCount} store products`);
  console.log(`✅ Created ${priceObservationCount} price observations\n`);

  console.log('✨ Database seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - ${stores.length} stores`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${storeProductCount} store products`);
  console.log(`   - ${priceObservationCount} price observations`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
