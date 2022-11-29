import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import { getTenantServerSideProps, } from "@/lib/util";



export const getServerSideProps = getTenantServerSideProps

function SettingsIndex({ tenant }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    if (router.isFallback) return <Loader />;


    return (
        <div>
          <h1>Settings </h1>
          { JSON.stringify(tenant) }
        </div>
    );
}

export default SettingsIndex;