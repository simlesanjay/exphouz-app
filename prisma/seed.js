const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Clean Database (Delete in order of dependencies: Child -> Parent)
    console.log('Cleaning existing data...');
    try {
        await prisma.message.deleteMany();
        await prisma.conversation.deleteMany();
        await prisma.requirementResponse.deleteMany();
        await prisma.requirementImage.deleteMany();
        await prisma.requirement.deleteMany();
        await prisma.savedProfessional.deleteMany();
        await prisma.savedProject.deleteMany();
        await prisma.projectImage.deleteMany();
        await prisma.project.deleteMany();
        await prisma.review.deleteMany();
        await prisma.appointment.deleteMany();
        await prisma.professionalService.deleteMany();
        // Delete profiles before users
        await prisma.professionalProfile.deleteMany();
        await prisma.clientProfile.deleteMany();
        // Delete auth related
        await prisma.account.deleteMany();
        await prisma.session.deleteMany();
        // Finally delete users
        await prisma.user.deleteMany();

        // Optional: clear subcategories if you want a fresh start, ensuring no IDs conflict if we hardcoded them (we don't here)
        // await prisma.subCategory.deleteMany();
        // await prisma.category.deleteMany();
    } catch (error) {
        console.error('Error cleaning database:', error);
        // Continue anyway? If delete fails, create might fail too, but let's try.
    }

    // 2. Categories
    console.log('Seeding categories...');
    const categoriesData = [
        {
            name: 'Architects',
            subCategories: [
                'Residential Architect', 'Commercial Architect', 'Institutional Architect',
                'Industrial Architect', 'Landscape Architect', 'Vastu Architect',
                'Urban Designer', 'Healthcare Architect', 'Conservation Architect'
            ]
        },
        {
            name: 'Interior Designers',
            subCategories: [
                'Residential Interior Designer', 'Commercial Interior Designer',
                'Corporate Office Designer', 'Kitchen and Bath Designer',
                'Sustainable Designer', 'Accessibility Designer'
            ]
        },
        {
            name: 'Product Designers',
            subCategories: [
                'Furniture Designer', 'Lighting Designer', 'Industrial Designer',
                'Surface/Material Designer', 'Smart Home Designer'
            ]
        },
        {
            name: 'Contractors',
            subCategories: [
                'Civil Contractor', 'Electrical Contractor', 'Plumbing Contractor',
                'HVAC Contractor', 'Roofing Contractor', 'Carpenter',
                'Concrete Contractor', 'Painting Contractor', 'Landscaping Contractor'
            ]
        }
    ];

    for (const cat of categoriesData) {
        const category = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: { name: cat.name },
        });

        for (const sub of cat.subCategories) {
            const existing = await prisma.subCategory.findFirst({
                where: { name: sub, categoryId: category.id }
            });

            if (!existing) {
                await prisma.subCategory.create({
                    data: {
                        name: sub,
                        categoryId: category.id
                    }
                });
            }
        }
    }

    // 3. Create Users
    console.log('Creating test users...');

    // Admin
    const adminHash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@exphouz.com',
            passwordHash: adminHash,
            role: 'ADMIN',
            emailVerified: new Date(),
        }
    });

    // Client
    const clientHash = await bcrypt.hash('client123', 10);
    const clientUser = await prisma.user.create({
        data: {
            name: 'Client User',
            email: 'client@exphouz.com',
            passwordHash: clientHash,
            role: 'CLIENT',
            emailVerified: new Date(),
        }
    });
    // Create Client Profile
    await prisma.clientProfile.create({
        data: {
            userId: clientUser.id,
            displayName: 'Client User',
            city: 'Mumbai'
        }
    });

    // Professional
    const proHash = await bcrypt.hash('pro123', 10);
    const proUser = await prisma.user.create({
        data: {
            name: 'Dr. Professional',
            email: 'pro@exphouz.com',
            passwordHash: proHash,
            role: 'PROFESSIONAL',
            emailVerified: new Date(),
        }
    });

    // Professional Profile
    await prisma.professionalProfile.create({
        data: {
            userId: proUser.id,
            displayName: 'Ar. Expert Pro',
            profession: ['Architect', 'Interior Designer'],
            city: 'Mumbai',
            verificationStatus: 'VERIFIED',
            experienceYears: 5,
            shortBio: 'Experienced professional with a demonstrated history of working in the architecture & planning industry.',
            specialization: [],
            languages: ['English', 'Hindi'],
            preferredTypes: [],
            preferredLocations: [],
            portfolioImages: [],
            services: {
                // Not linking services for simplicity, verifying basic seed first
            }
        }
    });

    console.log('Seeding completed.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
