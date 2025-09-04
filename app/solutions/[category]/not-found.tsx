import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search } from 'lucide-react'

export default function CategoryNotFound() {
  return (
    <main className="min-h-dvh bg-white text-black dark:bg-neutral-950 dark:text-white">
      
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-8">
            <Search className="mx-auto h-16 w-16 text-gray-400" />
          </div>
          
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-black dark:text-white">
            Solutions Category Not Found
          </h1>
          
          <p className="mb-8 max-w-md text-lg text-black/70 dark:text-white/70">
            The solutions category you're looking for doesn't exist or may have been moved.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#00A878] px-8 py-3 text-white hover:bg-[#00936B]"
            >
              <Link href="/solutions">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Browse All Solutions
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-black/20 px-8 py-3 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5"
            >
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
              Popular Solutions Categories
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              <Link 
                href="/solutions/customer-self-service"
                className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Customer Self-Service
              </Link>
              <Link 
                href="/solutions/agent-employee-copilots"
                className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Agent Copilots
              </Link>
              <Link 
                href="/solutions/analytics-quality-intelligence"
                className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Analytics Intelligence
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}