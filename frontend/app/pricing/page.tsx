"use client"

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CheckCircle, X } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

export default function PricingPage() {
  const { lang } = useLanguage()
  const t = translations[lang]
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = t.pricing.plans

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.pricing.heading}</h1>
            <p className="text-xl text-muted-foreground mb-8">{t.pricing.desc}</p>

            {/* Billing Toggle (static labels) */}
            <div className="inline-flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingCycle === 'monthly' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingCycle === 'yearly' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs text-green-500 font-semibold">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {plans.map((plan: any, idx: number) => {
              return (
                <Card key={plan.name} className={`relative ${idx === 1 ? 'border-primary shadow-lg scale-105' : ''}`}>
                  {idx === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.description || ''}</p>
                    <div className="mt-6">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground ml-2">{plan.per}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.bullets.map((b: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6" href="/register">{t.pricing.plans[idx].name === plan.name ? 'Get Started' : 'Get Started'}</Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">No credit card required</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Feature Comparison Table - keep existing static table for now */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Compare All Features</h2>
            <div className="bg-background border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold">Starter</th>
                      <th className="text-center p-4 font-semibold bg-primary/5">Pro</th>
                      <th className="text-center p-4 font-semibold">Agency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* simplified placeholder rows */}
                    <tr className="border-b border-border">
                      <td className="p-4 text-sm">Uptime Monitoring</td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 text-sm">Daily Backups</td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-20 text-center">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
                <p className="text-lg text-muted-foreground mb-6">Our team is here to help you choose the right plan for your business.</p>
                <Button size="lg" href="/contact">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
