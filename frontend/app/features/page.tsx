"use client"

import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { 
  Activity, Database, Shield, BarChart, Bell, Lock, 
  Zap, FileCheck, Globe, Clock, TrendingUp, AlertCircle 
} from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

export default function FeaturesPage() {
  const { lang } = useLanguage()
  const t = translations[lang]
  const features = [
    {
      icon: Activity,
      title: 'Website Monitoring',
      description: '24/7 uptime monitoring with instant alerts',
      benefits: [
        'Check your website every minute',
        'Instant email and SMS notifications',
        'Response time tracking',
        'Status page for your team',
        'Historical uptime reports',
        'Multiple check locations worldwide',
      ],
      color: 'blue',
    },
    {
      icon: Database,
      title: 'Backup & Restore',
      description: 'Automated daily backups with one-click recovery',
      benefits: [
        'Daily automatic backups',
        'Secure cloud storage',
        'One-click restore functionality',
        'Version history and rollback',
        'Database and file backups',
        '30-day backup retention',
      ],
      color: 'green',
    },
    {
      icon: Shield,
      title: 'Security Protection',
      description: 'Comprehensive security scanning and threat detection',
      benefits: [
        'Daily malware scans',
        'Vulnerability detection',
        'SSL certificate monitoring',
        'Firewall protection',
        'DDoS mitigation',
        'Security audit reports',
      ],
      color: 'purple',
    },
    {
      icon: BarChart,
      title: 'Reports & Analytics',
      description: 'Detailed performance insights and monthly reports',
      benefits: [
        'Monthly PDF reports',
        'Performance metrics',
        'Uptime statistics',
        'Security scan results',
        'Custom white-label reports',
        'Email delivery automation',
      ],
      color: 'orange',
    },
  ]

  const additionalFeatures = [
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Get notified through email, SMS, or Slack when issues occur',
    },
    {
      icon: Zap,
      title: 'Performance Tests',
      description: 'Monitor page load times and get speed optimization tips',
    },
    {
      icon: Lock,
      title: 'SSL Monitoring',
      description: 'Track SSL certificate expiry and get renewal reminders',
    },
    {
      icon: FileCheck,
      title: 'Content Monitoring',
      description: 'Detect unauthorized changes to your website content',
    },
    {
      icon: Globe,
      title: 'Global Monitoring',
      description: 'Check your site from multiple locations around the world',
    },
    {
      icon: Clock,
      title: 'Scheduled Checks',
      description: 'Run maintenance checks during low-traffic periods',
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Track performance trends and identify issues early',
    },
    {
      icon: AlertCircle,
      title: 'Incident Timeline',
      description: 'View detailed timeline of all incidents and resolutions',
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.features.heading}</h1>
            <p className="text-xl text-muted-foreground">{t.features.desc}</p>
          </div>

          {/* Main Features */}
          <div className="space-y-20 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isEven = index % 2 === 0
              
              return (
                <div 
                  key={feature.title}
                  className={`flex flex-col ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } gap-12 items-center`}
                >
                  <div className="flex-1">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${feature.color}-500/10 mb-6`}>
                      <Icon className={`w-8 h-8 text-${feature.color}-500`} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start">
                          <div className={`w-1.5 h-1.5 rounded-full bg-${feature.color}-500 mt-2 mr-3`} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <Card className="p-8">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-24 h-24 text-primary opacity-20" />
                      </div>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Additional Features Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">And Much More...</h2>
              <p className="text-lg text-muted-foreground">Everything you need to run a secure, reliable website</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.features.items.map((item, i) => (
                <Card key={i} hover>
                  <CardHeader>
                    <BarChart className="w-10 h-10 text-primary mb-3" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Integration Section */}
          <div className="max-w-4xl mx-auto mt-20">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Integrates With Your Favorite Tools
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Connect Axentralab with Slack, email, SMS, webhooks, and more. 
                  Get notified where you work.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="px-6 py-3 bg-background rounded-lg border border-border">
                    <p className="font-semibold">Slack</p>
                  </div>
                  <div className="px-6 py-3 bg-background rounded-lg border border-border">
                    <p className="font-semibold">Email</p>
                  </div>
                  <div className="px-6 py-3 bg-background rounded-lg border border-border">
                    <p className="font-semibold">SMS</p>
                  </div>
                  <div className="px-6 py-3 bg-background rounded-lg border border-border">
                    <p className="font-semibold">Webhooks</p>
                  </div>
                  <div className="px-6 py-3 bg-background rounded-lg border border-border">
                    <p className="font-semibold">API</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-20 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start protecting your website today with a 14-day free trial
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/register">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" href="/pricing">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
