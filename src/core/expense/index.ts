 import { prisma, } from "@/core";
// import { Prisma, RecordStatus } from "@prisma/client";
// const include={
//     productVariants:true,
//     productUnit:true,
//     productPurchaseUnit:true,
//     productsSaleUnit:true,
//     category:true,
//     brand:true
// };

// export type CreateProductInput = {
//     name: string
//     code: string
//     typeBarcode: string
//     note?: string
//     image?: string
//     cost: number
//     price: number
//     categoryId: number
//     brandId?: number
//     unitId?: number
//     unitSaleId?: number
//     unitPurchaseId?: number
//     taxNet?: number
//     taxMethod?: string
//     stockAlert?: number
//     isVariant: boolean
//     isImei: boolean
//     isActive?: boolean
//     productVariants?: Array<string>
//     tenantId: string
// }
// export const createProduct = async (input: CreateProductInput) => {
//     const { tenantId, productVariants, ...data } = input;
//     let variants={};
//     if(productVariants&&productVariants.length){
//         variants={
//             productVariants:{
//             createMany:{
//             skipDuplicates:true,
//             data:productVariants.map((v)=>({
//                 name:v,tenantId
//             }))
//         }   
//     }}
        
//     }
//     return prisma!.product.create({
//        include,
//         data: { tenantId: tenantId, ...data, ...variants}})
// }
// export type UpdateProductInput = {
//     id: number
//     name?: string
//     code?: string
//     typeBarcode?: string
//     note?: string
//     image?: string
//     cost?: number
//     price?: number
//     categoryId?: number
//     brandId?: number
//     unitId?: number
//     unitSaleId?: number
//     unitPurchaseId?: number
//     taxNet?: number
//     taxMethod?: string
//     stockAlert?: number
//     isVariant?: boolean
//     isImei?: boolean
//     isActive?: boolean
//     productVariants?: Array<string>
//     tenantId: string
// }
// export const updateProduct = async (input: UpdateProductInput) => {
//     const {tenantId, id, productVariants,...data} = input;
//     const product = await prisma!.product.findUnique({where:{id},include:{
//         productVariants:true
//     }});
//    let variants = {};
//     if(productVariants&&product&&product.productVariants&&product.productVariants.length){
//         const savedVariants=product.productVariants.map((v)=>v.name);
//         const variantToDelete = product.productVariants.filter((v)=>!productVariants.includes(v.name??""))
//         .map((v)=>({id:v.id}));
//         const variantsToCreate = productVariants.filter((v)=>!savedVariants.includes(v)).map((name)=>({name,tenantId}));
//        variants= { 
//             productVariants:{
//             createMany:{data:variantsToCreate},
//             deleteMany:variantToDelete,
            
//         } }
//     }
//     return prisma!.product.update({
//         include,
//         where: {
//             id: id
//         },
//         data: {...data,...variants}
//     })
// };
// type ProductId = number
// type ProductIds = Array<number>
// export const getUniqueProduct = async (id: ProductId) => {

//     return prisma!.product.findUnique({
//         include,
//         where: {
//             id: id
//         }
//     })
// };
// export const deleteProduct = async (id: ProductId) => {

//     return prisma!.product.update({
//         include,
//         where: {
//             id: id
//         },
//         data: {
//             recordStatus: RecordStatus.DELETED
//         }
//     })
// };
// export const deleteManyProduct = async (ids: ProductIds) => {
//     return prisma!.product.updateMany({
//         where: {
//             id: { in: ids }
//         },
//         data: {
//             recordStatus: RecordStatus.DELETED
//         }
//     })
// };

// export const findManyProduct = async (input: Pick<Prisma.ProductWhereInput, Prisma.ProductScalarFieldEnum> & {
//     orderBy?: [Pick<Prisma.ProductOrderByWithRelationInput, Prisma.ProductScalarFieldEnum>]
//     take?: number,
//     skip?: number,
//     cursor?: number,
//     search?: string,
// }) => {
//     const { orderBy, take, skip, cursor, search, ...where } = input;
//     let query: Pick<Prisma.ProductWhereInput, "OR"> | undefined;
//     if (search) {
//         const terms = Object.values(Prisma.ProductScalarFieldEnum)
//             .filter((v) => ["code", "typeBarcode", "name", "taxMethod", "image", "note"].includes(v))
//             .map((v) => ({
//                 [v]: { contains: search }
//             }));

//         query = {
//             OR: terms
//         };
//     };
//     return prisma!.product.findMany(
//         { include,
//             where: query ?? where,
//             orderBy: orderBy,
//             take, skip,
//             cursor: cursor ? { id: cursor } : undefined,


//         }
//     );
// }