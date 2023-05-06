import { object, string, number } from 'yup';

let userSchema = object({
    name: string().required('Name is required'),
    age: string().required('Age is required'),
    sex: string().required('Sex is required'),
    mobile: string()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .matches(/^(?:\+91|91|0)?\d{10}$/, 'Invalid Indian mobile number'),
    govtIdType: string().default(''),
    govtId: string().when('govtIdType', ([govtIdType], schema) => {
        if (govtIdType === 'aadhar') {
            return schema.matches(/^[0-9]{12}$/, "Aadhar number should be of 12 digts.");
        } else if (govtIdType === 'pan') {
            return schema.matches(/^[A-Za-z0-9]{10}$/, "Pan number should be of alpha-numeric of length 10.");
        }
        return schema;
    }),
    label: string(),
    guardian: string(),
    email: string().email(),
    emergencyNumber: string()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .matches(/^(?:\+91|91|0)?\d{10}$/, 'Invalid Indian mobile number'),
    address: string(),
    state: string(),
    city: string(),
    country: string(),
    pincode: number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .integer(),
    occupation: string(),
    religion: string(),
    maritalStatus: string(),
    bloodGroup: string(),
    nationality: string(),
});

export {userSchema};