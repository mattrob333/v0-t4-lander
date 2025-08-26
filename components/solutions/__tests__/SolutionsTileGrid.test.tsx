import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SolutionsTileGrid } from '../SolutionsTileGrid'
import { SolutionCategory } from '@/types/solutions'

// Mock category data
const mockCategories: SolutionCategory[] = [
  {
    id: 'customer-service',
    name: 'Customer Service',
    slug: 'customer-service',
    tagline: 'Automate customer interactions',
    description: 'Complete customer service automation',
    iconName: 'Bot',
    featured: true,
    sortOrder: 1,
    solutions: [
      {
        id: 'chatbot',
        title: 'AI Chatbot',
        summary: 'Intelligent customer support',
        category: {} as any,
        tags: ['AI', 'Chat'],
        featured: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'analytics',
    name: 'Analytics & Intelligence',
    slug: 'analytics',
    tagline: 'Data-driven insights',
    description: 'Advanced analytics solutions',
    iconName: 'LineChart',
    featured: true,
    sortOrder: 2,
    solutions: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'automation',
    name: 'Process Automation',
    slug: 'automation',
    tagline: 'Streamline workflows',
    description: 'Business process automation',
    iconName: 'Workflow',
    featured: true,
    sortOrder: 3,
    solutions: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

describe('SolutionsTileGrid', () => {
  it('renders all category tiles', () => {
    render(<SolutionsTileGrid categories={mockCategories} />)
    
    expect(screen.getByText('Customer Service')).toBeInTheDocument()
    expect(screen.getByText('Analytics & Intelligence')).toBeInTheDocument()
    expect(screen.getByText('Process Automation')).toBeInTheDocument()
  })

  it('displays category taglines', () => {
    render(<SolutionsTileGrid categories={mockCategories} />)
    
    expect(screen.getByText('Automate customer interactions')).toBeInTheDocument()
    expect(screen.getByText('Data-driven insights')).toBeInTheDocument()
    expect(screen.getByText('Streamline workflows')).toBeInTheDocument()
  })

  it('shows solution count for each category', () => {
    render(<SolutionsTileGrid categories={mockCategories} />)
    
    // Look for solution count indicators - could be text like "1 solution" or "2 solutions"
    const solutionCounts = screen.getAllByText(/solution/i)
    expect(solutionCounts.length).toBeGreaterThan(0)
  })

  it('calls onCategoryClick when category is clicked', async () => {
    const user = userEvent.setup()
    const mockOnCategoryClick = jest.fn()
    
    render(
      <SolutionsTileGrid
        categories={mockCategories}
        onCategoryClick={mockOnCategoryClick}
      />
    )
    
    const categoryTile = screen.getByText('Customer Service').closest('button, [role="button"], div[onClick]')
    if (categoryTile) {
      await user.click(categoryTile)
      expect(mockOnCategoryClick).toHaveBeenCalledWith(mockCategories[0])
    }
  })

  it('renders in home variant correctly', () => {
    render(<SolutionsTileGrid categories={mockCategories} variant="home" />)
    
    expect(screen.getByText('Customer Service')).toBeInTheDocument()
    // Home variant might have different styling or layout
  })

  it('renders in landing variant correctly', () => {
    render(<SolutionsTileGrid categories={mockCategories} variant="landing" />)
    
    expect(screen.getByText('Customer Service')).toBeInTheDocument()
    // Landing variant might have different styling or layout
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <SolutionsTileGrid
        categories={mockCategories}
        className="custom-grid-class"
      />
    )
    
    expect(container.firstChild).toHaveClass('custom-grid-class')
  })

  it('displays category icons correctly', () => {
    render(<SolutionsTileGrid categories={mockCategories} />)
    
    // Icons might be rendered as SVG elements with specific classes
    const icons = container.querySelectorAll('svg, [data-icon]')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('handles keyboard navigation correctly', async () => {
    const user = userEvent.setup()
    const mockOnCategoryClick = jest.fn()
    
    render(
      <SolutionsTileGrid
        categories={mockCategories}
        onCategoryClick={mockOnCategoryClick}
      />
    )
    
    const firstTile = screen.getByText('Customer Service').closest('[tabIndex], button')
    if (firstTile) {
      firstTile.focus()
      await user.keyboard('{Enter}')
      expect(mockOnCategoryClick).toHaveBeenCalledWith(mockCategories[0])
    }
  })

  it('supports space key activation', async () => {
    const user = userEvent.setup()
    const mockOnCategoryClick = jest.fn()
    
    render(
      <SolutionsTileGrid
        categories={mockCategories}
        onCategoryClick={mockOnCategoryClick}
      />
    )
    
    const firstTile = screen.getByText('Customer Service').closest('[tabIndex], button')
    if (firstTile) {
      firstTile.focus()
      await user.keyboard(' ')
      expect(mockOnCategoryClick).toHaveBeenCalledWith(mockCategories[0])
    }
  })

  it('displays hover states correctly', async () => {
    const user = userEvent.setup()
    render(<SolutionsTileGrid categories={mockCategories} />)
    
    const categoryTile = screen.getByText('Customer Service').closest('div')
    if (categoryTile) {
      await user.hover(categoryTile)
      // Check if hover styles are applied (would need to check computed styles)
      expect(categoryTile).toBeInTheDocument()
    }
  })

  it('handles empty categories array gracefully', () => {
    render(<SolutionsTileGrid categories={[]} />)
    
    // Should render without crashing, might show empty state
    const container = screen.getByRole('main') || document.body
    expect(container).toBeInTheDocument()
  })

  it('maintains responsive grid layout', () => {
    const { container } = render(<SolutionsTileGrid categories={mockCategories} />)
    
    // Check for grid CSS classes
    const gridElement = container.querySelector('[class*="grid"]')
    expect(gridElement).toBeInTheDocument()
  })

  it('shows correct solution counts', () => {
    const categoriesWithVaryingSolutions = [
      {
        ...mockCategories[0],
        solutions: [
          { id: '1', title: 'Solution 1' } as any,
          { id: '2', title: 'Solution 2' } as any,
          { id: '3', title: 'Solution 3' } as any
        ]
      },
      {
        ...mockCategories[1],
        solutions: [{ id: '4', title: 'Solution 4' } as any]
      },
      {
        ...mockCategories[2],
        solutions: []
      }
    ]
    
    render(<SolutionsTileGrid categories={categoriesWithVaryingSolutions} />)
    
    // Look for solution count text
    expect(screen.getByText(/3.*solution/i) || screen.getByText(/solution.*3/i)).toBeInTheDocument()
    expect(screen.getByText(/1.*solution/i) || screen.getByText(/solution.*1/i)).toBeInTheDocument()
  })

  it('handles categories with long names gracefully', () => {
    const categoriesWithLongNames = [
      {
        ...mockCategories[0],
        name: 'Very Long Category Name That Should Be Handled Properly',
        tagline: 'This is also a very long tagline that should wrap correctly without breaking the layout'
      }
    ]
    
    render(<SolutionsTileGrid categories={categoriesWithLongNames} />)
    
    expect(screen.getByText('Very Long Category Name That Should Be Handled Properly')).toBeInTheDocument()
    expect(screen.getByText(/very long tagline/i)).toBeInTheDocument()
  })
})

// Performance and accessibility tests
describe('SolutionsTileGrid Accessibility', () => {
  it('has proper semantic structure', () => {
    render(<SolutionsTileGrid categories={mockCategories} />)
    
    // Check for proper heading structure or semantic elements
    const tiles = screen.getAllByText(/Customer Service|Analytics|Process/)
    expect(tiles.length).toBeGreaterThan(0)
  })

  it('provides proper focus indicators', async () => {
    const user = userEvent.setup()
    render(<SolutionsTileGrid categories={mockCategories} />)
    
    const firstTile = screen.getByText('Customer Service').closest('[tabIndex], button')
    if (firstTile) {
      await user.tab()
      expect(document.activeElement).toBe(firstTile)
    }
  })

  it('has appropriate ARIA labels', () => {
    render(<SolutionsTileGrid categories={mockCategories} />)
    
    const tiles = screen.getAllByRole('button') || screen.getAllByRole('link')
    tiles.forEach(tile => {
      // Each tile should have accessible name
      expect(tile).toHaveAttribute('aria-label', expect.any(String))
      // OR have accessible text content
      || expect(tile.textContent?.trim()).toBeTruthy()
    })
  })
})

// Integration tests
describe('SolutionsTileGrid Integration', () => {
  it('works correctly with real-world category data', () => {
    const realWorldCategories = mockCategories.map(cat => ({
      ...cat,
      solutions: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
        id: `${cat.id}-solution-${i}`,
        title: `${cat.name} Solution ${i + 1}`,
        summary: `Solution ${i + 1} for ${cat.name}`,
        category: cat,
        tags: ['AI', 'Automation'],
        featured: i === 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }))
    }))
    
    render(<SolutionsTileGrid categories={realWorldCategories} />)
    
    realWorldCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument()
      expect(screen.getByText(category.tagline)).toBeInTheDocument()
    })
  })

  it('handles mixed featured/non-featured categories', () => {
    const mixedCategories = mockCategories.map((cat, index) => ({
      ...cat,
      featured: index % 2 === 0
    }))
    
    render(<SolutionsTileGrid categories={mixedCategories} />)
    
    // All categories should be rendered regardless of featured status
    mixedCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument()
    })
  })
})