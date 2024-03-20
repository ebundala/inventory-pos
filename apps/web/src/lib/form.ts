import { createSaleInputSchema } from "../../src/core/sale/index.zod";
import { ZodAny, ZodFirstPartyTypeKind, ZodTypeAny,ZodRawShape, ZodAnyDef, ZodFirstPartySchemaTypes, ZodIssueCode } from "zod";
import { TenantCreateInputObjectSchema } from "../../prisma/generated/schemas/objects/TenantCreateInput.schema";
import { createSettingInputSchema } from "../../src/core/setting/index.zod";
import { createPosSettingInputSchema } from "../../src/core/pos_setting/index.zod";
import { traverseZodSchema } from "./util/form-gen";
const schema = createSaleInputSchema
.superRefine(({userId},ctx)=>{
    if(userId?.length==0){
        console.log(ctx.path)
        ctx.addIssue({
            code:ZodIssueCode.custom,
            path:ctx.path,
            message:"user is required"
        });
    }
})
// .refine(
//   ({customerId})=>customerId,
//   {
// // params:{},
// path:["customerId"],
// message:"customer is required"
// }).refine(
//     ({userId})=>false,
//     {
//   // params:{},
//   path:["userId"],
//   message:"user is required"
//   }).refine(
//     ({warehouseId})=>warehouseId,
//     {
//   // params:{},
//   path:["warehouseId"],
//   message:"warehouse is required"
//   });




console.log(schema.safeParse({warehouseId:null,customerId:null}))
//console.log(traverseZodSchema(schema))