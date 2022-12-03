export const getTenantUrl = (subdomain: string) => {
    const url = new URL(process.env.NEXTAUTH_URL!);
    return `${url.protocol}://${subdomain}.${url.hostname}${url.port ? `:${url.port}` : ""}`
}