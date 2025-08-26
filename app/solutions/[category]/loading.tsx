export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur dark:bg-black/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
          <div className="h-12 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800 md:h-14" />
          <div className="hidden items-center gap-8 md:flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
          <div className="h-10 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumbs skeleton */}
        <div className="mb-8 flex items-center space-x-2">
          <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <span className="text-gray-400">/</span>
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <span className="text-gray-400">/</span>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Category hero skeleton */}
        <div className="mb-16 text-center">
          <div className="mb-4 h-16 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800 mx-auto" />
          <div className="mx-auto h-12 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mx-auto mt-4 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mx-auto mt-2 h-6 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          
          <div className="mt-8 h-12 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800 mx-auto" />
        </div>

        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {/* Section header skeleton */}
            <div className="mb-8">
              <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            </div>
            
            {/* Solutions grid skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-950">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
                    <div className="flex gap-2">
                      <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                      <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                    </div>
                  </div>
                  
                  <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="mb-4 space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                    <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="mb-6 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-900">
                    <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="mt-3 h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}