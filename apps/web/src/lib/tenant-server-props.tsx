import { Tenant, Prisma } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core";
import { TenantPathProps } from "@/types/TenantPathProps";

export const getTenantServerSideProps: GetServerSideProps<{ tenant: Pick<Tenant,"tenantId"|"customDomain"|"name"|"subdomain"|"image"|"imageBlurhash"> }, TenantPathProps> = async (context) => {
    const domains = context.params?.tenant;
    const session = await getServerSession(context.req, context.res, authOptions);
    // TODO uncomment this after auth become stable/prod ready 
    // if(!session?.user){
    //     return {
    //         redirect:{
    //             destination:"/login",
    //             permanent:true
  
    //         }
    //     }
    // }
    const mode = Prisma.QueryMode.insensitive;
    const tenant = await prismaAdmin!.tenant.findFirst({
        select: {
            tenantId: true,
            name: true,
            customDomain: true,
            subdomain: true,
            image:true,
            imageBlurhash:true
        },
        where: {
            AND: [
                // {
                //     members: {
                //         some: {
                //             id: session!.user!.id!
                //         }
                //     }
                // },
                {
                    OR: [
                        {
                            subdomain: {
                                equals: domains, mode: mode
                            }
                        },
                        {
                            customDomain: {
                                equals: domains, mode: mode
                            }
                        }
                    ]
                }]
        }
    })
    if (tenant) {
        return {
            props: { tenant },
        }
    }
    return {
        notFound: true
    }
  }