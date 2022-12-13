import { useStore } from "@/lib/context";
import { useEffect } from "react";

export function useHost(url?:string) {
  const [host,setHost] = useStore((s)=>s.host);  
    useEffect(()=>{
      if(window?.location||url){
     setHost({host:url??window.location.host})
      }
    },[setHost,host,url]);
  return host
}
