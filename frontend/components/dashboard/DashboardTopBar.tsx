'use client'

import React from 'react'
import { Bell, User } from 'lucide-react'

export function DashboardTopBar() {
  return (
    <div className="h-16 bg-background border-b border-border fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
