import { PrismaClient , Prisma } from "@prisma/client";
import {prismaExtensions} from './extensions' ; 

type GlobalPrismaClient = {
  prisma: ReturnType<typeof createPrismaClient> | undefined ; 
}

const PRISMA_CONFIG: Prisma.PrismaClientOptions = {
  log: ["warn" , "error"] as const,
  omit: {
    user:{
      password: true ,
    },
    menuItem:{
      chef_id:true,
    }
  }
} ; 


const createPrismaClient = () => {
  return new PrismaClient(PRISMA_CONFIG).$extends(prismaExtensions);
}

const globalForPrisma = global as unknown as GlobalPrismaClient;

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if(process.env.NODE_ENV !== "production"){
  globalForPrisma.prisma = prisma ;
}

export default prisma ; 