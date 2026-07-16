/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/public/Header';
import Footer from '../components/public/Footer';

// Mock next/navigation pathname
jest.mock('next/navigation', () => ({
  usePathname() {
    return '/';
  },
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

describe('Public Layout Components', () => {
  it('should render Header correctly', () => {
    render(<Header />);
    expect(screen.getByAltText('Bala Enterprise Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('should render Footer correctly', () => {
    render(<Footer />);
    expect(screen.getByAltText('Bala Enterprise Logo')).toBeInTheDocument();
    expect(screen.getByText('Premium manufacturer of high-quality Single/Double Girder EOT Cranes, Gantry Cranes, Jib Cranes, and custom industrial material handling equipment.')).toBeInTheDocument();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Contact us')).toBeInTheDocument();
  });
});
