import { useState } from "react";

const useForm = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(validationRules).forEach(([fieldName, validationFn]) => {
      const value = values[fieldName];
      const errorMessage = validationFn(value);
      if (errorMessage) {
        newErrors[fieldName] = errorMessage;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, handleChange, validateForm, resetForm };
};

export default useForm;
