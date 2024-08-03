export function checkPrecision(num: number | string, precision: number) {
    return String(num).split('.')[1]?.length <= precision;
}
