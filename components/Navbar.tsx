import Link from "next/link";
import React from "react";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { Button } from "./ui/button";
import { LoginDialog } from "./LoginOptions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChefHat, User, LogOut, PenSquare } from "lucide-react";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-6 py-4 bg-white/95 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-1 md:gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            <Image
              src="/chefRobot.png"
              alt="TeachChef Logo"
              fill
              className="rounded-xl object-cover shadow-sm"
            />
          </div>
          <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            TeachChef
          </span>
        </Link>

        {/* User actions */}
        <div className="flex items-center gap-2 md:gap-6">
          {session?.user ? (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/recipe/create"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all font-medium"
                >
                  <PenSquare className="w-4 h-4" />
                  Create Recipe
                </Link>

                <Link
                  href={`/user/${session.user.id}`}
                  className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-slate-100 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="TeachChef Logo"
                        width={50}
                        height={50}
                        className="rounded-full object-cover shadow-sm"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                  <span className="font-medium text-slate-600 group-hover:text-slate-900">
                    {session.user.name}
                  </span>
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button
                    variant="ghost"
                    type="submit"
                    className="flex items-center gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </form>
              </div>

              {/* Enhanced Mobile Menu Dropdown */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-slate-100 transition-colors"
                    >
                      <Menu className="h-5 w-5 text-slate-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="md:hidden w-64 p-2 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl "
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-2 p-2">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          {session.user.image ? (
                            <Image
                              src={session.user.image}
                              alt="TeachChef Logo"
                              width={50}
                              height={50}
                              className="rounded-full object-cover shadow-sm"
                            />
                          ) : (
                            <ChefHat className="w-4 h-4 text-primary-600" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {session.user.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {session.user.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2 bg-slate-200" />

                    <DropdownMenuItem asChild className="my-1">
                      <Link
                        href="/recipe/create"
                        className="flex items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <PenSquare className="h-4 w-4 text-slate-500" />
                        <span>Create Recipe</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="my-1">
                      <Link
                        href={`/user/${session.user.id}`}
                        className="flex items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-500" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2 bg-slate-200" />

                    <DropdownMenuItem asChild className="my-1">
                      <form
                        action={async () => {
                          "use server";
                          await signOut({ redirectTo: "/" });
                        }}
                        className="w-full"
                      >
                        <Button
                          variant="ghost"
                          type="submit"
                          className="w-full justify-start p-2 font-normal text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </Button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <LoginDialog />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
