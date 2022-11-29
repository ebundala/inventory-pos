import { inferAsyncReturnType } from "@trpc/server";
import { getTenantAsMemberByDomain } from "../lib/getTenantAsMemberByDomain";


export type TenantProp = inferAsyncReturnType<typeof getTenantAsMemberByDomain>;
