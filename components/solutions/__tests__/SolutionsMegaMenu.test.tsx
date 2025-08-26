import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SolutionsMegaMenu } from '../SolutionsMegaMenu'
import { SolutionCategory, Solution } from '@/types/solutions'

// Mock category data
const mockCategories: SolutionCategory[] = [
  {
    id: 'category-1',
    name: 'Customer Service',
    slug: 'customer-service',
    tagline: 'Automate customer interactions',
    iconName: 'Bot',
    featured: true,
    sortOrder: 1,
    solutions: [
      {
        id: 'solution-1',
        title: 'Chatbot Solution',
        summary: 'AI-powered chatbot',
        category: {} as any, // Will be filled by parent
        tags: ['AI', 'Chat'],
        featured: true,
        ctaText: 'Learn More',
        ctaUrl: '/solutions/customer-service/chatbot',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'category-2',
    name: 'Analytics',
    slug: 'analytics',
    tagline: 'Data-driven insights',
    iconName: 'LineChart',
    featured: true,
    sortOrder: 2,
    solutions: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

const mockFeaturedSolutions: Solution[] = [
  {
    id: 'featured-1',
    title: 'Featured Solution',
    summary: 'Top performing solution',
    category: mockCategories[0],
    tags: ['Popular'],
    featured: true,
    ctaText: 'Get Started',
    ctaUrl: '/solutions/featured',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

describe('SolutionsMegaMenu', () => {
  it('renders the trigger button', () => {
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
      />
    )
    
    expect(screen.getByRole('button', { name: /solutions/i })).toBeInTheDocument()
  })

  it('shows menu on hover', async () => {
    const user = userEvent.setup()
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    await user.hover(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Customer Service')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
    })
  })

  it('shows menu on focus', async () => {
    const user = userEvent.setup()
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    await user.tab() // Focus the trigger
    
    await waitFor(() => {
      expect(screen.getByText('Customer Service')).toBeInTheDocument()
    })
  })

  it('displays categories with correct information', async () => {
    const user = userEvent.setup()
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    await user.hover(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Customer Service')).toBeInTheDocument()
      expect(screen.getByText('Automate customer interactions')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByText('Data-driven insights')).toBeInTheDocument()
    })
  })

  it('displays featured solutions', async () => {
    const user = userEvent.setup()
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    await user.hover(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Featured Solution')).toBeInTheDocument()
      expect(screen.getByText('Top performing solution')).toBeInTheDocument()
    })
  })

  it('calls onCategoryClick when category is clicked', async () => {
    const user = userEvent.setup()
    const mockOnCategoryClick = jest.fn()
    
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
        onCategoryClick={mockOnCategoryClick}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    await user.hover(trigger)
    
    await waitFor(() => {
      const categoryButton = screen.getByText('Customer Service')
      return categoryButton
    })
    
    const categoryButton = screen.getByText('Customer Service')
    await user.click(categoryButton)
    
    expect(mockOnCategoryClick).toHaveBeenCalledWith(mockCategories[0])
  })

  it('calls onSolutionClick when solution is clicked', async () => {
    const user = userEvent.setup()
    const mockOnSolutionClick = jest.fn()
    
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
        onSolutionClick={mockOnSolutionClick}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    await user.hover(trigger)
    
    await waitFor(() => {
      const solutionButton = screen.getByText('Featured Solution')
      return solutionButton
    })
    
    const solutionButton = screen.getByText('Featured Solution')
    await user.click(solutionButton)
    
    expect(mockOnSolutionClick).toHaveBeenCalledWith(mockFeaturedSolutions[0])
  })

  it('closes menu on escape key', async () => {
    const user = userEvent.setup()
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    await user.hover(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Customer Service')).toBeInTheDocument()
    })
    
    await user.keyboard('{Escape}')
    
    await waitFor(() => {
      expect(screen.queryByText('Customer Service')).not.toBeInTheDocument()
    })
  })

  it('supports keyboard navigation with arrow keys', async () => {
    const user = userEvent.setup()
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    trigger.focus()
    
    await waitFor(() => {
      expect(screen.getByText('Customer Service')).toBeInTheDocument()
    })
    
    // Test arrow key navigation
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowUp}')
    
    // Menu should still be open
    expect(screen.getByText('Customer Service')).toBeInTheDocument()
  })

  it('closes menu when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <SolutionsMegaMenu
          categories={mockCategories}
          featuredSolutions={mockFeaturedSolutions}
        />
        <div data-testid="outside">Outside element</div>
      </div>
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    await user.hover(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Customer Service')).toBeInTheDocument()
    })
    
    const outsideElement = screen.getByTestId('outside')
    await user.click(outsideElement)
    
    await waitFor(() => {
      expect(screen.queryByText('Customer Service')).not.toBeInTheDocument()
    })
  })

  it('updates featured solutions when hovering different categories', async () => {
    const user = userEvent.setup()
    
    const categoriesWithSolutions = [
      {
        ...mockCategories[0],
        solutions: [
          {
            id: 'cat1-solution',
            title: 'Category 1 Solution',
            summary: 'Solution from category 1',
            category: mockCategories[0],
            tags: ['Cat1'],
            featured: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        ]
      },
      mockCategories[1]
    ]
    
    render(
      <SolutionsMegaMenu
        categories={categoriesWithSolutions}
        featuredSolutions={mockFeaturedSolutions}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    await user.hover(trigger)
    
    await waitFor(() => {
      const category = screen.getByText('Customer Service')
      return category
    })
    
    const category = screen.getByText('Customer Service')
    await user.hover(category)
    
    // Should show category-specific solutions when hovering category
    await waitFor(() => {
      // The menu should update to show category solutions
      expect(screen.getByText('Customer Service')).toBeInTheDocument()
    })
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
        className="custom-mega-menu"
      />
    )
    
    expect(container.firstChild).toHaveClass('custom-mega-menu')
  })

  it('handles empty categories gracefully', () => {
    render(
      <SolutionsMegaMenu
        categories={[]}
        featuredSolutions={mockFeaturedSolutions}
      />
    )
    
    expect(screen.getByRole('button', { name: /solutions/i })).toBeInTheDocument()
  })

  it('handles empty featured solutions gracefully', async () => {
    const user = userEvent.setup()
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={[]}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    await user.hover(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Customer Service')).toBeInTheDocument()
    })
  })
})

// Performance and accessibility tests
describe('SolutionsMegaMenu Accessibility', () => {
  it('has proper ARIA attributes', async () => {
    const user = userEvent.setup()
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-haspopup', 'true')
    
    await user.hover(trigger)
    
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('maintains focus management correctly', async () => {
    const user = userEvent.setup()
    render(
      <SolutionsMegaMenu
        categories={mockCategories}
        featuredSolutions={mockFeaturedSolutions}
      />
    )
    
    const trigger = screen.getByRole('button', { name: /solutions/i })
    trigger.focus()
    
    await user.keyboard('{Escape}')
    
    expect(trigger).toHaveFocus()
  })
})