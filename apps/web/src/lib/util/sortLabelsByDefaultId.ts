export function sortLabelsByDefaultId(arr: any[] | null, id: number | undefined) {
    return arr?.sort((v) => v.id === id ? -1 : 1)?.map((v) => ({ label: v.name, value: v.id })) ?? [];
}
