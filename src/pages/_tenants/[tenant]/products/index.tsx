import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import Loader from "@/components/sites/Loader";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useProducts } from "@/lib/hooks/useProducts";
import { Product, ProductVariant } from "@prisma/client";
import { useRouter } from "next/router";


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
            pageOptions={[
                {
                    label: "1 item per page",
                    value: 1
                },
                {
                    label: "2 item per page",
                    value: 2
                },
                {
                    label: "All items",
                    value: 10000
                }
            ]}
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
                        Header: "Image",
                        accessor: "image",
                        Cell: ({ row, value }: { row: any, value: any }) => {
                            return row?.original?.image;
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
                        accessor: "isVariant",
                        Cell: ({ row, value }: { row: any, value: any }) => {
                           const isVariant = (row.original as Product).isVariant;
                           if(isVariant){
                            const variants = ((row.original?.productVariants??[]) as ProductVariant[])
                            let stock=0;
                            for(let i of variants){
                              stock=+(i?.qty??0)
                            }
                            return stock;
                           }else{
                           // TODO calculate stock level for non variant products
                           }
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
