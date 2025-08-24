import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HookForm from '../Forms/HookForm';
import { useStore } from '../../store/useStore';

vi.mock('../../store/useStore');

describe('HookForm (React Hook Form)', () => {
  const mockAddFormData = vi.fn();
  const mockCloseModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => ({
        addFormData: mockAddFormData,
        closeModal: mockCloseModal,
        countries: [
          'United States',
          'Canada',
          'Mexico',
          'Brazil',
          'United Kingdom',
          'Germany',
          'France',
          'Italy',
          'Spain',
          'Australia',
          'Japan',
          'China',
        ],
      })
    );
  });

  it('submits form with valid data', async () => {
    render(<HookForm />);

    fireEvent.input(screen.getByLabelText('Name', { exact: true }), {
      target: { value: 'John' },
    });
    fireEvent.input(screen.getByLabelText('Age', { exact: true }), {
      target: { value: '25' },
    });
    fireEvent.input(screen.getByLabelText('Email', { exact: true }), {
      target: { value: 'john@example.com' },
    });
    fireEvent.input(screen.getByLabelText('Password', { exact: true }), {
      target: { value: 'P@ssw0rd' },
    });
    fireEvent.input(
      screen.getByLabelText('Confirm Password', { exact: true }),
      {
        target: { value: 'P@ssw0rd' },
      }
    );
    fireEvent.change(screen.getByLabelText('Gender', { exact: true }), {
      target: { value: 'male' },
    });
    fireEvent.input(screen.getByLabelText('Country', { exact: true }), {
      target: { value: 'United States' },
    });
    fireEvent.click(
      screen.getByLabelText('Accept Terms and Conditions', { exact: true })
    );

    await waitFor(() => {
      expect(screen.getByText('Submit')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockAddFormData).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John',
          age: 25,
          email: 'john@example.com',
          gender: 'male',
          country: 'United States',
        })
      );
    });
  });

  it('shows password strength meter', async () => {
    render(<HookForm />);

    fireEvent.input(screen.getByLabelText('Password', { exact: true }), {
      target: { value: 'Password123' },
    });

    await waitFor(() => {
      expect(screen.getByText('Strength: Good')).toBeInTheDocument();
    });
  });

  it('submits form without image', async () => {
    render(<HookForm />);

    fireEvent.input(screen.getByLabelText('Name', { exact: true }), {
      target: { value: 'John' },
    });
    fireEvent.input(screen.getByLabelText('Age', { exact: true }), {
      target: { value: '25' },
    });
    fireEvent.input(screen.getByLabelText('Email', { exact: true }), {
      target: { value: 'john@example.com' },
    });
    fireEvent.input(screen.getByLabelText('Password', { exact: true }), {
      target: { value: 'P@ssw0rd' },
    });
    fireEvent.input(
      screen.getByLabelText('Confirm Password', { exact: true }),
      {
        target: { value: 'P@ssw0rd' },
      }
    );
    fireEvent.change(screen.getByLabelText('Gender', { exact: true }), {
      target: { value: 'male' },
    });
    fireEvent.input(screen.getByLabelText('Country', { exact: true }), {
      target: { value: 'United States' },
    });
    fireEvent.click(
      screen.getByLabelText('Accept Terms and Conditions', { exact: true })
    );

    await waitFor(() => {
      expect(screen.getByText('Submit')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockAddFormData).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John',
          age: 25,
          email: 'john@example.com',
          gender: 'male',
          country: 'United States',
          image: null,
        })
      );
    });
  });
});
