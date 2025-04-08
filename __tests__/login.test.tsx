import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from '@/app/auth/login/page'

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />)
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    render(<LoginPage />)
    
    fireEvent.change(screen.getByLabelText(/staff id/i), {
      target: { value: 'admin' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    // Wait for loading state
    expect(await screen.findByText(/signing in/i)).toBeInTheDocument()
  })
}) 