import { CasbinRule } from "@prisma/client";
import {PrismaAdapter} from "casbin-prisma-adapter"
import {Enforcer,Model} from 'casbin'
import {  prismaAdmin } from "@/core";
const modelStr = `
[request_definition]
r = sub,dom, obj, act

[policy_definition]
p = sub, dom, obj, act

[role_definition]
g = _, _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub, r.dom) && r.dom == p.dom && r.obj == p.obj && r.act == p.act
`

const adapter = new PrismaAdapter(prismaAdmin)
const model = new Model()
const enforcer = new Enforcer();
model.loadModelFromText(modelStr);
export async function initCasbin() {
    await enforcer.initWithModelAndAdapter(model,adapter);
    enforcer.enableAutoBuildRoleLinks(true);
    enforcer.enableAutoNotifyWatcher(true);
    enforcer.enableAutoSave(true);
    if(process.env.NODE_ENV === "development"){
    enforcer.enableLog(true)
    }
    enforcer.enableEnforce(true)
    return enforcer;
}
initCasbin()

export default enforcer;

