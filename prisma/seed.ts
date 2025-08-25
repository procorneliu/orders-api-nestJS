/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { faker } from '@faker-js/faker';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prismaClient = new PrismaClient({
  omit: {
    users: {
      password: true,
      passwordConfirm: true,
    },
  },
});

const main = async () => {
  // const roles = ['USER', 'ADMIN'];

  for (let i = 0; i < 60; i++) {
    // Generating fake data for USERS
    const userName = faker.internet.username();
    const userEmail = faker.internet.email();
    const userPassword = await bcrypt.hash(faker.string.alpha(16), 12);

    // Generating fake data for PRODUCTS
    const productName = faker.commerce.productName();
    const productDescription = faker.word.words();
    const productPrice = faker.number.int({ min: 1, max: 10000 });
    const productSlug = faker.helpers.slugify(productName);

    // Generating fake data for ORDERS
    const orderDeliveryLocation = faker.location.streetAddress();

    // Generating fake data for ORDER_ITEMS
    const orderItemQuantity = faker.number.int({ min: 1, max: 100 });

    await prismaClient.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          name: userName,
          email: userEmail,
          password: userPassword,
          passwordConfirm: userPassword,
        },
      });
      const product = await tx.products.create({
        data: {
          name: productName,
          description: productDescription,
          price: productPrice,
          slug: productSlug,
        },
      });
      const order = await tx.orders.create({
        data: {
          deliveryLocation: orderDeliveryLocation,
          userId: user.id,
        },
      });
      await tx.order_items.create({
        data: {
          quantity: orderItemQuantity,
          productId: product.id,
          orderId: order.id,
        },
      });
    });
  }
};

main()
  .catch((err) => {
    console.log(err);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prismaClient.$disconnect();
  });
