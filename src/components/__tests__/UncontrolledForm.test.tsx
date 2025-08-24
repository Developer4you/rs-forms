import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UncontrolledForm from '../Forms/UncontrolledForm';
import { useStore } from '../../store/useStore';

vi.mock('../../store/useStore');

describe('UncontrolledForm', () => {
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
    render(<UncontrolledForm />);

    fireEvent.input(screen.getByLabelText('Name', { exact: true }), {
      target: { value: 'Jane' },
    });
    fireEvent.input(screen.getByLabelText('Age', { exact: true }), {
      target: { value: '30' },
    });
    fireEvent.input(screen.getByLabelText('Email', { exact: true }), {
      target: { value: 'jane@example.com' },
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
      target: { value: 'female' },
    });
    fireEvent.input(screen.getByLabelText('Country', { exact: true }), {
      target: { value: 'United States' },
    });
    fireEvent.click(
      screen.getByLabelText('Accept Terms and Conditions', { exact: true })
    );

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockAddFormData).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane',
          age: 30,
          email: 'jane@example.com',
          gender: 'female',
          country: 'United States',
        })
      );
    });
  });

  it('shows validation errors for invalid data', async () => {
    render(<UncontrolledForm />);

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(
        screen.getByText('Name must start with capital letter')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Age must be positive number')
      ).toBeInTheDocument();
    });
  });

  it('submits form without image', async () => {
    render(<UncontrolledForm />);

    fireEvent.input(screen.getByLabelText('Name', { exact: true }), {
      target: { value: 'Jane' },
    });
    fireEvent.input(screen.getByLabelText('Age', { exact: true }), {
      target: { value: '30' },
    });
    fireEvent.input(screen.getByLabelText('Email', { exact: true }), {
      target: { value: 'jane@example.com' },
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
      target: { value: 'female' },
    });
    fireEvent.input(screen.getByLabelText('Country', { exact: true }), {
      target: { value: 'United States' },
    });
    fireEvent.click(screen.getByRole('checkbox'));

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockAddFormData).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane',
          age: 30,
          email: 'jane@example.com',
          gender: 'female',
          country: 'United States',
          image: null,
        })
      );
    });
  });
});
