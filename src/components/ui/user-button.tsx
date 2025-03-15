"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { LogoutButton } from "@/components/ui/logout-button";
import { LogOut, User } from "lucide-react";

import { useRouter } from "next/navigation";

export const UserButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-4 font-semibold mr-4 cursor-pointer">
        <Avatar>
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>

        <p>Admin</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30" align="end">
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer" onClick={handleClick}>
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
