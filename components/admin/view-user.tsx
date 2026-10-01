"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ViewUserModal({ open, onOpenChange, user }: any) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email || "-"}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</p>
          <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          <p><strong>Language:</strong> {user.lang}</p>
          <div>
            <strong>Address:</strong>
            <p>{user.address?.fulladdress || "-"}</p>
            <p>{user.address?.pincode || "-"}</p>
          </div>

          <div>
            <strong>Drivers:</strong>
            <ul className="list-disc ml-4">
              {user.drivers?.length > 0
                ? user.drivers.map((d: any) => (
                    <>
                    <li key={d._id}>Name: {d.name}</li>
                   <li key={d._id}> Phone: {d.phone}</li>
                    <li key={d._id}>License Number: {d.licenseNumber}</li>
                    </>
                  ))
                : "No Drivers"}
            </ul>
          </div>

          <div>
            <strong>Family Members:</strong>
            <ul className="list-disc ml-4">
              {user.familyMembers?.length > 0
                ? user.familyMembers.map((f: any) => (
                    <li key={f._id}>{f.name} — {f.phone}</li>
                  ))
                : "No Family Members"}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
