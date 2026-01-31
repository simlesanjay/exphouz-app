const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking Professionals...');
    const pros = await prisma.professionalProfile.findMany({
        include: {
            projects: {
                include: { images: true }
            }
        }
    });

    console.log(`Found ${pros.length} professionals.`);

    pros.forEach(p => {
        console.log(`\nProfessional: ${p.displayName} (ID: ${p.id})`);
        console.log(`- Project Count: ${p.projects.length}`);
        p.projects.forEach(proj => {
            console.log(`  - Project: ${proj.title} (Status: ${proj.status})`);
            console.log(`  - Images: ${proj.images.length}`);
            if (proj.images.length > 0) {
                console.log(`    - Cover: ${proj.images[0].url.substring(0, 50)}...`);
            }
        });
    });

    if (pros.length === 0) {
        console.log("No professionals found. Make sure you have users with role PROFESSIONAL.");
    }
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
