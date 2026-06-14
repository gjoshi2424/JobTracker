import { render } from '@testing-library/react';
import LoadingSpinner from '../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('mounts without throwing', () => {
    expect(() => render(<LoadingSpinner />)).not.toThrow();
  });

  it('renders at least one element to the DOM', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).not.toBeNull();
  });
});
