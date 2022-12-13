import { ReactNode } from "react";
import {Layout} from '@/layouts/Layout'
export const getLayout=(Page:ReactNode)=>{
return(<Layout>{Page}</Layout >);
}