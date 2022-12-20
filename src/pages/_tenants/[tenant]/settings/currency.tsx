import Loader from "@/components/app/Loader";
import { getLayout } from "@/layouts/getLayout"
import { useCurrencies } from "@/lib/hooks/useCurrencies";

export default function Currency(){
   const[currencies,loading,success] = useCurrencies();
   if(loading) return <Loader/>
    return(<div>
   {currencies&&currencies.map((c)=><span key={c.name}>{c.name}</span>)}

    </div>)
}

Currency.getLayout = getLayout