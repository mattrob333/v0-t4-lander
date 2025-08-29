import { DebugEnvironment } from "@/components/debug-environment"
import { DebugHydration } from "@/components/debug-hydration"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 p-8">
      <DebugEnvironment />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Page</h1>
        
        <div className="space-y-8">
          <DebugHydration name="TestComponent">
            <div className="p-4 border rounded">
              <h2 className="text-xl font-semibold mb-2">Test Component</h2>
              <p>This is a test component to check for hydration issues.</p>
            </div>
          </DebugHydration>
          
          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Server Component</h2>
            <p>This is a server component that should render without issues.</p>
          </div>
          
          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Environment Info</h2>
            <p>NODE_ENV: {process.env.NODE_ENV}</p>
            <p>Time: {new Date().toISOString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
