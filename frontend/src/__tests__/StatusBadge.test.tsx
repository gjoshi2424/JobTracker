import { render, screen } from '@testing-library/react';
import StatusBadge from '../components/StatusBadge';
import { ApplicationStatus } from '../types';
import '@testing-library/jest-dom';

// Helper: render the badge and return the element via data-testid
const renderBadge = (status: ApplicationStatus) => {
  render(<StatusBadge status={status} />);
  return screen.getByTestId('status-badge');
};

describe('StatusBadge', () => {
  // ── Label text ────────────────────────────────────────────────────────────────

  it('renders the APPLIED label', () => {
    renderBadge(ApplicationStatus.APPLIED);
    expect(screen.getByText('APPLIED')).toBeInTheDocument();
  });

  it('renders the INTERVIEW label', () => {
    renderBadge(ApplicationStatus.INTERVIEW);
    expect(screen.getByText('INTERVIEW')).toBeInTheDocument();
  });

  it('replaces underscore with a space for RECRUITER_SCREEN', () => {
    renderBadge(ApplicationStatus.RECRUITER_SCREEN);
    expect(screen.getByText('RECRUITER SCREEN')).toBeInTheDocument();
  });

  it('renders the OFFER label', () => {
    renderBadge(ApplicationStatus.OFFER);
    expect(screen.getByText('OFFER')).toBeInTheDocument();
  });

  it('renders the REJECTED label', () => {
    renderBadge(ApplicationStatus.REJECTED);
    expect(screen.getByText('REJECTED')).toBeInTheDocument();
  });

  // ── Correct status variant (via data-status) ──────────────────────────────────
  // Using data-status instead of Tailwind class names keeps the suite
  // resilient to CSS refactoring — if you switch from Tailwind to CSS modules
  // or rename utility classes, these tests will not break.

  it.each([
    ApplicationStatus.APPLIED,
    ApplicationStatus.RECRUITER_SCREEN,
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.OFFER,
    ApplicationStatus.REJECTED,
  ])('sets data-status="%s" on the badge', (status) => {
    const badge = renderBadge(status);
    expect(badge).toHaveAttribute('data-status', status);
  });

  // ── DOM structure ─────────────────────────────────────────────────────────────

  it('renders a <span> element', () => {
    const badge = renderBadge(ApplicationStatus.APPLIED);
    expect(badge.nodeName).toBe('SPAN');
  });
});
