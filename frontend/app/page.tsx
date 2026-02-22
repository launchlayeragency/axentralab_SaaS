'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { 
  Shield, Activity, Database, FileCheck, Bell, Lock, 
  TrendingUp, Clock, CheckCircle, AlertTriangle, 
  Server, Zap, BarChart, Users
} from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

export default function Home() {
  const { lang } = useLanguage()
  const t = translations[lang]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-mesh pointer-events-none" />
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">{t.hero.badge}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance animate-fade-in-up">
              {t.hero.titlePre}{' '}
              <span className="text-primary">{t.hero.titleHighlight}</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance animate-fade-in-up animate-delay-100">
              {t.hero.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-200">
              <Button size="lg" href="/register">
                {t.hero.ctaTrial}
                <CheckCircle className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" href="/pricing">
                {t.hero.ctaPricing}
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4 animate-fade-in animate-delay-300">
              {t.hero.note}
            </p>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 max-w-5xl mx-auto animate-fade-in-up animate-delay-400">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border bg-muted/50 backdrop-blur">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              <div className="relative p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Activity className="w-5 h-5 text-green-500" />
                      <span className="text-xs text-green-500 font-semibold">ONLINE</span>
                    </div>
                    <p className="text-2xl font-bold">99.9%</p>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Database className="w-5 h-5 text-blue-500" />
                      <span className="text-xs text-blue-500 font-semibold">PROTECTED</span>
                    </div>
                    <p className="text-2xl font-bold">Daily</p>
                    <p className="text-sm text-muted-foreground">Backups</p>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="text-xs text-primary font-semibold">SECURE</span>
                    </div>
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="text-sm text-muted-foreground">Monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.problems.heading}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.problems.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {t.problems.cards.map((c, idx) => (
              <Card key={idx} className={idx === 0 ? 'bg-red-500/5 border-red-500/20' : idx === 1 ? 'bg-orange-500/5 border-orange-500/20' : 'bg-purple-500/5 border-purple-500/20'}>
                <CardHeader>
                  {idx === 0 && <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />}
                  {idx === 1 && <Database className="w-12 h-12 text-orange-500 mb-4" />}
                  {idx === 2 && <Lock className="w-12 h-12 text-purple-500 mb-4" />}
                  <CardTitle className={idx === 0 ? 'text-red-500' : idx === 1 ? 'text-orange-500' : 'text-purple-500'}>{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{c.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.solutions.heading}</h2>
            <p className="text-lg text-muted-foreground">{t.solutions.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {t.solutions.cards.map((c, i) => (
              <Card key={i} hover>
                <CardHeader>
                  <div className="w-14 h-14 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                    {i === 0 && <Database className="w-7 h-7 text-green-500" />}
                    {i === 1 && <Activity className="w-7 h-7 text-blue-500" />}
                    {i === 2 && <Shield className="w-7 h-7 text-purple-500" />}
                  </div>
                  <CardTitle>{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{c.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.features.heading}</h2>
            <p className="text-lg text-muted-foreground">{t.features.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {t.features.items.map((f, idx) => (
              <div key={idx} className="p-6 bg-background border border-border rounded-lg hover:border-primary/50 transition-all">
                <Activity className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}

            <div className="p-6 bg-background border border-border rounded-lg hover:border-primary/50 transition-all">
              <Database className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Daily Backups</h3>
              <p className="text-sm text-muted-foreground">
                Automatic secure cloud storage
              </p>
            </div>

            <div className="p-6 bg-background border border-border rounded-lg hover:border-primary/50 transition-all">
              <Shield className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Malware Scans</h3>
              <p className="text-sm text-muted-foreground">
                Detect threats before damage
              </p>
            </div>

            <div className="p-6 bg-background border border-border rounded-lg hover:border-primary/50 transition-all">
              <BarChart className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Monthly Reports</h3>
              <p className="text-sm text-muted-foreground">
                Detailed performance insights
              </p>
            </div>

            <div className="p-6 bg-background border border-border rounded-lg hover:border-primary/50 transition-all">
              <Bell className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Instant Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Email & SMS notifications
              </p>
            </div>

            <div className="p-6 bg-background border border-border rounded-lg hover:border-primary/50 transition-all">
              <FileCheck className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">One-Click Restore</h3>
              <p className="text-sm text-muted-foreground">
                Quick disaster recovery
              </p>
            </div>

            <div className="p-6 bg-background border border-border rounded-lg hover:border-primary/50 transition-all">
              <Lock className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">SSL Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Certificate expiry tracking
              </p>
            </div>

            <div className="p-6 bg-background border border-border rounded-lg hover:border-primary/50 transition-all">
              <Zap className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Speed Tests</h3>
              <p className="text-sm text-muted-foreground">
                Performance monitoring
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.how.heading}</h2>
            <p className="text-lg text-muted-foreground">{t.how.desc}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.how.steps.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">{i+1}</div>
                  <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.pricing.heading}</h2>
            <p className="text-lg text-muted-foreground">{t.pricing.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {t.pricing.plans.map((p, idx) => (
              <Card key={idx} className={`relative ${idx === 1 ? 'border-primary shadow-lg scale-105' : ''}`}>
                {idx === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                )}
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{p.price}</span>
                    <span className="text-muted-foreground">{p.per}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {p.bullets.map((b, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" href="/pricing">Get Started</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center security-badge">
                      <Shield className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      Built by Security Experts
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      Axentralab was founded by cybersecurity professionals who understand 
                      what it takes to keep websites safe. We use enterprise-grade infrastructure 
                      and follow industry best practices to protect your data.
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                      <div>
                        <p className="text-3xl font-bold text-primary">256-bit</p>
                        <p className="text-sm text-muted-foreground">Encryption</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-primary">99.9%</p>
                        <p className="text-sm text-muted-foreground">Uptime SLA</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-primary">24/7</p>
                        <p className="text-sm text-muted-foreground">Monitoring</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.final.heading}</h2>
            <p className="text-lg text-muted-foreground mb-8">{t.final.desc}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/register">
                {t.final.ctaTrial}
                <CheckCircle className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="ghost" href="/contact">{t.final.ctaContact}</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">{t.final.note}</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
