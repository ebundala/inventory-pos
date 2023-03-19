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
import { numberFormat } from "@/lib/util";
import { useAppConfig } from "@/lib/hooks/useAppConfig";

interface ProductPathProps extends ParsedUrlQuery {
    productId: string;
}
export function ViewProduct({ defaultCurrency, product, refetch }: ProductRequiredDataReturnType['data']) {

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
                                <td>{numberFormat(undefined,{currency:defaultCurrency?.code, style: 'currency',})({value:product.cost})}</td>
                            </tr>
                            <tr>
                                <td>Price</td>
                                <td>{numberFormat(undefined,{currency:defaultCurrency?.code, style: 'currency',})({value:product.price})}</td>
                            </tr>
                            <tr>
                                <td>Stock Unit</td>
                                <td>{product.productUnit?.name}</td>
                            </tr>
                            <tr>
                                <td>Purchasing Unit</td>
                                <td>{product.productPurchaseUnit?.name}</td>
                            </tr>
                            <tr>
                                <td>Selling Unit</td>
                                <td>{product.productsSaleUnit?.name}</td>
                            </tr>
                            <tr>
                                <td>Tax</td>
                                <td>{numberFormat(undefined,{style:"percent"})({value:(product.taxNet??0)/100})}</td>
                            </tr>
                            <tr>
                                <td>Tax type</td>
                                <td>{product.taxMethod}</td>
                            </tr>
                            <tr>
                                <td>Stock alert</td>
                                <td>{numberFormat()({value:product.stockAlert})}<span className="text-primary text-sm pl-2">{product.productUnit?.shortName}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="md:w-1/3 w-full flex flex-col">
                    <div className="shadow-md rounded-md h-[440px]  mx-2 bg-slate-400">
                         <Image width={440} height={240} src={urls[index]} className="w-full h-full" alt="prouduct"/>
                    </div>
                    {urls.length&&<div className="flex flex-row justify-center p-4">
                        {index!=0&&<BsArrowLeft onClick={()=>{
                            if(index-1>=0){
                             setUrlIndex(index-1);
                            }
                        }} size={32}/>}
                        <span className="text-info text-lg mx-4">{index+1}/{urls.length}</span>
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
                        <td>{numberFormat()({value:v.qty})} <span className="text text-primary">{product.productUnit?.shortName}</span></td>
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
    const {data,isLoading} = useAppConfig()
    return { data: { ...data, product, refetch }, isLoading: isLoading || loading };
}
type ProductRequiredDataReturnType = ReturnType<typeof useProductRequiredData>


