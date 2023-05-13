import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient()

const main = async ()=>{

//     await prisma!.$queryRaw`SET "app.CurrentTenant"="cl9td4h6f0171lctsaodp9f1f"`;
//  const companies  = await prisma!.company.findMany();
//  console.table(companies);
//  await prisma!.$queryRaw`SET "app.CurrentTenant"="cl9td4h6f0171lctsaodp9f1f"`;
//  const companies2  = await prisma!.company.findMany();
//  console.table(companies2);
const include = {
    productVariants: true,
    productUnit: true,
    productPurchaseUnit: true,
    productsSaleUnit: true,
    category: true,
    brand: true
};

const products = await prisma!.product.findMany({
    include,
});
const warehouses = await prisma!.warehouse.findMany({select:{id:true,}});
const productWarehouseData = warehouses.flatMap((w)=>{
    return products.flatMap((p)=>{
    if(p.isVariant){
      return  p.productVariants.map((v)=>{
            return {
                productId:p.id,
                tenantId:p.tenantId,
                productVariantId:v.id,
                qty:0,
                warehouseId:w.id
            };
        })
    }else{
        return[ {
            productId:p.id,
            tenantId:p.tenantId,
            qty:0,
            warehouseId:w.id
        }];
    }
});
});

await prisma!.productWarehouse.createMany({
data:productWarehouseData
})
}

main();