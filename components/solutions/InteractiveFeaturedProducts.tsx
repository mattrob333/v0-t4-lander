'use client';

import { FeaturedProducts } from './FeaturedProducts';

interface InteractiveFeaturedProductsProps {
  featuredProducts: any[];
}

export function InteractiveFeaturedProducts({ featuredProducts }: InteractiveFeaturedProductsProps) {
  return (
    <FeaturedProducts
      products={featuredProducts}
      onProductClick={(product) => {
        // Make Learn More buttons non-functional to prevent 404s
        // They now do nothing when clicked
        console.log('Learn more clicked for:', product.title)
      }}
    />
  )
}