export default function SolutionsLoading() {
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

      {/* Hero section skeleton */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800 sm:h-20" />
            <div className="mx-auto mt-6 h-6 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mx-auto mt-2 h-6 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <div className="h-12 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-12 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Solutions grid skeleton */}
      <section className="bg-gray-50 py-20 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mx-auto h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mx-auto mt-4 h-4 w-96 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-950">
                    <div className="mb-4 h-12 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
                    <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="mt-4 h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="mb-6 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-lg bg-white p-4 dark:bg-neutral-950">
                      <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}