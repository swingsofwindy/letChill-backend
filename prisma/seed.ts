// import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
    await seedUser();
    await seedCategory();
    await seedCustomer();
    await seedSupplier();
    await seedStorage();
    await seedProduct();
}

main();

function seedUser() {
    return prisma.user.create({
        data: {
            email: 'owner@gmail.com',
            password:
                '$2b$10$LEu10CHSEulTjNMRqr7QeuplSXd6FnAyMmvDcyf5t4u42Bf6uZaFK',
            role: 'OWNER',
            profile: {
                create: {
                    name: 'Nono',
                    phone: '0378789098',
                },
            },
        },
    });
}

function seedCustomer() {
    return prisma.customer.create({
        data: {
            name: 'Nguyen Van A',
            phoneNumber: '0378789098',
        },
    });
}

function seedCategory() {
    return prisma.category.create({
        data: {
            name: 'Beverages',
        },
    });
}

function seedSupplier() {
    return prisma.supplier.createMany({
        data: [
            {
                name: 'Coca-cola',
                address: '773 Grove Road',
                phoneNumber: '0378789098',
                email: 'coca@gmail.com',
            },
            {
                name: 'Pepsi',
                address: '773 Grove Road',
                phoneNumber: '0398987656',
                email: 'pepsi@email.com',
            },
        ],
    });
}

function seedProduct() {
    return prisma.product.createMany({
        data: [
            {
                name: 'Coca-cola',
                categoryId: 1,
            },
            {
                name: 'Pepsi',
                categoryId: 1,
            },
            {
                name: 'Fanta',
                categoryId: 1,
            },
        ],
    });
}

function seedStorage() {
    return prisma.storage.create({
        data: {
            name: 'StorageA',
            type: 'COLD',
            location: '773 Grove Road',
            total: 648,
        },
    });
}

// const phoneNumbers = [
//     '0355704876',
//     '0335896003',
//     '0368615142',
//     '0353938621',
//     '0336100571',
//     '0348707450',
//     '0367628573',
//     '0382747341',
//     '0355564503',
//     '0374647318',
// ];

// main()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });

// async function seedCategory(count = 30) {
//     await prisma.category.deleteMany({});
//     const categories: Prisma.CategoryCreateManyInput[] = [];

//     for (let i = 0; i < count; i++) {
//         categories.push({
//             name: faker.commerce.department(),
//         });
//     }

//     await prisma.category.createMany({
//         data: categories,
//     });

//     console.log('Seeding categories completed');
// }

// async function seedSupplier(count = 30) {
//     await prisma.supplier.deleteMany({});
//     const suppliers: Prisma.SupplierCreateManyInput[] = [];

//     for (let i = 0; i < count; i++) {
//         suppliers.push({
//             name: faker.company.name(),
//             address: faker.location.streetAddress(),
//             phoneNumber: faker.helpers.arrayElement(phoneNumbers),
//             email: faker.internet.email(),
//         });
//     }

//     await prisma.supplier.createMany({
//         data: suppliers,
//     });

//     console.log('Seeding suppliers completed');
// }

// async function seedStorage(count = 30) {
//     await prisma.storage.deleteMany({});
//     const storages: Prisma.StorageCreateManyInput[] = [];

//     for (let i = 0; i < count; i++) {
//         storages.push({
//             name: faker.commerce.productName(),
//             type: faker.helpers.arrayElement(['REGULAR', 'COLD']),
//             location: faker.location.streetAddress(),
//             quantity: faker.number.int(1000),
//         });
//     }

//     await prisma.storage.createMany({
//         data: storages,
//     });

//     console.log('Seeding storages completed');
// }
