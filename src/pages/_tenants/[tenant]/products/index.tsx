/* eslint-disable react-hooks/rules-of-hooks */
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useProducts } from "@/lib/hooks/useProducts";
import { ProductWarehouse } from "@prisma/client";
import { useRouter } from "next/router";
import { pageOptions } from "@/lib/config/pageOptions";
import {getImageUrls} from "@/core/util/getImageUrls"
import Image from "next/image";
export function Products({products,refetch}:ProductListProps) {
    const router = useRouter();   


    return <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {


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
                        accessor: "id",
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

                    },
                    {
                        Header: "Unit",
                        accessor: "productUnit.name"
                    },
                    {
                        Header: "Quantity",
                        accessor: "productWarehouse",
                        Cell: ({ row, value }: { row: any, value: ProductWarehouse[] }) => {
                           return value.reduce((p,c,i,arr)=>p+c.qty,0)
                        }
                    },
                    {
                        Header: "Actions",
                        accessor: "tenantId",
                        disableSortBy: true,
                        Cell: ({ row, value }: { row: any, value: any }) => {
                            return <div className="flex flex-row gap-2">
                                 <button onClick={(e) => {
                                    console.log(row);

                                }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>
                 
                                <button onClick={(e) => {
                                    const id = row.original.id;
                                    //console.log(row);
                                     router.push(`/products/update/${id}`);
                                }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                <button className="btn btn-warning btn-xs rounded-md btn-outline">Delete</button>
                            </div>
                        }
                    },

                ]
            }} />
    </div>
}

type ProductListProps = ReturnType<typeof useProducts>

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={() => {
            const data = useProducts();
            return { data, isLoading: data.result.isLoading }
        }}>
            {(props) =>
                <Products {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;
