export const getTenantUrl = (subdomain: string,protocal?:string) => {
    const url = new URL(process.env.NEXTAUTH_URL!);
   const link = `${protocal?protocal:`${url.protocol.replaceAll(":","")}://`}${subdomain}.${url.hostname}${url.port ? `:${url.port}` : ""}`;
   return link;
}