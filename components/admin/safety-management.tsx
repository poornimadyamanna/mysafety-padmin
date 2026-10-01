"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, MapPin, Phone, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const safetyAlertsData = [
  {
    id: "ALERT-001",
    type: "Improper Parking",
    location: "Sector 12, Delhi",
    reportedBy: "Helper - John Smith",
    timestamp: "2024-11-11 14:30",
    severity: "medium",
    status: "resolved",
  },
  {
    id: "ALERT-002",
    type: "Vehicle Windows Open",
    location: "Mall Road, Mumbai",
    reportedBy: "Helper - Sarah Johnson",
    timestamp: "2024-11-11 13:15",
    severity: "low",
    status: "resolved",
  },
  {
    id: "ALERT-003",
    type: "Keys Left in Ignition",
    location: "Airport Road, Bangalore",
    reportedBy: "Helper - Mike Wilson",
    timestamp: "2024-11-11 12:00",
    severity: "high",
    status: "active",
  },
  {
    id: "ALERT-004",
    type: "Smoke/Fire from Vehicle",
    location: "Highway 101, Pune",
    reportedBy: "Helper - Emma Davis",
    timestamp: "2024-11-11 10:45",
    severity: "critical",
    status: "emergency-response",
  },
]

const emergencyContactsData = [
  {
    id: "EC-001",
    name: "Police Emergency",
    number: "100",
    availability: "24/7",
    region: "All Regions",
  },
  {
    id: "EC-002",
    name: "Ambulance",
    number: "102",
    availability: "24/7",
    region: "All Regions",
  },
  {
    id: "EC-003",
    name: "Fire Service",
    number: "101",
    availability: "24/7",
    region: "All Regions",
  },
  {
    id: "EC-004",
    name: "Women Helpline",
    number: "1091",
    availability: "24/7",
    region: "India",
  },
]

const severityConfig = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

const statusConfig = {
  active: "bg-red-100 text-red-800",
  "emergency-response": "bg-orange-100 text-orange-800",
  resolved: "bg-green-100 text-green-800",
}

export function SafetyManagement() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Safety Management</h1>
        <p className="text-muted-foreground mt-2">Monitor safety alerts, emergency contacts, and SOS requests.</p>
      </div>

      {/* Safety Alerts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Safety Alerts Log</CardTitle>
              <CardDescription>Real-time vehicle safety incidents and reports</CardDescription>
            </div>
            <Badge variant="destructive">4 Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safetyAlertsData.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-mono text-sm">{alert.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {alert.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {alert.location}
                      </div>
                    </TableCell>
                    <TableCell>{alert.reportedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {alert.timestamp}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={severityConfig[alert.severity as keyof typeof severityConfig]}
                      >
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[alert.status as keyof typeof statusConfig]}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts Configuration</CardTitle>
          <CardDescription>Manage emergency services and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Supported Regions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emergencyContactsData.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-secondary" />
                        {contact.name}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-semibold">{contact.number}</TableCell>
                    <TableCell>
                      <Badge variant="default">{contact.availability}</Badge>
                    </TableCell>
                    <TableCell>{contact.region}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
