import Loader from "@/components/sites/Loader";
import { getLayout } from "@/layouts/getLayout"
import { useStore } from "@/lib/context";
import { useCurrencies } from "@/lib/hooks/useCurrencies";
import { useEffect, useState } from "react";
import { CustomTable } from "./table";

export default function Currency(){
   const[currencies,loading,success] = useCurrencies();

   if(loading) return <Loader/>
   
   return <CustomTable 
   pageOptions={[
    {
        label:"1 item per page",
        value: 1
    },
    {
        label:"2 item per page",
        value: 2
    }
   ]}
   rowsData={currencies??[]} 
   collumsData={()=>{

    return [
        {
            Header:()=><label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs "/></label>
            ,
            accessor:"id",
            disableSortBy:true,
            Cell:({row,value}:{row:any,value:any})=>{
                return <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs "/></label>
            }
        },
        {
            Header:"Currency name",
            accessor:"name"
        },
        {
            Header:"Symbol",
            accessor:"symbol"
        },
        {
            Header:"Currency Code",
            accessor:"code"
        },
        {
            Header:"Actions",
            accessor:"tenantId",
            disableSortBy:true,
            Cell:({row,value}:{row:any,value:any})=>{
                return <div className="flex flex-row gap-2">
               <button className="btn btn-info btn-sm rounded-md">Edit</button>
               <button className="btn btn-warning btn-sm rounded-md">Delete</button>
                </div>
            }
        },

    ]
   } }/>
    return(<div className="overflow-x-auto w-full">
        <table className="table w-full">
            <thead>
            <tr>
                <th><label ><input type="checkbox" className="checkbox"/></label></th>
                <th>name</th>
                <th>symbol</th>

            </tr>
            </thead>
            <tbody>
                {currencies&&currencies?.map((v)=>(
                <tr key={v.id}>
                <th><label ><input type="checkbox" className="checkbox"/></label></th>
                <td>{v.name}</td>
                <td>{v.symbol}</td>
                </tr>
                ))}
            </tbody>
            <tfoot>
                <th></th>
                <th>code</th>
                <th>name</th>
            </tfoot>
        </table>
   

    </div>)
}

Currency.getLayout = getLayout