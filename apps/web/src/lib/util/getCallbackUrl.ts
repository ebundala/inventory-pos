export function getCallbackUrl(subdomain: string) {
  const HOST = process.env.NEXT_PUBLIC_HOST!;
  const url = new URL(HOST);
  return `${url.protocol}//${subdomain}.${url.host}`;
}

export function getConsoleUrl(){
  return getCallbackUrl("app")
}