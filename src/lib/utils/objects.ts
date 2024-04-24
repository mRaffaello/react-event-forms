export const getPropertyValueByDottedPath = (o: any, s: string) => {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    const a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (o && k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
};

export const setObjectNestedProperty = (_obj: any, inputKey: string, inputValue: any) => {
    const obj = _obj ?? {};

    const keys = inputKey.split('.'); // Split the inputKey by dot to get nested keys

    let currentObj: any = obj;

    // Traverse the object based on the keys array
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (currentObj === undefined || typeof currentObj !== 'object') {
            // If currentObj is not an object or undefined, return the original object
            return obj;
        }
        if (i === keys.length - 1) {
            // Last key in the chain, update the value
            currentObj[key] = inputValue;
        } else {
            // Continue to the next nested object
            if (!(key in currentObj)) {
                // If the key doesn't exist, create a new object
                currentObj[key] = {};
            }
            // Move to the next nested object
            currentObj = currentObj[key];
        }
    }

    // Return the updated object
    return obj;
};
