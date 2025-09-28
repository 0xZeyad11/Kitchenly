import { PrismaClient } from "@prisma/client";
const globalPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalPrisma.prisma ||
  new PrismaClient({
    log: ["warn", "error"],
    omit: {
      user: {
        password: true,
      },
    },
  }).$extends({
    query: {
      user: {
        async update({ model, operation, args, query }) {
          const { password } = args.data;
          if (password) {
            args.data.passwordUpdatedAt = new Date();
          }
          return query(args);
        },
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma;
export default prisma;
