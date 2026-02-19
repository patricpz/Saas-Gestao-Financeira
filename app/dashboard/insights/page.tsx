'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  Bot,
  MessageSquare,
  Send,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import Sidebar from '@/components/SideBar';

const currentPeriod = [20, 35, 50, 66, 53, 72, 76, 80];
const pastPeriod = [30, 42, 33, 50, 40, 53, 48, 44];

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />

      <main className="flex-1 px-4 py-4 md:px-6 md:py-5 lg:px-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">AI Insights</h1>
            <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              Advanced
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-slate-900">Alex Rivera</p>
              <p className="text-xs text-slate-500">Premium Member</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-900" />
          </div>
        </div>

        <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-400 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-3">
                <span className="rounded-xl bg-blue-500 p-2">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h2 className="text-3xl font-semibold">AI Financial Summary</h2>
              </div>

              <p className="max-w-3xl text-lg leading-relaxed text-slate-100">
                "Overall, your financial health is <strong className="text-emerald-400">excellent</strong>. This month, your net
                savings rate has increased by <strong>12.4%</strong> compared to your 6-month average. We&apos;ve detected a
                significant reduction in recurring subscription costs, but notice a slight uptick in miscellaneous retail
                spending."
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">Cash Flow Positive</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">Goal: Vacation (85%)</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">Debt: Low Risk</span>
              </div>
            </div>

            <Card className="border border-white/15 bg-white/10 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Top recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-100">
                  You have $2,400 sitting in a low-interest checking account. Moving this to your high-yield savings could net an extra
                  $120/year.
                </p>
                <Button className="mt-4 bg-white text-blue-700 hover:bg-blue-50">Execute Strategy</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[2fr_1fr]">
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-3xl font-semibold text-slate-900">Spending Analysis</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">Comparing current period vs. previous period</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />Current
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />Past Period
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <svg viewBox="0 0 520 210" className="h-72 w-full">
                  <line x1="20" y1="28" x2="500" y2="28" className="stroke-slate-200" strokeWidth="1" />
                  <line x1="20" y1="82" x2="500" y2="82" className="stroke-slate-200" strokeWidth="1" />
                  <line x1="20" y1="136" x2="500" y2="136" className="stroke-slate-200" strokeWidth="1" />
                  <line x1="20" y1="190" x2="500" y2="190" className="stroke-slate-200" strokeWidth="1" />

                  <polyline
                    fill="none"
                    stroke="rgb(203 213 225)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    points={pastPeriod.map((value, index) => `${20 + index * 68},${190 - value * 2}`).join(' ')}
                  />

                  <polyline
                    fill="none"
                    stroke="rgb(59 130 246)"
                    strokeWidth="3"
                    points={currentPeriod.map((value, index) => `${20 + index * 68},${190 - value * 2}`).join(' ')}
                  />
                </svg>

                <div className="mt-1 grid grid-cols-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-2xl border-0 bg-blue-600 text-white shadow-sm">
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-100">
                  <TrendingUp className="h-4 w-4" />
                  Predictive Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-50">Expected month-end balance based on your current velocity.</p>
                <p className="mt-3 text-2xl font-bold">$8,450.00</p>
              </CardContent>
            </Card>

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
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-semibold text-slate-900">Budget Alerts</CardTitle>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Dining & Entertainment</span>
                  <span className="font-semibold text-red-500">94%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-[94%] rounded-full bg-red-500" />
                </div>
                <p className="text-xs text-slate-500">$47.00 remaining of $800.00</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-900">AI Behavior Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <span className="mt-0.5 rounded-lg bg-blue-100 p-2 text-blue-700">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Unusual Transaction Detected</p>
                  <p className="mt-1 text-sm text-slate-700">
                    A $450.00 charge at &apos;Design Hardware&apos; is 3x higher than your average home improvement purchase.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
