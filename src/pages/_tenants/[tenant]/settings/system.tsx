import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
//import { getTenantServerSideProps } from "@/lib/tenant-server-props";
import { getLayout } from "@/layouts/getLayout";
import { useTenant } from "@/lib/hooks/useTenant";


//export const getServerSideProps = getTenantServerSideProps

function SettingsIndex(/*{ tenant }: InferGetServerSidePropsType<typeof getServerSideProps>*/) {
    const router = useRouter();
    const tenant = useTenant();
    console.log(tenant);
    if (router.isFallback) return <Loader />;


    return (
        <div>
          <h1>Settings </h1>
          { JSON.stringify(tenant) }
        </div>
    );
}

SettingsIndex.getLayout=getLayout
export default SettingsIndex;