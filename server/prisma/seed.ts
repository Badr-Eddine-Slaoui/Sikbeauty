import { PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🗑️  Clearing database...');
  
  // Delete in correct order due to foreign key constraints
  await prisma.product.deleteMany({});
  console.log('✅ Deleted all products');
  
  await prisma.category.deleteMany({});
  console.log('✅ Deleted all categories');
  
  await prisma.user.deleteMany({});
  console.log('✅ Deleted all users');
  
  console.log('✨ Database cleared successfully!');
}

async function main() {
  // Clear database first
  await clearDatabase();
  
  console.log('🌱 Starting database seed...');

  // Create Categories - Reduced to 3
  const categories = [
    {
      name: 'Serums & Treatments',
      slug: 'serums-treatments',
      isActive: true,
    },
    {
      name: 'Cleansers & Toners',
      slug: 'cleansers-toners',
      isActive: true,
    },
    {
      name: 'Moisturizers & Sunscreen',
      slug: 'moisturizers-sunscreen',
      isActive: true,
    },
  ];

  console.log('📦 Creating categories...');
  const createdCategories :{ id: number; name: string; slug: string; isActive: boolean }[]= [];
  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug },
    });
    
    if (!existing) {
      const created = await prisma.category.create({
        data: category,
      });
      createdCategories.push(created);
      console.log(`✅ Created category: ${category.name}`);
    } else {
      createdCategories.push(existing);
      console.log(`⏭️  Category already exists: ${category.name}`);
    }
  }

  // Create Products - 6+ products per category
  const products = [
    // Serums & Treatments (6 products)
    {
      title: 'Glow Serum - Vitamin C Brightening',
      description: 'A powerful brightening ampoule that balances tone and refines the look of pores for glowy, radiant skin. Infused with Vitamin C and niacinamide.',
      price: 2999,
      discountType: 'PERCENT' as const,
      discount: 15,
      thumbnailUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[0].id,
    },
    {
      title: 'Retinol Night Serum',
      description: 'Advanced anti-aging serum with retinol and peptides. Reduces fine lines and improves skin texture overnight.',
      price: 3999,
      discountType: 'PERCENT' as const,
      discount: 12,
      thumbnailUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[0].id,
    },
    {
      title: 'Niacinamide Pore Refining Serum',
      description: 'Concentrated niacinamide serum that minimizes pores, controls oil, and improves skin texture.',
      price: 2799,
      discountType: 'PERCENT' as const,
      discount: 15,
      thumbnailUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[0].id,
    },
    {
      title: 'Peptide Firming Ampoule',
      description: 'High-performance peptide ampoule that firms skin and reduces signs of aging. Ideal for mature skin.',
      price: 4499,
      discountType: 'PERCENT' as const,
      discount: 10,
      thumbnailUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[0].id,
    },
    {
      title: 'Centella Calming Serum',
      description: 'Soothing serum with centella asiatica extract. Perfect for sensitive and irritated skin.',
      price: 2599,
      discountType: 'PERCENT' as const,
      discount: 18,
      thumbnailUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[0].id,
    },
    {
      title: 'Hyaluronic Acid Hydrating Booster',
      description: 'Concentrated hyaluronic acid serum with multiple molecular weights for deep hydration at every skin layer.',
      price: 3199,
      discountType: 'PERCENT' as const,
      discount: 15,
      thumbnailUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[0].id,
    },

    // Cleansers & Toners (6 products)
    {
      title: 'Gentle Cleansing Oil',
      description: 'A luxurious cleansing oil that melts away makeup and impurities while nourishing the skin. Suitable for all skin types.',
      price: 1899,
      discountType: 'PERCENT' as const,
      discount: 20,
      thumbnailUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[1].id,
    },
    {
      title: 'AHA/BHA Exfoliating Toner',
      description: 'Gentle exfoliating toner with AHA and BHA acids. Unclogs pores, smooths texture, and brightens the complexion.',
      price: 2699,
      discountType: 'PERCENT' as const,
      discount: 15,
      thumbnailUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[1].id,
    },
    {
      title: 'Hydrating Essence - Snail Mucin',
      description: 'Deeply hydrating essence with 96% snail mucin extract. Perfect for dry and dehydrated skin, leaving it plump and glowing.',
      price: 2499,
      discountType: 'PERCENT' as const,
      discount: 10,
      thumbnailUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[1].id,
    },
    {
      title: 'Foaming Gel Cleanser - pH Balanced',
      description: 'Low pH foaming cleanser that thoroughly cleanses without stripping natural oils. Great for oily and combination skin.',
      price: 1699,
      discountType: 'PERCENT' as const,
      discount: 22,
      thumbnailUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[1].id,
    },
    {
      title: 'Micellar Cleansing Water',
      description: 'All-in-one micellar water that cleanses, removes makeup, and tones in one step. No rinsing required.',
      price: 1499,
      discountType: 'PERCENT' as const,
      discount: 25,
      thumbnailUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[1].id,
    },
    {
      title: 'Rose Water Refreshing Toner',
      description: 'Alcohol-free toner with pure rose water. Hydrates, soothes, and preps skin for better product absorption.',
      price: 1999,
      discountType: 'PERCENT' as const,
      discount: 18,
      thumbnailUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[1].id,
    },

    // Moisturizers & Sunscreen (6 products)
    {
      title: 'Intensive Moisturizing Cream',
      description: 'Rich, nourishing cream with ceramides and hyaluronic acid. Provides 24-hour hydration and strengthens the skin barrier.',
      price: 3299,
      discountType: 'PERCENT' as const,
      discount: 15,
      thumbnailUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[2].id,
    },
    {
      title: 'SPF 50+ Sunscreen - Lightweight',
      description: 'Lightweight, non-greasy sunscreen with SPF 50+. Provides broad-spectrum protection without leaving a white cast.',
      price: 2299,
      discountType: 'PERCENT' as const,
      discount: 20,
      thumbnailUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[2].id,
    },
    {
      title: 'Gel Moisturizer - Oil Control',
      description: 'Lightweight gel moisturizer perfect for oily and acne-prone skin. Hydrates without clogging pores.',
      price: 2499,
      discountType: 'PERCENT' as const,
      discount: 18,
      thumbnailUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[2].id,
    },
    {
      title: 'Night Recovery Cream',
      description: 'Ultra-nourishing night cream with peptides and botanical oils. Repairs and regenerates skin overnight.',
      price: 3899,
      discountType: 'PERCENT' as const,
      discount: 12,
      thumbnailUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[2].id,
    },
    {
      title: 'Mineral Sunscreen SPF 45',
      description: 'Physical sunscreen with zinc oxide and titanium dioxide. Reef-safe formula ideal for sensitive skin.',
      price: 2699,
      discountType: 'PERCENT' as const,
      discount: 18,
      thumbnailUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[2].id,
    },
    {
      title: 'Barrier Repair Moisturizer',
      description: 'Specialized moisturizer with ceramide complex to repair damaged skin barrier and lock in moisture.',
      price: 3599,
      discountType: 'PERCENT' as const,
      discount: 15,
      thumbnailUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: true,
      categoryId: createdCategories[2].id,
    },
  ];

  console.log('🛍️  Creating products...');
  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { title: product.title },
    });
    
    if (!existing) {
      await prisma.product.create({
        data: product,
      });
      console.log(`✅ Created product: ${product.title}`);
    } else {
      console.log(`⏭️  Product already exists: ${product.title}`);
    }
  }

  // Create a test user (Individual role)
  const hashedPassword = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      fullName: 'Test User',
      email: 'test@example.com',
      phoneCountryCode: '+212',
      phoneNumber: '612345678',
      country: 'Morocco',
      role: 'Individual',
      password: hashedPassword,
      isEmailVerified: true,
    },
  });
  console.log(`✅ Test user created/updated: ${testUser.email}`);

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });