"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersList } from "./users-list"
import FamilyDriverManagement from "./family-driver-management";
import { RolesManagement } from "./roles-management"
import { useState } from "react"
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users & Roles</h1>
        <p className="text-muted-foreground mt-2">
          Manage user accounts, family members, and drivers.
        </p>
      </div>
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone…"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="pl-10"
        />
      </div>
      {/* <UsersList searchTerm={searchTerm} /> */}
      {/* Tabs */}
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">All Users</TabsTrigger>
          {/* <TabsTrigger value="roles">Roles & Permissions</TabsTrigger> */}
          <TabsTrigger value="family-driver">Family Members & Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersList searchTerm={searchTerm} />
        </TabsContent>

        {/* <TabsContent value="roles">
          <RolesManagement />
        </TabsContent> */}

        <TabsContent value="family-driver">
          <FamilyDriverManagement searchTerm={searchTerm}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
