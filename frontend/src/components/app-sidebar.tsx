import * as React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../components/ui/sidebar"
import { useAuth } from "../context/AuthContext"
import { apiFetch } from "@/lib/api"

type Salon = { id: string; name: string }

const NAV_ITEMS = [
  {
    title: "Salon Setup",
    items: [{ title: "Invite nail artists", url: "/dashboard/invite" }],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, accessToken, logout } = useAuth()
  const navigate = useNavigate()
  const [salon, setSalon] = useState<Salon | null>(null)
  const [checkedSalon, setCheckedSalon] = useState(false)

  const isSalonManager = user?.role === "salon_manager"

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  useEffect(() => {
    if (!isSalonManager || !accessToken) return

    apiFetch<{ salon: Salon | null }>("/salons/my-salon", { accessToken })
      .then((data) => setSalon(data.salon))
      .finally(() => setCheckedSalon(true))
  }, [isSalonManager, accessToken])

  return (
    <Sidebar {...props} className="bg-[#EBAFE2]/40">
      <SidebarHeader className="flex flex-row items-center gap-2 bg-[#EBAFE2]/40">
        <img src="/logo.png" alt="NailBabe logo" className="h-10 w-10 object-contain" />
        <span className="text-sm font-semibold text-sidebar-foreground">NailBabe</span>
      </SidebarHeader>

      <SidebarContent className="bg-[#EBAFE2]/40">
        {isSalonManager &&
          NAV_ITEMS.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton render={<a href={item.url} />}>
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>

      <SidebarFooter className="bg-[#EBAFE2]/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut aria-hidden="true" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
