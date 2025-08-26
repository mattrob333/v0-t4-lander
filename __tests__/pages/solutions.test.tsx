/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import SolutionsPage from '@/app/solutions/page'

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockedLink({ children, href }: any) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('next/image', () => {
  return function MockedImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock the interactive components to avoid client-side issues in tests
jest.mock('@/components/solutions/InteractiveSolutionsTileGrid', () => {
  return {
    InteractiveSolutionsTileGrid: ({ categories }: any) => (
      <div data-testid="solutions-grid">
        {categories.map((cat: any) => (
          <div key={cat.id} data-testid={`category-${cat.slug}`}>
            {cat.name}
          </div>
        ))}
      </div>
    )
  }
})

jest.mock('@/components/solutions/InteractiveFeaturedProducts', () => {
  return {
    InteractiveFeaturedProducts: ({ featuredProducts }: any) => (
      <div data-testid="featured-products">
        {featuredProducts.map((product: any) => (
          <div key={product.id} data-testid={`product-${product.id}`}>
            {product.title}
          </div>
        ))}
      </div>
    )
  }
})

jest.mock('@/components/header', () => {
  return {
    Header: () => <header data-testid="header">Header</header>
  }
})

describe('Solutions Page', () => {
  it('renders without crashing', () => {
    render(<SolutionsPage />)
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('displays the main hero section', () => {
    render(<SolutionsPage />)
    
    expect(screen.getByText(/AI-Powered Solutions/i)).toBeInTheDocument()
    expect(screen.getByText(/We design and implement AI/i)).toBeInTheDocument()
  })

  it('shows solutions categories', () => {
    render(<SolutionsPage />)
    
    expect(screen.getByTestId('solutions-grid')).toBeInTheDocument()
    
    // Check for specific categories
    expect(screen.getByTestId('category-customer-self-service')).toBeInTheDocument()
    expect(screen.getByTestId('category-agent-employee-copilots')).toBeInTheDocument()
    expect(screen.getByTestId('category-analytics-quality-intelligence')).toBeInTheDocument()
  })

  it('displays featured products section', () => {
    render(<SolutionsPage />)
    
    expect(screen.getByTestId('featured-products')).toBeInTheDocument()
  })

  it('includes call-to-action buttons', () => {
    render(<SolutionsPage />)
    
    expect(screen.getByText(/Book an AI Opportunity Scan/i)).toBeInTheDocument()
    expect(screen.getByText(/Browse Solutions/i)).toBeInTheDocument()
  })

  it('shows why choose us section', () => {
    render(<SolutionsPage />)
    
    expect(screen.getByText(/Why Choose Tier 4 Intelligence/i)).toBeInTheDocument()
    expect(screen.getByText(/Rapid 5-day POC development/i)).toBeInTheDocument()
    expect(screen.getByText(/Vendor-neutral recommendations/i)).toBeInTheDocument()
  })

  it('has proper structured data elements', () => {
    render(<SolutionsPage />)
    
    // Check for JSON-LD structured data
    const scripts = document.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBeGreaterThan(0)
  })

  it('includes proper SEO elements', () => {
    render(<SolutionsPage />)
    
    // Check for important SEO text content
    expect(screen.getByText(/AI-Powered Solutions to Transform Your Business/i)).toBeInTheDocument()
    expect(screen.getByText(/Our Areas of Expertise/i)).toBeInTheDocument()
  })

  it('handles responsive layout elements', () => {
    render(<SolutionsPage />)
    
    // Check for grid layouts and responsive containers
    const gridElements = document.querySelectorAll('[class*="grid"]')
    expect(gridElements.length).toBeGreaterThan(0)
    
    const responsiveContainers = document.querySelectorAll('[class*="lg:"], [class*="md:"], [class*="sm:"]')
    expect(responsiveContainers.length).toBeGreaterThan(0)
  })

  it('includes accessibility features', () => {
    render(<SolutionsPage />)
    
    // Check for proper semantic structure
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Check for heading hierarchy
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })
})