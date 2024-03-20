import { useStore } from "@/lib/context";
export const useThemesList = () =>{
    const [themes,_] = useStore((s)=>s.themes);
    return themes;
}