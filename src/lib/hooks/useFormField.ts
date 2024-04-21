import { ReInput } from '../components';
import { ZodType, z } from 'zod';
import { NestedKeyOfWithOptionals } from '../types/structs';

export function useFormField<T extends ZodType<any, any, any>>() {
    type InferedType = z.infer<T>;
    return { field: ReInput<NestedKeyOfWithOptionals<InferedType>> };
}
