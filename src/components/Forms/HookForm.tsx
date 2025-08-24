import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '../../store/useStore';
import { formSchema } from '../../utils/validation';
import { fileToBase64, checkPasswordStrength } from '../../utils/helpers';
import { useEffect, useState } from 'react';
import type { FormValues } from '../../utils/validation';

export default function HookForm() {
  const { addFormData, closeModal, countries } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      acceptTerms: false,
    },
  });

  const password = watch('password');
  const [currentPasswordStrength, setCurrentPasswordStrength] = useState(0);

  useEffect(() => {
    if (password) {
      setCurrentPasswordStrength(checkPasswordStrength(password));
    }
  }, [password]);

  const onSubmit = async (data: FormValues) => {
    try {
      const imageBase64 =
        data.image && data.image.length > 0
          ? await fileToBase64(data.image[0])
          : null;

      addFormData({
        name: data.name,
        age: data.age,
        email: data.email,
        gender: data.gender,
        image: imageBase64,
        country: data.country,
      });

      closeModal('hookForm');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const passwordStrengthLabels = [
    'Very Weak',
    'Weak',
    'Fair',
    'Good',
    'Strong',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form-field">
        <label htmlFor="hook-name">Name</label>
        <input id="hook-name" {...register('name')} />
        {errors.name && <span className="error">{errors.name?.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="hook-age">Age</label>
        <input
          id="hook-age"
          type="number"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && <span className="error">{errors.age?.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="hook-email">Email</label>
        <input id="hook-email" type="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email?.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="hook-password">Password</label>
        <input id="hook-password" type="password" {...register('password')} />
        {errors.password && (
          <span className="error">{errors.password?.message}</span>
        )}
        {password && (
          <div className="password-strength">
            <span>
              Strength:{' '}
              {passwordStrengthLabels[currentPasswordStrength - 1] ||
                'Very Weak'}
            </span>
            <div className="strength-meter">
              <div
                className={`strength-bar ${currentPasswordStrength >= 1 ? 'active' : ''}`}
                style={{ width: `${currentPasswordStrength * 20}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="hook-confirmPassword">Confirm Password</label>
        <input
          id="hook-confirmPassword"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword?.message}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="hook-gender">Gender</label>
        <select id="hook-gender" {...register('gender')}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <span className="error">{errors.gender?.message}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="hook-country">Country</label>
        <input
          id="hook-country"
          list="countries-list"
          {...register('country')}
        />
        <datalist id="countries-list">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        {errors.country && (
          <span className="error">{errors.country?.message}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="hook-image">Profile Image</label>
        <input
          id="hook-image"
          type="file"
          accept="image/jpeg,image/png"
          {...register('image')}
        />
        {errors.image && <span className="error">{errors.image?.message}</span>}
      </div>

      <div className="form-field">
        <label>
          <input type="checkbox" {...register('acceptTerms')} />
          Accept Terms and Conditions
        </label>
        {errors.acceptTerms && (
          <span className="error">{errors.acceptTerms?.message}</span>
        )}
      </div>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
