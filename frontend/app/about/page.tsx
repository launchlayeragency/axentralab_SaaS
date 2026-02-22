'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Shield, Target, Users, Lock } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">About Axentralab</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Built by Security Experts Who Care About Your Website
            </h1>
            <p className="text-xl text-muted-foreground">
              We started Axentralab because we've seen too many businesses lose everything 
              due to preventable website failures. We're here to change that.
            </p>
          </div>

          {/* Story Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <Card>
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                  <p>
                    Axentralab was founded in 2024 by a team of cybersecurity professionals 
                    and web developers who witnessed firsthand the devastating impact of website 
                    downtime, data loss, and security breaches on businesses of all sizes.
                  </p>
                  <p>
                    We saw small business owners lose years of work because they didn't have 
                    proper backups. We watched e-commerce sites hemorrhage revenue during 
                    unexpected downtime. We helped companies recover from security breaches 
                    that could have been prevented with proper monitoring.
                  </p>
                  <p>
                    These experiences drove us to create Axentralab – a comprehensive, 
                    affordable solution that gives every business access to enterprise-grade 
                    website protection. We believe that website security and reliability 
                    shouldn't be a luxury reserved for large corporations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Shield className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Security First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We treat your website security as seriously as you do. Every feature 
                    we build is designed with security and privacy at its core. Your data 
                    is encrypted, your backups are secure, and your trust is paramount.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Customer Success</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your success is our success. We're not just a monitoring service – 
                    we're your partner in keeping your website running smoothly. Our support 
                    team is always ready to help you solve problems and optimize your setup.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Simplicity & Reliability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe powerful tools should be easy to use. No complicated setup, 
                    no confusing dashboards, no hidden features. Just reliable protection 
                    that works exactly as you'd expect.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lock className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No hidden fees, no surprise charges, no fine print. We're upfront about 
                    our pricing, our capabilities, and our limitations. You'll always know 
                    exactly what you're getting and what you're paying for.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mission Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-12">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    To make enterprise-grade website protection accessible and affordable 
                    for every business, so no one has to experience the pain of preventable 
                    website failures.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div>
                      <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
                      <p className="text-muted-foreground">Websites Protected</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-primary mb-2">99.9%</p>
                      <p className="text-muted-foreground">Uptime Guarantee</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-primary mb-2">24/7</p>
                      <p className="text-muted-foreground">Monitoring & Support</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Commitment */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Our Security Commitment</h2>
              <p className="text-lg text-muted-foreground">
                We use the same security standards trusted by Fortune 500 companies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">256-bit Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  All data is encrypted in transit and at rest using military-grade encryption
                </p>
              </div>
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">SOC 2 Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  We follow industry-standard security practices and undergo regular audits
                </p>
              </div>
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">GDPR Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Full compliance with international data protection regulations
                </p>
              </div>
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Regular Security Audits</h3>
                <p className="text-sm text-muted-foreground">
                  Third-party penetration testing and security assessments
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Join Thousands of Protected Websites
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your free trial today and see why businesses trust Axentralab 
              to keep their websites safe and running smoothly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/register">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" href="/contact">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
