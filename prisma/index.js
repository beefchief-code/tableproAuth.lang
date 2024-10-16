const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    customer: {
      // TODO: Add register and login methods
      async register(email, password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const customer = await prisma.customer.create({
          data: { email, password: hashedPassword },
        });
        return customer;
      },
      async login(email, password) {
        const customer = await prisma.customer.findUniqueOrThrow({
          where: { email },
        });
        const valid = await bcrypt.compare(password, customer.password);
        if (!valid) throw Error("password invalid");
        return customer;
      },
    },
  },
});

module.exports = prisma;
