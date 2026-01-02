import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Contact } from './Contact';

// Mock fetch API
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('Contact Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // RENDERING TESTS
  // ==========================================
  describe('Rendering', () => {
    it('renders the contact section with correct heading', () => {
      render(<Contact />);
      
      expect(screen.getByRole('heading', { name: /montamos un dream team/i })).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      render(<Contact />);
      
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
    });

    it('renders submit button with correct text', () => {
      render(<Contact />);
      
      expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<Contact />);
      
      expect(screen.getByText(/tienes un proyecto en mente/i)).toBeInTheDocument();
    });

    it('has correct section id for navigation', () => {
      render(<Contact />);
      
      const section = document.getElementById('contacto');
      expect(section).toBeInTheDocument();
    });
  });

  // ==========================================
  // FORM STATE TESTS - EMPTY STATE
  // ==========================================
  describe('Form State - Empty', () => {
    it('starts with empty form fields', () => {
      render(<Contact />);
      
      expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/mensaje/i)).toHaveValue('');
    });

    it('submit button is enabled when form is empty', () => {
      render(<Contact />);
      
      expect(screen.getByRole('button', { name: /enviar mensaje/i })).not.toBeDisabled();
    });
  });

  // ==========================================
  // FORM STATE TESTS - VALID STATE
  // ==========================================
  describe('Form State - Valid', () => {
    it('accepts valid input in all fields', async () => {
      const user = userEvent.setup();
      render(<Contact />);
      
      const nameInput = screen.getByLabelText(/nombre/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/mensaje/i);

      await user.type(nameInput, 'María García');
      await user.type(emailInput, 'maria@example.com');
      await user.type(messageInput, 'Hola, me interesa colaborar contigo');

      expect(nameInput).toHaveValue('María García');
      expect(emailInput).toHaveValue('maria@example.com');
      expect(messageInput).toHaveValue('Hola, me interesa colaborar contigo');
    });
  });

  // ==========================================
  // FORM STATE TESTS - INVALID STATE (VALIDATION)
  // ==========================================
  describe('Form State - Invalid (Validation)', () => {
    it('does not submit with empty name', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });
      render(<Contact />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/mensaje/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('does not submit with empty email', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });
      render(<Contact />);
      
      await user.type(screen.getByLabelText(/nombre/i), 'Test Name');
      await user.type(screen.getByLabelText(/mensaje/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('does not submit with empty message', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });
      render(<Contact />);
      
      await user.type(screen.getByLabelText(/nombre/i), 'Test Name');
      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('does not submit with all fields empty', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });
      render(<Contact />);
      
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // INTERACTION TESTS - TYPING
  // ==========================================
  describe('Interactions - Typing', () => {
    it('updates name field on typing', async () => {
      const user = userEvent.setup();
      render(<Contact />);
      
      const nameInput = screen.getByLabelText(/nombre/i);
      await user.type(nameInput, 'Ana');
      
      expect(nameInput).toHaveValue('Ana');
    });

    it('updates email field on typing', async () => {
      const user = userEvent.setup();
      render(<Contact />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'ana@test.com');
      
      expect(emailInput).toHaveValue('ana@test.com');
    });

    it('updates message field on typing', async () => {
      const user = userEvent.setup();
      render(<Contact />);
      
      const messageInput = screen.getByLabelText(/mensaje/i);
      await user.type(messageInput, 'Hola mundo');
      
      expect(messageInput).toHaveValue('Hola mundo');
    });

    it('allows clearing fields', async () => {
      const user = userEvent.setup();
      render(<Contact />);
      
      const nameInput = screen.getByLabelText(/nombre/i);
      await user.type(nameInput, 'Test');
      await user.clear(nameInput);
      
      expect(nameInput).toHaveValue('');
    });
  });

  // ==========================================
  // INTERACTION TESTS - CLICK
  // ==========================================
  describe('Interactions - Click', () => {
    it('focuses input on click', async () => {
      const user = userEvent.setup();
      render(<Contact />);
      
      const nameInput = screen.getByLabelText(/nombre/i);
      await user.click(nameInput);
      
      expect(nameInput).toHaveFocus();
    });

    it('focuses textarea on click', async () => {
      const user = userEvent.setup();
      render(<Contact />);
      
      const messageInput = screen.getByLabelText(/mensaje/i);
      await user.click(messageInput);
      
      expect(messageInput).toHaveFocus();
    });
  });

  // ==========================================
  // INTERACTION TESTS - SUBMIT
  // ==========================================
  describe('Interactions - Submit', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });
      
      render(<Contact />);
      
      await user.type(screen.getByLabelText(/nombre/i), 'Test User');
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/mensaje/i), 'Test message content');
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });
    });

    it('sends correct data to EmailJS API', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });
      
      render(<Contact />);
      
      await user.type(screen.getByLabelText(/nombre/i), 'María');
      await user.type(screen.getByLabelText(/email/i), 'maria@test.com');
      await user.type(screen.getByLabelText(/mensaje/i), 'Mi mensaje');
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.emailjs.com/api/v1.0/email/send',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('María'),
          })
        );
      });
    });

    it('sends correct template params structure', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });
      
      render(<Contact />);
      
      await user.type(screen.getByLabelText(/nombre/i), 'Test');
      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/mensaje/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      await waitFor(() => {
        const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(callBody).toHaveProperty('service_id');
        expect(callBody).toHaveProperty('template_id');
        expect(callBody).toHaveProperty('user_id');
        expect(callBody.template_params).toHaveProperty('from_name', 'Test');
        expect(callBody.template_params).toHaveProperty('from_email', 'test@test.com');
        expect(callBody.template_params).toHaveProperty('message', 'Test message');
      });
    });
  });

  // ==========================================
  // ACCESSIBILITY TESTS
  // ==========================================
  describe('Accessibility', () => {
    it('has proper labels for all inputs', () => {
      render(<Contact />);
      
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
    });

    it('inputs have correct types', () => {
      render(<Contact />);
      
      expect(screen.getByLabelText(/nombre/i)).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    });

    it('inputs have autocomplete attributes', () => {
      render(<Contact />);
      
      expect(screen.getByLabelText(/nombre/i)).toHaveAttribute('autocomplete', 'name');
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('autocomplete', 'email');
    });

    it('required fields are marked as required', () => {
      render(<Contact />);
      
      expect(screen.getByLabelText(/nombre/i)).toBeRequired();
      expect(screen.getByLabelText(/email/i)).toBeRequired();
      expect(screen.getByLabelText(/mensaje/i)).toBeRequired();
    });

    it('inputs have placeholder text', () => {
      render(<Contact />);
      
      expect(screen.getByLabelText(/nombre/i)).toHaveAttribute('placeholder', 'Tu nombre');
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('placeholder', 'tu@email.com');
      expect(screen.getByLabelText(/mensaje/i)).toHaveAttribute('placeholder', 'Cuéntame sobre tu proyecto o idea...');
    });
  });

  // ==========================================
  // RESPONSIVE DESIGN TESTS
  // ==========================================
  describe('Responsive Design', () => {
    const setViewport = (width: number) => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });
      window.dispatchEvent(new Event('resize'));
    };

    it('renders correctly on mobile viewport (375px)', () => {
      setViewport(375);
      render(<Contact />);
      
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    });

    it('renders correctly on tablet viewport (768px)', () => {
      setViewport(768);
      render(<Contact />);
      
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    });

    it('renders correctly on desktop viewport (1024px)', () => {
      setViewport(1024);
      render(<Contact />);
      
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    });

    it('renders correctly on large desktop viewport (1440px)', () => {
      setViewport(1440);
      render(<Contact />);
      
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    });

    it('form container has responsive padding classes', () => {
      render(<Contact />);
      
      const form = document.querySelector('form');
      expect(form).toHaveClass('p-4', 'sm:p-6', 'md:p-8', 'lg:p-10');
    });
  });

  // ==========================================
  // UI STYLING TESTS
  // ==========================================
  describe('UI Styling', () => {
    it('has correct color classes for name label', () => {
      render(<Contact />);
      
      const label = screen.getByText('Nombre');
      expect(label).toHaveClass('text-[#FF1493]');
    });

    it('has correct color classes for email label', () => {
      render(<Contact />);
      
      const label = screen.getByText('Email');
      expect(label).toHaveClass('text-[#FFF01F]');
    });

    it('has correct color classes for message label', () => {
      render(<Contact />);
      
      const label = screen.getByText('Mensaje');
      expect(label).toHaveClass('text-[#00FF00]');
    });

    it('submit button has correct styling', () => {
      render(<Contact />);
      
      const button = screen.getByRole('button', { name: /enviar mensaje/i });
      expect(button).toHaveClass('bg-[#00FF00]');
      expect(button).toHaveClass('text-black');
    });

    it('inputs have dark background', () => {
      render(<Contact />);
      
      const nameInput = screen.getByLabelText(/nombre/i);
      expect(nameInput).toHaveClass('bg-[#1a1a1a]');
    });
  });
});
