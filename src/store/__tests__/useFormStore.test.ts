import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useStore } from '../useStore';

describe('useStore (Zustand)', () => {
  beforeEach(() => {
    act(() => {
      useStore.setState({ formData: [] });
    });
  });

  it('should add form data to store', () => {
    const formData = {
      name: 'John',
      age: 25,
      email: 'test@example.com',
      gender: 'male',
      image: null,
      country: 'United States',
    };

    act(() => {
      useStore.getState().addFormData(formData);
    });

    const state = useStore.getState();
    expect(state.formData).toHaveLength(1);
    expect(state.formData[0]).toEqual(
      expect.objectContaining({
        name: 'John',
        age: 25,
        email: 'test@example.com',
      })
    );
  });

  it('should clear forms', () => {
    act(() => {
      useStore.getState().addFormData({
        name: 'Test',
        age: 30,
        email: 'test@example.com',
        gender: 'female',
        image: null,
        country: 'Canada',
      });
    });

    expect(useStore.getState().formData).toHaveLength(1);

    act(() => {
      useStore.setState({ formData: [] });
    });

    expect(useStore.getState().formData).toHaveLength(0);
  });

  it('should open and close modals', () => {
    act(() => {
      useStore.getState().openModal('hookForm');
    });

    expect(useStore.getState().modals.hookForm).toBe(true);

    act(() => {
      useStore.getState().closeModal('hookForm');
    });

    expect(useStore.getState().modals.hookForm).toBe(false);
  });
});
