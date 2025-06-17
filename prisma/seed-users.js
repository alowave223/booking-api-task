const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    console.log('Seeding users...');

    const users = [
      {
        email: 'admin@booking.com',
        password: 'admin123',
        role: 'ADMIN'
      },
      {
        email: 'user@booking.com',
        password: 'user123',
        role: 'USER'
      },
      {
        email: 'test@booking.com',
        password: 'test123',
        role: 'USER'
      },
      {
        email: 'demo@booking.com',
        password: 'demo123',
        role: 'USER'
      },
      {
        email: 'admin2@booking.com',
        password: 'admin456',
        role: 'ADMIN'
      }
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        continue;
      }

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          role: userData.role
        }
      });

      console.log(`Created user: ${user.email} (${user.role})`);
    }

    console.log('User seeding completed!');
    
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    console.log('\nCreated users:');
    allUsers.forEach(user => {
      console.log(` - ${user.email} (${user.role}) - ID: ${user.id}`);
    });

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers(); 