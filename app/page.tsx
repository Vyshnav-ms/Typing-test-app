import { TypingTest } from "@/components/typing-test"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen p-4 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="container mx-auto max-w-3xl pt-8">
        <TypingTest />
      </div>
    </main>
  )
}

