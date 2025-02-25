"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RotateCcw, Timer } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ResultsDialog } from "@/components/results-dialog"

const fallbackParagraphs = [
  "The quick brown fox jumps over the lazy dog.",
  "People hurried along the bustling city sidewalks.",
  "She opened the old book, pages yellowed with age.",
  "A breeze rustled the leaves of the oak tree.",
  "The chef seasoned the dish with garlic and thyme.",
  "The campfire crackled under the starry night sky.",
];

const specialCharactersParagraphs = [
  "Email: john.doe@example.com, site: https://example.com.",
  "Programming uses {}, [], (), and #, @, % symbols.",
  "Password needs !@#$%^&* and a number like 0-9.",
  "Username @StarGazer_99 used #NatureLover tag.",
  "Prices: $19.99, $45.50, code: SUMMER&FUN.",
  "Function used { } and array used [ ].",
];

interface TypingStats {
  wpm: number
  accuracy: number
  progress: number
  correctChars: number
  incorrectChars: number
  totalChars: number
}

const DURATION_OPTIONS = {
  "30": 30,
  "60": 60,
  "90": 90,
  "120": 120,
}

export function TypingTest() {
  const [text, setText] = useState("")
  const [input, setInput] = useState("")
  const [isStarted, setIsStarted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const [selectedDuration, setSelectedDuration] = useState<string>("60")
  const [includeSpecialChars, setIncludeSpecialChars] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    progress: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
  })

  const getRandomParagraph = useCallback(() => {
    const paragraphs = includeSpecialChars ? specialCharactersParagraphs : fallbackParagraphs
    const randomIndex = Math.floor(Math.random() * paragraphs.length)
    return paragraphs[randomIndex]
  }, [includeSpecialChars])

  const fillTextArea = useCallback(() => {
    let initialText = "";
    const linesToFill = 12; // Enough to fill ~40vh at text-sm
    for (let i = 0; i < linesToFill; i++) {
      initialText += (i > 0 ? " " : "") + getRandomParagraph();
    }
    return initialText;
  }, [getRandomParagraph])

  const updateText = useCallback(() => {
    const paragraphs = text.split(" ").filter(p => p.trim() !== "");
    const inputWords = input.trim().split(" ");
    const completedWords = inputWords.length;

    if (completedWords >= paragraphs.length * 0.8) {
      // Remove the earliest paragraph and add a new one
      const firstParagraphEnd = text.indexOf(" ", text.indexOf(".") + 1);
      const newText = text.slice(firstParagraphEnd + 1) + " " + getRandomParagraph();
      setText(newText);

      // Adjust input to match the new text by removing the completed portion
      const newInputStart = input.indexOf(" ", input.indexOf(".") + 1);
      if (newInputStart !== -1) {
        setInput(input.slice(newInputStart + 1));
      }
    }
  }, [text, input, getRandomParagraph]);

  const resetTest = useCallback(() => {
    setText(fillTextArea())
    setInput("")
    setIsStarted(false)
    setStartTime(null)
    setTimeLeft(Number.parseInt(selectedDuration))
    setShowResults(false)
    setStats({
      wpm: 0,
      accuracy: 100,
      progress: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
    })
  }, [fillTextArea, selectedDuration])

  useEffect(() => {
    resetTest()
  }, [resetTest])

  const calculateStats = useCallback(() => {
    if (!startTime || !text) return

    const timeElapsed = (Date.now() - startTime) / 1000 / 60
    const wordsTyped = input.trim().split(/\s+/).length
    const wpm = Math.round(wordsTyped / timeElapsed)

    let correctChars = 0
    let incorrectChars = 0
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) correctChars++
      else incorrectChars++
    }
    const accuracy = Math.round((correctChars / input.length) * 100) || 100
    const progress = Math.round((input.length / text.length) * 100)

    setStats({
      wpm,
      accuracy,
      progress,
      correctChars,
      incorrectChars,
      totalChars: input.length,
    })
  }, [input, startTime, text])

  useEffect(() => {
    if (isStarted && input.length > 0) {
      updateText();
    }
  }, [input, isStarted, updateText]);

  useEffect(() => {
    if (input && !startTime) {
      setStartTime(Date.now())
      setIsStarted(true)
    }

    if (isStarted) {
      calculateStats()
    }
  }, [input, startTime, isStarted, calculateStats])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsStarted(false)
            setShowResults(true)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isStarted, timeLeft])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Tab" || (e.key === "Enter" && !isStarted)) {
        e.preventDefault()
        resetTest()
      }
    },
    [isStarted, resetTest],
  )

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header: 15% of viewport */}
      <div className="h-[15vh] flex flex-col justify-center items-center p-2">
        <h1 className="text-2xl font-bold tracking-tight">SwiftKeys</h1>
        <p className="text-muted-foreground text-xs">Test your typing speed</p>
      </div>

      {/* Controls: 15% of viewport */}
      <div className="h-[15vh] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Timer className="h-3 w-3 text-muted-foreground" />
            <Select value={selectedDuration} onValueChange={setSelectedDuration} disabled={isStarted}>
              <SelectTrigger className="w-[80px] text-xs">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30" className="text-xs">30s</SelectItem>
                <SelectItem value="60" className="text-xs">1min</SelectItem>
                <SelectItem value="90" className="text-xs">1.5min</SelectItem>
                <SelectItem value="120" className="text-xs">2min</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-1">
            <Switch
              id="special-chars"
              checked={includeSpecialChars}
              onCheckedChange={setIncludeSpecialChars}
              disabled={isStarted}
              className="scale-75"
            />
            <Label htmlFor="special-chars" className="text-xs">Special</Label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-mono font-bold">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
          <Button variant="ghost" size="icon" onClick={resetTest} className="text-muted-foreground h-6 w-6">
            <RotateCcw className="h-3 w-3" />
            <span className="sr-only">Reset test</span>
          </Button>
        </div>
      </div>

      {/* Typing Area: 50% of viewport */}
      <div className="h-[50vh] px-4 flex flex-col space-y-2">
        <div className="relative h-[80%] border rounded-lg p-2 font-mono text-sm overflow-hidden">
          {text.split("").map((char, index) => {
            const isTyped = index < input.length
            const isCorrect = input[index] === char
            return (
              <span
                key={index}
                className={cn(
                  "transition-colors",
                  isTyped
                    ? isCorrect
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                    : "text-muted-foreground",
                )}
              >
                {char}
              </span>
            )
          })}
          <textarea
            id="typing-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 h-full w-full opacity-0"
            autoFocus
            disabled={!timeLeft || showResults}
          />
        </div>
        <Progress value={stats.progress} className="h-1" />
        <p className="text-center text-xs text-muted-foreground">
          Tab to restart • {text.split(/\s+/).length} words
        </p>
      </div>

      {/* Footer: 10% of viewport */}
      <footer className="h-[10vh] border-t flex items-center justify-center text-xs text-muted-foreground">
        <p>© 2025 SwiftKeys. Created by Vyshnav.</p>
      </footer>

      <ResultsDialog
        open={showResults}
        onOpenChange={setShowResults}
        stats={stats}
        duration={Number.parseInt(selectedDuration)}
        onRestart={resetTest}
      />
    </div>
  )
}