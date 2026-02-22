'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Activity, Database, Shield, AlertTriangle, 
  CheckCircle, Plus, TrendingUp, Clock 
} from 'lucide-react'

export default function DashboardPage() {
  const websites = [
    { 
      name: 'example.com', 
      status: 'online', 
      uptime: '99.9%', 
      lastChecked: '2 mins ago',
      responseTime: '234ms' 
    },
    { 
      name: 'mystore.com', 
      status: 'online', 
      uptime: '100%', 
      lastChecked: '1 min ago',
      responseTime: '189ms' 
    },
  ]

  const recentAlerts = [
    {
      type: 'warning',
      message: 'SSL certificate expires in 30 days',
      website: 'example.com',
      time: '2 hours ago',
    },
    {
      type: 'success',
      message: 'Daily backup completed',
      website: 'mystore.com',
      time: '3 hours ago',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-green-500" />
              <span className="text-xs text-green-500 font-semibold">ALL ONLINE</span>
            </div>
            <p className="text-3xl font-bold">2</p>
            <p className="text-sm text-muted-foreground">Websites Monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <span className="text-xs text-blue-500 font-semibold">EXCELLENT</span>
            </div>
            <p className="text-3xl font-bold">99.9%</p>
            <p className="text-sm text-muted-foreground">Average Uptime</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-8 h-8 text-purple-500" />
              <span className="text-xs text-purple-500 font-semibold">PROTECTED</span>
            </div>
            <p className="text-3xl font-bold">14</p>
            <p className="text-sm text-muted-foreground">Backups This Month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-xs text-primary font-semibold">SECURE</span>
            </div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Threats Detected</p>
          </CardContent>
        </Card>
      </div>

      {/* Websites Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Websites</CardTitle>
            <Button size="sm" href="/dashboard/websites">
              <Plus className="w-4 h-4 mr-2" />
              Add Website
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {websites.map((site) => (
              <div 
                key={site.name}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{site.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        {site.status}
                      </span>
                      <span>{site.uptime} uptime</span>
                      <span>{site.responseTime}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last checked</p>
                  <p className="text-sm font-medium">{site.lastChecked}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4 p-4 border border-border rounded-lg"
              >
                {alert.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{alert.message}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <span>{alert.website}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {alert.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help Getting Started?</h3>
          <p className="text-muted-foreground mb-6">
            Check out our documentation or contact support
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline">View Docs</Button>
            <Button>Contact Support</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
