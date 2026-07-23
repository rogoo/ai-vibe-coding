import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FormTest from './FormTest'

describe('FormTest', () => {
  it('renders all fields', () => {
    render(<FormTest />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sex/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/observation/i)).toBeInTheDocument()
  })

  it('submits valid values', async () => {
    render(<FormTest />)

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Ada' } })
    fireEvent.change(screen.getByLabelText(/sex/i), { target: { value: 'female' } })
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '35' } })
    fireEvent.change(screen.getByLabelText(/observation/i), {
      target: { value: 'Loves math' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      const submitted = screen.getByTestId('submitted-values')
      expect(submitted).toHaveTextContent('Name: Ada')
      expect(submitted).toHaveTextContent('Sex: female')
      expect(submitted).toHaveTextContent('Age: 35')
      expect(submitted).toHaveTextContent('Observation: Loves math')
    })
  })

  it('shows validation error for name with 2 or fewer characters', async () => {
    render(<FormTest />)

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jo' } })
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '35' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent(
        'Name must have more than 2 characters',
      )
      expect(screen.getByTestId('error-banner')).toBeInTheDocument()
    })
  })

  it('shows validation error for age 30 or less', async () => {
    render(<FormTest />)

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Ada' } })
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '30' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByTestId('age-error')).toHaveTextContent(
        'Age must be bigger than 30',
      )
      expect(screen.getByTestId('error-banner')).toBeInTheDocument()
    })
  })
})
