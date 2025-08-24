import { useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { fileToBase64 } from '../../utils/helpers';

interface FormErrors {
  name?: string;
  age?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  country?: string;
  image?: string;
  acceptTerms?: string;
}

export default function UncontrolledForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const { addFormData, closeModal, countries } = useStore();

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value) newErrors.name = 'Name is required';
        else if (!/^[A-Z]/.test(value))
          newErrors.name = 'Name must start with capital letter';
        else delete newErrors.name;
        break;
      case 'age':
        if (!value) newErrors.age = 'Age is required';
        else if (isNaN(Number(value)) || Number(value) <= 0)
          newErrors.age = 'Age must be positive number';
        else delete newErrors.age;
        break;
      case 'email':
        if (!value) newErrors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(value))
          newErrors.email = 'Invalid email format';
        else delete newErrors.email;
        break;
      case 'password':
        if (!value) newErrors.password = 'Password is required';
        else if (value.length < 8)
          newErrors.password = 'Password must be at least 8 characters';
        else if (!/[0-9]/.test(value))
          newErrors.password = 'Password must contain at least one number';
        else if (!/[A-Z]/.test(value))
          newErrors.password =
            'Password must contain at least one uppercase letter';
        else if (!/[a-z]/.test(value))
          newErrors.password =
            'Password must contain at least one lowercase letter';
        else if (!/[^A-Za-z0-9]/.test(value))
          newErrors.password =
            'Password must contain at least one special character';
        else delete newErrors.password;
        break;
      case 'confirmPassword': {
        const password = formRef.current?.elements.namedItem(
          'password'
        ) as HTMLInputElement;
        if (!value) newErrors.confirmPassword = 'Please confirm your password';
        else if (value !== password?.value)
          newErrors.confirmPassword = 'Passwords must match';
        else delete newErrors.confirmPassword;
        break;
      }
      case 'gender':
        if (!value) newErrors.gender = 'Gender is required';
        else delete newErrors.gender;
        break;
      case 'country':
        if (!value) newErrors.country = 'Country is required';
        else delete newErrors.country;
        break;
      case 'image':
        if (value && typeof value === 'string') {
          delete newErrors.image;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    const newErrors: FormErrors = {};

    if (!data.name || !/^[A-Z]/.test(data.name as string)) {
      newErrors.name = 'Name must start with capital letter';
    }

    if (!data.age || isNaN(Number(data.age)) || Number(data.age) <= 0) {
      newErrors.age = 'Age must be positive number';
    }

    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email as string)) {
      newErrors.email = 'Invalid email format';
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordStr = data.password as string;
      if (passwordStr.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/[0-9]/.test(passwordStr)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/[A-Z]/.test(passwordStr)) {
        newErrors.password =
          'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(passwordStr)) {
        newErrors.password =
          'Password must contain at least one lowercase letter';
      } else if (!/[^A-Za-z0-9]/.test(passwordStr)) {
        newErrors.password =
          'Password must contain at least one special character';
      }
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (data.confirmPassword !== data.password) {
      newErrors.confirmPassword = 'Passwords must match';
    }

    if (!data.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!data.country) {
      newErrors.country = 'Country is required';
    }

    if (!data.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    const imageFile = data.image as File;
    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 2000000) {
        newErrors.image = 'File too large';
      } else if (!['image/jpeg', 'image/png'].includes(imageFile.type)) {
        newErrors.image = 'Unsupported file format';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const imageBase64 =
        imageFile.size > 0 ? await fileToBase64(imageFile) : null;

      addFormData({
        name: data.name as string,
        age: Number(data.age),
        email: data.email as string,
        gender: data.gender as string,
        image: imageBase64,
        country: data.country as string,
      });

      closeModal('uncontrolled');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="form">
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => validateField('name', e.target.value)}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          onChange={(e) => validateField('age', e.target.value)}
        />
        {errors.age && <span className="error">{errors.age}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={(e) => validateField('email', e.target.value)}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e) => validateField('password', e.target.value)}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          onChange={(e) => validateField('confirmPassword', e.target.value)}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          onChange={(e) => validateField('gender', e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <span className="error">{errors.gender}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="country">Country</label>
        <input
          id="country"
          name="country"
          list="countries-list"
          onChange={(e) => validateField('country', e.target.value)}
        />
        <datalist id="countries-list">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        {errors.country && <span className="error">{errors.country}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="image">Profile Image</label>
        <input
          id="image"
          type="file"
          name="image"
          accept="image/jpeg,image/png"
        />
        {errors.image && <span className="error">{errors.image}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="acceptTerms">
          <input id="acceptTerms" type="checkbox" name="acceptTerms" />
          Accept Terms and Conditions
        </label>
        {errors.acceptTerms && (
          <span className="error">{errors.acceptTerms}</span>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
