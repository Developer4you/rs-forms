import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import { useStore } from '../store/useStore';

vi.mock('../store/useStore');

describe('App', () => {
  it('renders submitted data', () => {
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => ({
        formData: [
          {
            id: '1',
            name: 'Test User',
            age: 25,
            email: 'test@example.com',
            gender: 'male',
            image: null,
            country: 'United States',
            createdAt: new Date(),
          },
        ],
        modals: { uncontrolled: false, hookForm: false },
        openModal: vi.fn(),
        closeModal: vi.fn(),
        countries: [],
      })
    );

    render(<App />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('opens modals when buttons are clicked', () => {
    const mockOpenModal = vi.fn();
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => ({
        formData: [],
        modals: { uncontrolled: false, hookForm: false },
        openModal: mockOpenModal,
        closeModal: vi.fn(),
        countries: [],
      })
    );

    render(<App />);
    fireEvent.click(screen.getByText('Open Uncontrolled Form'));
    expect(mockOpenModal).toHaveBeenCalledWith('uncontrolled');

    fireEvent.click(screen.getByText('Open React Hook Form'));
    expect(mockOpenModal).toHaveBeenCalledWith('hookForm');
  });
});
