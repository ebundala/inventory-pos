import { Tenant } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { getTenantAsMemberByDomain } from "../lib/util/getTenantAsMemberByDomain";


export type TenantProp = inferAsyncReturnType<typeof getTenantAsMemberByDomain> | Tenant;
