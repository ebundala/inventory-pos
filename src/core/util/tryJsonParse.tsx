export function tryJsonParse<T extends Object = Object>(
  json?: string,
  defaultValues: string = "{}") {
  let result: T;
  try {
    result = JSON.parse(json ?? defaultValues);
  } catch (e) {
    result = JSON.parse(defaultValues);
  }
  return result;
}
