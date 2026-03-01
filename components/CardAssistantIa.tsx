import { Bot, MessageSquare, Send, X } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

export const CardAssistantIa = () => {
    return (
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
                <p className="inline-flex items-center gap-2 text-sm font-semibold">
                    <MessageSquare className="h-4 w-4" />
                    FinAI Assistant
                </p>
                <X className="h-4 w-4 opacity-80" />
            </div>

            <CardContent className="space-y-4 p-4">
                <div className="flex items-start gap-3 rounded-xl bg-slate-100 p-3">
                    <span className="rounded-full bg-blue-100 p-2 text-blue-700">
                        <Bot className="h-4 w-4" />
                    </span>
                    <p className="text-sm text-slate-700">
                        Hello Alex! I&apos;ve analyzed your reports. Is there anything specific about your spending you&apos;d like to dive into today?
                    </p>
                </div>

                <div className="ml-auto max-w-[85%] rounded-xl bg-blue-600 px-3 py-2 text-sm text-white">
                    How much did I spend on coffee this month?
                </div>
            </CardContent>

            <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3">
                <input
                    readOnly
                    value="Ask anything..."
                    className="h-9 flex-1 rounded-md border border-slate-200 px-3 text-sm text-slate-500"
                />
                <Button size="icon" className="h-9 w-9 bg-blue-600 text-white hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    )
}