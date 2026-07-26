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
    expect(screen.getByText('Factory Photos')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('should render Footer correctly', () => {
    render(<Footer />);
    expect(screen.getByAltText('Bala Enterprise Logo')).toBeInTheDocument();
    expect(screen.getByText('GST certified manufacturer of heavy-duty overhead cranes, wire rope hoists, winches, stackers, and hand pallet trucks serving factories & GIDC industrial plants across Gujarat and India.')).toBeInTheDocument();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getAllByText('Contact Us').length).toBeGreaterThan(0);
  });
});
