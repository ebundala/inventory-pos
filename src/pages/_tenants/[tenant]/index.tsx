import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { ParsedUrlQuery } from "querystring";
import { Prisma, Tenant } from "@prisma/client"
import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/core/index";

interface PathProps extends ParsedUrlQuery {
    tenant: string;
}

interface IndexProps {
    tenant: Tenant;
}

export const getServerSideProps: GetServerSideProps<{ tenant: Pick<Tenant,"tenantId"|"customDomain"|"name"|"subdomain"|"image"|"imageBlurhash"> }, PathProps> = async (context) => {
    const domains = context.params?.tenant;
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    if(!session?.user){
        return {
            redirect:{
                destination:"/login",
                permanent:true

            }
        }
    }
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

function TenantIndex({ tenant }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    if (router.isFallback) return <Loader />;


    return (
        <div>
            {JSON.stringify(tenant)}
        </div>
    );
}

export default TenantIndex;