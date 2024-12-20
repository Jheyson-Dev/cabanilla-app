import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { UserForm } from "./user-form";
import { UserList } from "./user-list";
import { useUsers } from "@/hooks";

export default function UsersPage() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  // const queryClient = useQueryClient();
  const { data, isLoading, isError } = useUsers();

  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Sheet open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
          <SheetTrigger asChild>
            <Button>Add New User</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New User</SheetTitle>
            </SheetHeader>
            <UserForm
              onSubmit={() => {
                setIsCreateFormOpen(false);
                // Refresh the user list
              }}
              onCancel={() => setIsCreateFormOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex gap-6">
        <div className={`flex-1 transition-all`}>
          <UserList data={data || []} isError={isError} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
