import { PrismaAdapter } from "@/lib/casbin-prisma-adapter";
import { Enforcer, newEnforcer } from 'casbin'

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

declare global {
   var enforcer: Enforcer | undefined
  // var client:Client | undefined
   var adapter: PrismaAdapter | undefined
  }

//const client = global.client || new Client(process.env.DATABASE_URL);

export async function initCasbin() {

    //  const model = newModelFromString(modelStr)

    global.adapter =global.adapter || await PrismaAdapter.newAdapter(prisma)
     //await BasicAdapter.newAdapter('pg', client);
    global.enforcer = global.enforcer || await newEnforcer("/home/app/src/core/authorization/rbac_model.conf", global.adapter)

    // await enforcer.initWithModelAndAdapter(model,adapter);

    global.enforcer.enableAutoBuildRoleLinks(true);
    global.enforcer.enableAutoNotifyWatcher(true);
    global.enforcer.enableAutoSave(false);
    if (process.env.NODE_ENV === "development") {
        global.enforcer.enableLog(true)
    }
    global.enforcer.enableEnforce(true)
    return global.enforcer;
}
initCasbin();


export const enforcer = global.enforcer;
export const casbinAdapter = global.adapter;
