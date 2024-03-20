import { PrismaAdapter } from "@/lib/casbin-prisma-adapter";
import { Enforcer, Model, newEnforcer, newModelFromString } from 'casbin'

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
    var casbinEnforcer: Enforcer
    var casbinPrismaAdapter: PrismaAdapter
    var authorizationModel: Model
    var casbinInitialized: Boolean
}


export async function initCasbin() {

    global.authorizationModel = global.authorizationModel || newModelFromString(modelStr)

    global.casbinPrismaAdapter = global.casbinPrismaAdapter || await PrismaAdapter.newAdapter(prisma)
    global.casbinEnforcer = global.casbinEnforcer || await newEnforcer(); /*"/home/app/src/core/authorization/rbac_model.conf", global.adapter*/
    if (global.casbinInitialized!==true) {
        await casbinEnforcer.initWithModelAndAdapter(global.authorizationModel, global.casbinPrismaAdapter);
        global.casbinInitialized=true;

    global.casbinEnforcer.enableAutoBuildRoleLinks(true);
    global.casbinEnforcer.enableAutoNotifyWatcher(true);
    global.casbinEnforcer.enableAutoSave(false);
    if (process.env.NODE_ENV === "development") {
        global.casbinEnforcer.enableLog(true)
    }
    global.casbinEnforcer.enableEnforce(true)
}
    return { enforcer: global.casbinEnforcer, casbinAdapter: global.casbinPrismaAdapter };
}
initCasbin();


// export const enforcer = global.enforcer;
// export const casbinAdapter = global.adapter;
