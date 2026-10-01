"use client"

import { Bell, Settings, User, Search, Menu, Globe } from "lucide-react"
// import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/app/admin/sidebar-context"
import LanguageSelector from "./Google-Transalate/language-selector"

export function Header() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-card border-b border-sidebar-ring/20 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex-1 max-w-xl">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users, QR codes, orders..."
              className="pl-10 bg-input border-sidebar-ring/20 text-foreground focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
            />
          </div> */}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
          <div>
            <LanguageSelector />
          </div>
        </Button>

        {/* <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Bell className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="w-5 h-5" />
        </Button> */}
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header >
  )
}
