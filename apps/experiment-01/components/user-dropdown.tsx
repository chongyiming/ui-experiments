"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "../app/supabaseClient";
import { RiSettingsLine, RiTeamLine, RiLogoutBoxLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Component } from "./Component"; // Import the Component

export default function UserDropdown() {
  const router = useRouter();
  const [gmail, setGmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

  const handleSignOut = () => {
    // Add any sign out logic here (e.g., clearing tokens, cookies, etc.)

    // Redirect to home page
    router.push("/");
  };

  useEffect(() => {
    const authToken = localStorage.getItem(
      "sb-velfmvmemrzurdweumyo-auth-token"
    );

    if (authToken) {
      try {
        const parsedToken = JSON.parse(authToken);
        const userId = parsedToken?.user?.id;
        setGmail(parsedToken?.user?.email);
      } catch (error) {
        console.error("Error parsing auth token:", error);
      }
    } else {
      console.error("Auth token not found in localStorage");
    }
  }, [gmail]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
            <Avatar className="size-8">
              <AvatarImage
                src="./profile.jpg"
                width={32}
                height={32}
                alt="Profile image"
              />
              <AvatarFallback>KK</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64" align="end">
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              Joseph
            </span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {gmail}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              <RiSettingsLine
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Account settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <RiLogoutBoxLine
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render the Component dialog */}
      <Component isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}
