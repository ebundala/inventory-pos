import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import Loader from "@/components/sites/Loader";
import { updateProductInputSchema } from "@/core/product/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useBrands } from "@/lib/hooks/useBrands";
import { useCategories } from "@/lib/hooks/useCategories";
import { useTenant } from "@/lib/hooks/useTenant";
import { useUnits } from "@/lib/hooks/useUnits";
import { useZodForm } from "@/lib/util/form-gen";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useProduct } from "@/lib/hooks/useProduct";

interface PathProps extends ParsedUrlQuery {
    productId: string;
}
export default function UpdateProduct() {
    const router = useRouter();
    const productId = parseInt((router.query as PathProps).productId ?? "-1");
    const [tenant, tenantLoading] = useTenant();
    const [categories, categoryLoading] = useCategories();
    const [brands, brandsLoading] = useBrands();
    const [units, unitsLoading] = useUnits();
    const [product, loading, success, refetch] = useProduct(productId);
    const [config, form] = useZodForm(updateProductInputSchema, {

    }, {
        defaultValues: { tenantId: tenant?.tenantId, ...(product ?? {}) }
    });
    
    if (loading || tenantLoading || categoryLoading || brandsLoading || unitsLoading) return <Loader />
    if (!product || !product?.id) return (
    <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg"> 
    <span className="m-auto">Invalid product</span>
    </div>)
    return (
        <FormContainer title={<h2>Update product</h2>}>
            <form onSubmit={form.handleSubmit(async (data) => {
                //submit here
                console.log(data);
            }, (e) => {
                console.error(e);
            })}>
                <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {config.map((i) => {
                        return (<FormInputField key={i.name} {...i} />);
                    })}
                </div>
                <div className="flex flex-row py-3 justify-start">

                    <button type="submit" className=" btn btn-primary rounded-md  " >Submit </button>
                </div>
            </form>
        </FormContainer>
    )
}

UpdateProduct.getLayout = getLayout;

