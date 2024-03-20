import { ParsedUrlQuery } from "querystring";


export interface TenantPathProps extends ParsedUrlQuery {
  tenant: string;
}
