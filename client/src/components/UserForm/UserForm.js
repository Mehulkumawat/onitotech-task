import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './UserForm.css'
import { object, string, number } from 'yup';
import { userSchema } from '../../schemas/yupSchemas';
import axios from "axios";
import { yupResolver } from '@hookform/resolvers/yup';
import { fetchStates, fetchCities, fetchCountries } from '../../api/geonames';


function UserForm() {
    // Vars
    const { register, handleSubmit, setValue, reset, watch } = useForm();
    const [errors, setErrors] = useState({});
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const govtIdType = watch('govtIdType');

    // use effect
    useEffect(() => {
        if (govtIdType === '') {
            setValue('govtId', '');
        }
    }, [govtIdType, setValue]);

    useEffect(() => {
        getCountries();
    }, []);

    // Form validation
    async function validateFormData(data) {
        try {
            const validatedData = await userSchema.validate(data, { abortEarly: false });
            return {
                data: validatedData,
                success: true
            }
        } catch (errors) {
            const validationErrors = {};
            errors.inner.forEach((error) => {
                validationErrors[error.path] = error.message;
            });
            setErrors(validationErrors);
            return {
                success: false
            }
        }
    }

    // Handlers
    const handleCancel = () => {
        reset(); // Reset the form fields
    };

    const handleNationalityChange = (event) => {
        const selectedNationality = event.target.value;
        setValue('nationality', selectedNationality);
    };

    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        setValue('country', selectedCountry);
        setValue('state', '');
        setValue('city', '');
        setStates([]);
        setCities([]);

        if (selectedCountry) {
            const country = countries.find((c) => c.countryName === selectedCountry);
            if (country) {
                getStates(country.geonameId);
            }
        }
    };

    const handleStateChange = (event) => {
        const selectedState = event.target.value;
        setValue('state', selectedState);
        setValue('city', '');
        setCities([]);

        if (selectedState) {
            const state = states.find((s) => s.name === selectedState);
            if (state) {
                getCities(state.geonameId);
            }
        }
    };

    async function onSubmitHandler(data) {
        // Validate the form data using Yup before saving it to the database.
        const validationResult = await validateFormData(data);

        // Exit early if validation was not successful
        if (!validationResult.success) {
            return;
        }

        // In case of validation success, save the user to the database.
        // In case of success or failure, show popup.
        // In case of success, reset the form.
        const validatedData = validationResult.data;
        try {
            const result = await submitUserData(validatedData);
            if (result.status === 201) {
                reset();
            }
            showPopup(result.data.message);
        } catch (error) {
            showPopup('Failed to connect to server to save the user data.');
        }
    }

    function showPopup(message) {
        alert(message);
    }

    // API calls
    async function submitUserData(data) {
        const result = await axios.post("http://localhost:9000/users", data);
        return result;
    }

    const getCountries = async () => {
        const result = await fetchCountries();
        if (result.success) {
            setCountries(result.response.data.geonames);
        }
    };

    const getStates = async (countryCode) => {
        const result = await fetchStates(countryCode);
        if (result.success) {
            setStates(result.response.data.geonames);
        }
    };

    const getCities = async (stateCode) => {
        const result = await fetchCities(stateCode);
        if (result.success) {
            setCities(result.response.data.geonames);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className='personal-details'>
                    <div className='row'>
                        <span className='col field'>Personal Details</span>
                    </div>
                    <div className='row'>
                        <div className='col-4 field'>
                            <label>Name<span className="required-star">*</span></label>
                            <input type='text' placeholder='Enter Name'
                                {...register('name')} />
                            {errors.name && <div className="error">{errors.name}</div>}
                        </div>
                        <div className='col-5 field'>
                            <label>Age<span className="required-star">*</span></label>
                            <input type='text' placeholder='Age in Years'
                                {...register('age')} />
                            {errors.age && <div className="error">{errors.age}</div>}
                        </div>
                        <div className='col-3 field'>
                            <label>Sex<span className="required-star">*</span></label>
                            <select {...register('sex')} id="sex" placeholder='Enter Sex' >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                            {errors.sex && <div className="error">{errors.sex}</div>}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-4 field'>
                            <label>Mobile Number</label>
                            <input type="text" id="mobile-number" {...register('mobile')} placeholder='Enter Mobile' />
                            {errors.mobile && <div className="error">{errors.mobile}</div>}
                        </div>
                        <div className='col-8 field'>
                            <label>Govt Issued ID</label>
                            <select id="govtIdType" placeholder='ID Type' {...register('govtIdType')}>
                                <option value="">Select ID Type</option>
                                <option value="aadhar">Aadhar</option>
                                <option value="pan">PAN</option>
                            </select>
                            {errors.govtIdType && <div className="error">{errors.govtIdType}</div>}

                            <input type="text" id="governmentid" {...register('govtId')} placeholder='Enter Govt ID' disabled={govtIdType === ''} />
                            {errors.govtId && <div className="error">{errors.govtId}</div>}
                        </div>
                    </div>
                </div>
                {/* contact details */}
                <div className='contact-details'>
                    <div className='row'>
                        <span>Contact Details</span>
                    </div>
                    <div className='row input-section'>
                        <div className='col-4 field'>
                            <label>Guardian Details</label>
                            <select id="label" placeholder='Enter Label'
                                {...register('label')}
                            >
                                <option value="">Enter Label</option>
                                <option value="aadhar">Mr.</option>
                                <option value="pan">Mrs</option>
                            </select>
                            {errors.label && <div className="error">{errors.label}</div>}
                            <input type='text' placeholder='Enter Guardian Name' {...register('guardian')} />
                            {errors.guardian && <div className="error">{errors.guardian}</div>}
                        </div>
                        <div className='col field'>
                            <label>Email</label>
                            <input type='email' placeholder='Enter Email'
                                {...register('email')}
                            />
                            {errors.email && <div className="error">{errors.email}</div>}
                        </div>
                        <div className='col field'>
                            <label>Emergency Contact Number</label>
                            <input type='text' placeholder='Enter Emergency No'
                                {...register('emergencyNumber')}
                            />
                            {errors.emergencyNumber && <div className="error">{errors.emergencyNumber}</div>}
                        </div>
                    </div>
                </div>
                {/* {Address Details} */}
                {/* <AddressDetails /> */}
                <div className='address-details'>
            <div className='row'>
                <span>Address Details</span>
            </div>
            <div className='row'>
                <div className='col-4 field'>
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" {...register('address')} placeholder='Enter Address' />
                    {errors.address && <div className="error">{errors.address}</div>}
                </div>

                <div className='col-4 field'>
                    <label htmlFor="country">Country</label>
                    <select {...register('country')} onChange={handleCountryChange}>
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.countryCode} value={country.countryName}>{country.countryName}</option>
                        ))}
                    </select>
                    {errors.country && <div className="error">{errors.country}</div>}
                </div>
                <div className='col-4 field'>
                    <label htmlFor="state">State</label>
                    <select {...register('state')} onChange={handleStateChange}>
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state.geonameId} value={state.name}>{state.name}</option>
                        ))}
                    </select>
                    {errors.state && <div className="error">{errors.state}</div>}
                </div>
            </div>
            <div className='row'>
                <div className='col-4 field'>
                    <label htmlFor="city">City</label>
                    <select {...register('city')}>
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city.geonameId} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                    {errors.city && <div className="error">{errors.city}</div>}
                </div>
                <div className='col-4 field'>
                    <label htmlFor="pincode">Pincode</label>
                    <input type='text' id='pincode' {...register('pincode', userSchema.fields.pincode)} />
                    {errors.pincode && <div className="error">{errors.pincode}</div>}
                </div>

            </div>
        </div>
                {/* {other details} */}
                <div className='other-details'>
                    <div className='row'>
                        <span>Other Details</span>
                    </div>
                    <div className='row'>
                        <div className='col field'>
                            <label>Occupation</label>
                            <input type="text" id="occupation" {...register('occupation')} />
                            {errors.occupation && <div className="error">{errors.occupation}</div>}
                        </div>
                        <div className='col field'>
                            <label>Religion</label>
                            <select id="religion" {...register('religion')} >
                                <option value="">Enter Religion</option>
                                <option value="Hinduism">Hinduism</option>
                                <option value="Islam">Islam</option>
                                <option value="Christianity">Christianity</option>
                                <option value="Sikhism">Sikhism</option>
                                <option value="Buddhism">Buddhism</option>
                                <option value="Jainism">Jainism</option>
                                <option value="Zoroastrianism">Zoroastrianism</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.religion && <div className="error">{errors.religion}</div>}
                        </div>
                        <div className='col field'>
                            <label>Marital Status</label>
                            <select id="maritalStatus" {...register('maritalStatus')} >
                                <option value="">-- Select --</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                            </select>
                            {errors.maritalStatus && <div className="error">{errors.maritalStatus}</div>}
                        </div>
                        <div className='col field'>
                            <label>Blood Group</label>
                            <select id="bloodGroup" {...register('bloodGroup')} >
                                <option value="">-- Select --</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                            {errors.bloodGroup && <div className="error">{errors.bloodGroup}</div>}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col field'>
                            <label>Nationality</label>
                            <select {...register('nationality')} onChange={handleNationalityChange}>
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.countryCode} value={country.countryName}>{country.countryName}</option>
                                ))}
                            </select>


                            {errors.nationality && <div className="error">{errors.nationality}</div>}
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-end buttons'>
                    <button className='cancel' onClick={handleCancel} >
                        <div>CANCEL</div>
                        <div className='esc'>(ESC)</div>
                    </button>
                    <button className='submit'>
                        <div>SUBMIT</div>
                    </button>
                </div>
            </form>
        </div>

    );
}

export default UserForm;
