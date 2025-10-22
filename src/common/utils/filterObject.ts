
export const FilterObject = (data: string[] , obj: Object ): Object => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key])=> !data.includes(key)) 
    );
}