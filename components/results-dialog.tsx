import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Award, RotateCcw } from "lucide-react"

interface ResultsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stats: {
    wpm: number
    accuracy: number
    correctChars: number
    incorrectChars: number
    totalChars: number
  }
  duration: number
  onRestart: () => void
}

export function ResultsDialog({ open, onOpenChange, stats, duration, onRestart }: ResultsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Test Results
          </DialogTitle>
          <DialogDescription>Here's how you performed in your {duration} second test</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">WPM</p>
              <p className="text-2xl font-bold">{stats.wpm}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold">{stats.accuracy}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">Correct Characters</p>
              <p className="text-2xl font-bold">{stats.correctChars}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">Incorrect Characters</p>
              <p className="text-2xl font-bold">{stats.incorrectChars}</p>
            </div>
          </div>
          <Button onClick={onRestart} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

