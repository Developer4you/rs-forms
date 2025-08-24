import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from '../Modal/Modal';

describe('Modal Component', () => {
  it('renders modal content when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('calls onClose when ESC key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking outside modal content', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.mouseDown(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalled();
  });
});
