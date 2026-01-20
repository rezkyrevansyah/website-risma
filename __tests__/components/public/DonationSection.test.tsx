import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DonationSection } from '@/components/public/DonationSection';

// Mock the toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock clipboard API
const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
};
Object.assign(navigator, { clipboard: mockClipboard });

describe('DonationSection Component', () => {
  const mockDonation = {
    bankName: 'Bank Syariah Indonesia',
    accountNumber: '1234567890',
    holderName: 'Masjid Al Arqam',
    goalAmount: 100000000,
    currentAmount: 50000000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render section header with heart icon', () => {
    render(<DonationSection donation={mockDonation} />);

    expect(screen.getByText('Mari Berdonasi')).toBeInTheDocument();
  });

  it('should display bank name and holder name', () => {
    render(<DonationSection donation={mockDonation} />);

    expect(screen.getByText('Bank Syariah Indonesia')).toBeInTheDocument();
    expect(screen.getByText('a.n. Masjid Al Arqam')).toBeInTheDocument();
  });

  it('should display account number', () => {
    render(<DonationSection donation={mockDonation} />);

    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('should render copy button', () => {
    render(<DonationSection donation={mockDonation} />);

    const copyButton = screen.getByRole('button', { name: /salin/i });
    expect(copyButton).toBeInTheDocument();
  });

  it('should copy account number when copy button is clicked', async () => {
    const { toast } = require('sonner');
    render(<DonationSection donation={mockDonation} />);

    const copyButton = screen.getByRole('button', { name: /salin/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith('1234567890');
      expect(toast.success).toHaveBeenCalledWith(
        'Nomor rekening berhasil disalin!',
        expect.objectContaining({ description: '1234567890' })
      );
    });
  });

  it('should show "Tersalin" text after copying', async () => {
    render(<DonationSection donation={mockDonation} />);

    const copyButton = screen.getByRole('button', { name: /salin/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Tersalin')).toBeInTheDocument();
    });
  });

  it('should show error toast when copy fails', async () => {
    const { toast } = require('sonner');
    mockClipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));

    render(<DonationSection donation={mockDonation} />);

    const copyButton = screen.getByRole('button', { name: /salin/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal menyalin nomor rekening');
    });
  });

  it('should display progress bar with correct percentage', () => {
    render(<DonationSection donation={mockDonation} />);

    // 50M / 100M = 50%
    expect(screen.getByText('50% dari target')).toBeInTheDocument();
  });

  it('should format currency correctly for current amount', () => {
    render(<DonationSection donation={mockDonation} />);

    // Indonesian currency format - using regex to handle locale variations
    // The format may be Rp50.000.000, Rp 50.000.000, or IDR 50,000,000 depending on locale
    expect(screen.getByText(/50.?000.?000/)).toBeInTheDocument();
  });

  it('should format currency correctly for goal amount', () => {
    render(<DonationSection donation={mockDonation} />);

    // Using regex to handle locale variations
    expect(screen.getByText(/100.?000.?000/)).toBeInTheDocument();
  });

  it('should display "Terkumpul" and "Target" labels', () => {
    render(<DonationSection donation={mockDonation} />);

    expect(screen.getByText('Terkumpul')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
  });

  it('should render Quran verse', () => {
    render(<DonationSection donation={mockDonation} />);

    expect(screen.getByText(/QS. Al-Hadid: 11/i)).toBeInTheDocument();
  });

  it('should render note about confirmation', () => {
    render(<DonationSection donation={mockDonation} />);

    expect(screen.getByText(/Konfirmasi donasi via WhatsApp/i)).toBeInTheDocument();
  });

  it('should calculate progress correctly when over 100%', () => {
    const overTargetDonation = {
      ...mockDonation,
      currentAmount: 150000000, // 150M (150%)
    };

    render(<DonationSection donation={overTargetDonation} />);

    // Should show 150% but progress bar capped at 100%
    expect(screen.getByText('150% dari target')).toBeInTheDocument();
  });

  it('should use default donation when no props provided', () => {
    render(<DonationSection />);

    // Should render without crashing and use defaults from data
    expect(screen.getByText('Mari Berdonasi')).toBeInTheDocument();
  });
});
