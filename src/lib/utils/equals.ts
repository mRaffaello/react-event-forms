export function areObjectsEqual(obj1: any, obj2: any): boolean {
    // Check if both variables are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return obj1 === obj2; // Direct comparison if not both objects
    }

    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if number of keys is the same
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Check if all keys and their values are equal
    for (const key of keys1) {
        // Recursively compare nested objects
        if (!areObjectsEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    // If all checks passed, objects are considered equal
    return true;
}
