import { CasbinRule } from "@prisma/client";
import {PrismaAdapter} from "casbin-prisma-adapter"
import {Enforcer} from 'casbin'
import {  prismaAdmin } from "@/core";

const adapter = new PrismaAdapter(prismaAdmin)
const enforcer = new Enforcer();
export async function initCasbin() {
    
    await enforcer.initWithAdapter('./rbac_modal.conf',adapter);
    return enforcer;
}


export default enforcer;

