import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout"
import { useTenant } from "@/lib/hooks/useTenant";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useProduct } from "@/lib/hooks/useProduct";
import { useEffect, useState } from 'react';
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import JsBarcode from "jsbarcode";
import { getImageUrls } from "@/core/util/getImageUrls";
import Image from "next/image";
import { BsArrow90DegLeft, BsArrow90DegRight, BsArrowBarLeft, BsArrowBarRight, BsArrowDown, BsArrowLeft, BsArrowRight } from "react-icons/bs";

interface ProductPathProps extends ParsedUrlQuery {
    productId: string;
}
export function ViewProduct({ tenant, product, refetch }: ProductRequiredDataReturnType['data']) {

   useEffect(()=>{
    JsBarcode("#barcode").init();
   },[])
  const [index,setUrlIndex]= useState(0);
  
    if (!product || !product?.id) return (
        <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
            <span className="m-auto">Invalid product</span>
        </div>)

    const urls = getImageUrls(product.image??"");

    return (
        <FormContainer title={<h2>{product.name}</h2>}>
           
            <div className="flex flex-row-reverse  py-4">
                <svg id="barcode"
                    jsbarcode-formats={product.typeBarcode.toLowerCase()}
                    jsbarcode-value={product.code}
                    jsbarcode-textmargin="0"
                    jsbarcode-fontoptions="bold">
                </svg>
            </div>
            <div className="flex flex-col md:flex-row space-x-2">
                <div className="md:w-2/3 w-full  h-full">
                    <table className="table w-full">
                        <tbody>
                            <tr>
                                <td>Code</td>
                                <td>{product.code}</td>
                            </tr>
                            <tr>
                                <td>Product</td>
                                <td>{product.name}</td>
                            </tr>
                            <tr>
                                <td>Category</td>
                                <td>{product.category.name}</td>
                            </tr>
                            <tr>
                                <td>Brand</td>
                                <td>{product.brand?.name}</td>
                            </tr>
                            <tr>
                                <td>Cost</td>
                                <td>{product.cost}</td>
                            </tr>
                            <tr>
                                <td>Price</td>
                                <td>{product.price}</td>
                            </tr>
                            <tr>
                                <td>Unit</td>
                                <td>{product.productUnit?.name}</td>
                            </tr>
                            <tr>
                                <td>Tax</td>
                                <td>{product.taxNet}</td>
                            </tr>
                            <tr>
                                <td>Tax type</td>
                                <td>{product.taxMethod}</td>
                            </tr>
                            <tr>
                                <td>Stock alert</td>
                                <td>{product.stockAlert}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="md:w-1/3 w-full flex flex-col">
                    <div className="shadow-md rounded-md h-[440px]  mx-2 bg-slate-400">
                         <Image width={440} height={240} src={urls[index]} className="w-full h-full" alt="prouduct"/>
                    </div>
                    {urls.length&&<div className="flex flex-row justify-evenly p-4">
                        {index!=0&&<BsArrowLeft onClick={()=>{
                            if(index-1>=0){
                             setUrlIndex(index-1);
                            }
                        }} size={32}/>}
                        {(index+1<urls.length)&&<BsArrowRight onClick={()=>{
                            if(index+1<urls.length){
                             setUrlIndex(index+1);
                            }
                        }} size={32} />}
                    </div>}
                </div>
            </div>
            <div className="flex flex-row pt-6">
              <table className="w-full table">
                <thead>
                    <tr>
                    <th>
                        Warehouse
                    </th>
                    {product.isVariant&&<th>Variant</th>}
                    <th>
                        Quantity
                    </th>
                    </tr>
                </thead>
                <tbody>
                   {product.productWarehouse.map((v)=> (<tr>
                        <td>{v.warehouse.name}</td>
                       {product.isVariant&&<td>{product.productVariants.find((e)=>e.id===v.productVariantId)?.name}</td>}
                        <td>{v.qty} <span className="text text-primary">{product.productUnit?.shortName}</span></td>
                    </tr>))}
                </tbody>
              </table>
            </div>
        </FormContainer>
    )
}



export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useProductRequiredData}>
            {(props) => {
                return <ViewProduct {...props} />
            }}
        </CollectRequiredDataWrapper>
    )
}

Index.getLayout = getLayout;



function useProductRequiredData() {
    const router = useRouter();
    const productId = parseInt((router.query as ProductPathProps).productId ?? "");
    const { product, result: { isLoading: loading, }, refetch } = useProduct(productId);
    const { tenant, result: { isLoading: tenantLoading } } = useTenant();
    return { data: { tenant, product, refetch }, isLoading: tenantLoading || loading };
}
type ProductRequiredDataReturnType = ReturnType<typeof useProductRequiredData>


