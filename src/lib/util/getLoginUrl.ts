export function getLoginUrl() {
  const url = new URL(process.env.NEXT_PUBLIC_HOST!);
  return `${url.protocol}//app.${url.host}/login`;
}
