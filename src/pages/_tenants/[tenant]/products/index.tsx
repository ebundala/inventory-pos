/* eslint-disable react-hooks/rules-of-hooks */
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useProducts } from "@/lib/hooks/useProducts";
import { ProductWarehouse, Unit } from "@prisma/client";
import { useRouter } from "next/router";
import { pageOptions } from "@/lib/config/pageOptions";
import {getImageUrls} from "@/core/util/getImageUrls"
import Image from "next/image";
import { FormContainer } from "@/components/FormContainer";
import { numberFormat } from "@/lib/util";
import { useAppConfig } from "@/lib/hooks/useAppConfig";


export function Products({products,defaultCurrency,refetch}:ProductListProps) {
    const router = useRouter();   


    return  <FormContainer title={<h2>All Products</h2>}>
    <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {
                     router.push("/products/create")

                    }
                }
            >create</button>
        </div>

        <CustomTable
            pageOptions={pageOptions}
            rowsData={products ?? []}
            collumsData={() => {

                return [
                    {
                        Header: () => <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                        ,
                        accessor: "tenantId",
                        disableSortBy: true,
                        Cell: ({ row, value }: { row: any, value: any }) => {
                            return <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                        }
                    },
                    {
                        Header: "Picture",
                        accessor: "image",
                        Cell: ({ row, value }: { row: any, value: string }) => {
                            const urls = getImageUrls(value)
                            return <Image src={urls[0]} height={40} width={40} alt="product picture"/>
                        }
                    },
                    {
                        Header: "Product name",
                        accessor: "name"
                    },
                    {
                        Header: "Category",
                        accessor: "category.name",

                    },
                    {
                        Header: "Brand",
                        accessor: "brand.name",

                    },
                    {
                        Header: "Price",
                        accessor: "price",
                        Cell:numberFormat(undefined,{currency:defaultCurrency?.code,style: 'currency',maximumFractionDigits:2})

                    },
                   
                    {
                        Header: "Quantity",
                        accessor: "productWarehouse",
                        Cell: ({ row, value }: { row: any, value: ProductWarehouse[] }) => {
                           const total = value.reduce((p,c,i,arr)=>p+c.qty,0)
                          const v=  numberFormat(undefined,{maximumFractionDigits:2})({value:total})
                          const unit = row.original?.productUnit as Unit;
                          return <span>{v}<span className="text-primary text-sm pl-2">{unit?.shortName}</span></span>
                        }
                    },
                    {
                        Header: "Actions",
                        accessor: "id",
                        disableSortBy: true,
                        Cell: ({ row, value }: { row: any, value: number }) => {
                            return <div className="flex flex-row gap-2">
                                 <button onClick={(e) => {
                                   router.push(`/products/view/${value}`)

                                }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>
                 
                                <button onClick={(e) => {                                  
                                     router.push(`/products/update/${value}`);
                                }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                <button 
                                onClick={(e) => {                                  
                                    //delete here;
                               }}
                                className="btn btn-warning btn-xs rounded-md btn-outline">Delete</button>
                            </div>
                        }
                    },

                ]
            }} />
    </div>
    </FormContainer>
}

type ProductListProps = ReturnType<typeof useViewRequiredData>['data']

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useViewRequiredData}>
            {(props) =>
                <Products {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;
function useViewRequiredData(){    
        const products = useProducts();
        const {data,isLoading} = useAppConfig();
        return { data:{...data,...products}, isLoading: products.result.isLoading || isLoading}
    
}