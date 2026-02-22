'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Shield, CheckCircle, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log('Register:', formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Benefits */}
              <div className="hidden lg:block">
                <div className="mb-8">
                  <Shield className="w-16 h-16 text-primary mb-6" />
                  <h1 className="text-4xl font-bold mb-4">
                    Start Your Free Trial
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Join thousands of businesses protecting their websites with Axentralab
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">14-Day Free Trial</h3>
                      <p className="text-muted-foreground">
                        No credit card required. Full access to all features.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Setup in Minutes</h3>
                      <p className="text-muted-foreground">
                        Add your website and start monitoring instantly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Cancel Anytime</h3>
                      <p className="text-muted-foreground">
                        No long-term contracts. Stop whenever you want.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Expert Support</h3>
                      <p className="text-muted-foreground">
                        Get help from our security experts anytime you need it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div>
                <Card>
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
                      <p className="text-muted-foreground">
                        Get started with your free trial today
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />

                      <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />

                      <div className="relative">
                        <Input
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        <p className="text-xs text-muted-foreground mt-1">
                          At least 8 characters with letters and numbers
                        </p>
                      </div>

                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                          className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-primary"
                          required
                        />
                        <span className="text-sm text-muted-foreground">
                          I agree to the{' '}
                          <Link href="#" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="#" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>

                      <Button type="submit" size="lg" className="w-full">
                        Start Free Trial
                      </Button>
                    </form>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline font-semibold">
                          Log in
                        </Link>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Protected by 256-bit encryption • No credit card required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
