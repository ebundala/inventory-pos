import NextAuth from "next-auth";
import {authOptions} from "@/core";
import { NextApiRequest, NextApiResponse } from "next";

//export default NextAuth(authOptions);
export default function handler(req: NextApiRequest, res: NextApiResponse){
   console.log(req.url);
    return NextAuth(req,res,authOptions) 
}