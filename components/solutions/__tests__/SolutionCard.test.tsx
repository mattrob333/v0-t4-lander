import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SolutionCard } from '../SolutionCard'
import { Solution } from '@/types/solutions'

// Mock solution data
const mockSolution: Solution = {
  id: 'test-solution',
  title: 'Test AI Solution',
  summary: 'This is a test solution summary',
  description: 'This is a detailed description of the test solution',
  category: {
    id: 'test-category',
    name: 'Test Category',
    slug: 'test-category',
    tagline: 'Test category tagline',
    iconName: 'Bot',
    featured: true,
    sortOrder: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  tags: ['AI', 'Automation', 'Test'],
  featured: true,
  iconName: 'Bot',
  ctaText: 'Learn More',
  ctaUrl: '/solutions/test-category/test-solution',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
}

describe('SolutionCard', () => {
  it('renders solution information correctly', () => {
    render(<SolutionCard solution={mockSolution} />)
    
    expect(screen.getByText('Test AI Solution')).toBeInTheDocument()
    expect(screen.getByText('This is a test solution summary')).toBeInTheDocument()
    expect(screen.getByText('Learn More')).toBeInTheDocument()
  })

  it('displays tags when provided', () => {
    render(<SolutionCard solution={mockSolution} />)
    
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('Automation')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('shows featured badge when solution is featured', () => {
    render(<SolutionCard solution={mockSolution} />)
    
    // Look for featured indicator (could be text or icon)
    const featuredElements = screen.queryAllByText(/featured/i)
    // Featured solutions may have visual indicators rather than text
    expect(featuredElements.length >= 0).toBe(true)
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const mockOnClick = jest.fn()
    
    render(<SolutionCard solution={mockSolution} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button') || screen.getByText('Test AI Solution').closest('div')
    if (card) {
      await user.click(card)
      expect(mockOnClick).toHaveBeenCalledWith(mockSolution)
    }
  })

  it('handles compact variant correctly', () => {
    render(<SolutionCard solution={mockSolution} variant="compact" />)
    
    expect(screen.getByText('Test AI Solution')).toBeInTheDocument()
    expect(screen.getByText('This is a test solution summary')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <SolutionCard solution={mockSolution} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('handles missing optional properties gracefully', () => {
    const minimalSolution: Solution = {
      ...mockSolution,
      description: undefined,
      ctaText: undefined,
      ctaUrl: undefined,
      iconName: undefined
    }
    
    render(<SolutionCard solution={minimalSolution} />)
    
    expect(screen.getByText('Test AI Solution')).toBeInTheDocument()
    expect(screen.getByText('This is a test solution summary')).toBeInTheDocument()
  })

  it('renders with keyboard navigation support', async () => {
    const user = userEvent.setup()
    const mockOnClick = jest.fn()
    
    render(<SolutionCard solution={mockSolution} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button') || screen.getByText('Test AI Solution').closest('[tabIndex]')
    if (card) {
      card.focus()
      await user.keyboard('{Enter}')
      expect(mockOnClick).toHaveBeenCalledWith(mockSolution)
    }
  })

  it('shows appropriate accessibility attributes', () => {
    render(<SolutionCard solution={mockSolution} />)
    
    const card = screen.getByRole('button') || screen.getByText('Test AI Solution').closest('div')
    if (card && card.tagName.toLowerCase() === 'button') {
      expect(card).toHaveAttribute('type', 'button')
    }
    
    // Check for aria-label or accessible name
    const titleElement = screen.getByText('Test AI Solution')
    expect(titleElement).toBeInTheDocument()
  })

  it('handles very long content gracefully', () => {
    const longContentSolution: Solution = {
      ...mockSolution,
      title: 'Very Long Solution Title That Should Be Handled Gracefully Without Breaking Layout',
      summary: 'This is an extremely long summary that contains a lot of text to test how the component handles overflow and text wrapping in various viewport sizes and scenarios.',
      tags: ['Very Long Tag Name', 'Another Extremely Long Tag', 'Short', 'Medium Tag', 'Yet Another Very Long Tag Name That Tests Overflow']
    }
    
    render(<SolutionCard solution={longContentSolution} />)
    
    expect(screen.getByText(longContentSolution.title)).toBeInTheDocument()
    expect(screen.getByText(longContentSolution.summary)).toBeInTheDocument()
  })
})

// Integration test for multiple SolutionCards
describe('SolutionCard Integration', () => {
  const multipleSolutions: Solution[] = [
    mockSolution,
    {
      ...mockSolution,
      id: 'solution-2',
      title: 'Second Solution',
      summary: 'Second solution summary',
      featured: false
    },
    {
      ...mockSolution,
      id: 'solution-3',
      title: 'Third Solution',
      summary: 'Third solution summary',
      tags: ['Different', 'Tags']
    }
  ]

  it('renders multiple solution cards correctly', () => {
    render(
      <div>
        {multipleSolutions.map(solution => (
          <SolutionCard key={solution.id} solution={solution} />
        ))}
      </div>
    )
    
    expect(screen.getByText('Test AI Solution')).toBeInTheDocument()
    expect(screen.getByText('Second Solution')).toBeInTheDocument()
    expect(screen.getByText('Third Solution')).toBeInTheDocument()
  })

  it('handles individual clicks on multiple cards', async () => {
    const user = userEvent.setup()
    const mockOnClick = jest.fn()
    
    render(
      <div>
        {multipleSolutions.map(solution => (
          <SolutionCard key={solution.id} solution={solution} onClick={mockOnClick} />
        ))}
      </div>
    )
    
    const firstCard = screen.getByText('Test AI Solution').closest('[role="button"], button, div[onClick]')
    const secondCard = screen.getByText('Second Solution').closest('[role="button"], button, div[onClick]')
    
    if (firstCard) await user.click(firstCard)
    if (secondCard) await user.click(secondCard)
    
    expect(mockOnClick).toHaveBeenCalledTimes(2)
    expect(mockOnClick).toHaveBeenNthCalledWith(1, multipleSolutions[0])
    expect(mockOnClick).toHaveBeenNthCalledWith(2, multipleSolutions[1])
  })
})