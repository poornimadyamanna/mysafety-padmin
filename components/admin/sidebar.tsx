"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  QrCode,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  Bell,
  FolderKanban,
  Settings,
  Shield,
  LogOut,
  ShieldCheck,
  FileText,
  ShieldAlert,
  Wallet,
  WalletCards,
  WalletMinimal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/app/admin/sidebar-context"
import { deleteCookie } from "cookies-next";
import { Logout } from "@/lib/apicalls/login";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image"

const menuItems = [
  { icon: BarChart3, label: "Dashboard", href: "/admin/dashboard" },
  { icon: FileText, label: "Reports", href: "/admin/reports" },
  { icon: ShieldCheck, label: "2FA Security", href: "/admin/security" },
  { icon: QrCode, label: "QR Codes", href: "/admin/qr-codes" },
  { icon: Users, label: "User Management", href: "/admin/users" },
  { icon: Package, label: "Product Management", href: "/admin/products" },
  { icon: ShoppingCart, label: "Order Management", href: "/admin/orders" },
  { icon: FolderKanban, label: "Subscriptions", href: "/admin/subscriptions" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: ShieldAlert, label: "Emergency Management", href: "/admin/safety" },
  { icon: Wallet, label: "Lost & Found Management", href: "/admin/lost-found" },
  { icon: WalletMinimal, label: "Smart Card Links Master", href: "/admin/smart-card-links" },
  { icon: WalletCards, label: "Predefined Messages", href: "/admin/predefined-messages" },
  { icon: WalletCards, label: "Audio Management", href: "/admin/audio-management" },
  { icon: WalletCards, label: "Content Management", href: "/admin/content" },
  // { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  // { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen } = useSidebar()
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await Logout();
      if (res?.unauthorized) {
        deleteCookie("accessToken");
        router.push("/admin/login");
        toast.error("Logged out successfully");
        return;
      }

      if (res.success) {
        deleteCookie("accessToken");
        router.push("/admin/login");
        toast.success("Logged out successfully");
      } else {
        toast.error(res.error || "Logout failed");
        console.error("Logout failed:", res.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <aside
      className={cn(
        "h-screen bg-[#061235] text-white border-r border-[#FFCC00]/10 flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20",
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-[#FFCC00]/10">
        <div className="flex items-center gap-3">
          <Image src={'/my-safety-logo.svg'} alt="mySafety Logo" width={60} height={60} />
          {/* <div className="w-10 h-10 bg-[#FFCC00] rounded-lg flex items-center justify-center shrink-0"> */}
          {/* <Shield className="w-6 h-6 text-[#061235] font-bold" /> */}
          {/* </div> */}
          {isOpen && (
            <div>
              <h1 className="font-bold text-lg text-white">mySafety</h1>
              <p className="text-xs text-[#FFCC00]">24x7 Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2 no-scrollbar">

        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              title={!isOpen ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 justify-center",
                isOpen && "justify-start",
                isActive
                  ? "bg-[#FFCC00] text-[#061235] font-semibold shadow-lg"
                  : "text-gray-200 hover:bg-[#0a1a47] hover:text-[#FFCC00]",
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#FFCC00]/10">
        <button
          onClick={handleLogout}
          title={!isOpen ? "Logout" : undefined}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-200 hover:bg-[#0a1a47] hover:text-[#FFCC00] rounded-lg transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
