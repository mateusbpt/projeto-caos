export namespace Validation {

    export function isInteger(value: any): boolean {
        return /[+-]?[0-9]{1,10}/g.test(value) && !(value instanceof Date);
    }

    export function isBoolean(value: string): boolean {
        return /(^true$|^false$)/g.test(value);
    }

}