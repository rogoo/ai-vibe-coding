import { render, screen, fireEvent } from '@testing-library/react'
import Home from './Home'

describe('Home', () => {
  it('renders the home heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument()
  })

  it('increments the counter on click', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /count is 0/i })
    fireEvent.click(button)
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
  })
})
