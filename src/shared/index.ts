export function hasKey(obj: Record<string, any>, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

