import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const main = async ()=>{

    await prisma!.$queryRaw`SET "app.CurrentTenant"="cl9td4h6f0171lctsaodp9f1f"`;
 const companies  = await prisma!.company.findMany();
 console.table(companies);
 await prisma!.$queryRaw`SET "app.CurrentTenant"="cl9td4h6f0171lctsaodp9f1f"`;
 const companies2  = await prisma!.company.findMany();
 console.table(companies2);
}

main();