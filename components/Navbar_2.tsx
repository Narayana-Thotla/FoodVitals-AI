import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import fv from "./../public/fv-ai-logo.png";

const Navbar_2 = () => {
  const { data: session, status } = useSession();
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="navbar w-full">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobile Sidebar Trigger */}
            <div className="siddetrigger absolute inset-y-0 left-0 flex items-center md:hidden">
              <SidebarTrigger />
            </div>

            <div></div>

            {/* Right Side: Profile Dropdown and Logout */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {status === "unauthenticated" ? (
                ""
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    redirect("/");
                  }}
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2 me-2"
                >
                  Logout
                </button>
              )}

              {/* Profile Dropdown */}
              <div className="relative ml-3">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  onBlur={() => setDropdown(false)}
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    className="h-10 w-10 border-2 border-slate-100 rounded-full"
                    src={session?.user?.image || fv}
                    alt="User Avatar"
                    width={32}
                    height={32}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdown && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Settings
                    </a>
                    <a
                      onClick={() => {
                        signOut();
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Hidden by Default) */}
        {/* <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <a
              href="#"
              className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              aria-current="page"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Team
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Projects
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Calendar
            </a>
          </div>
        </div> */}
      </nav>
    </div>
  );
};

export default Navbar_2;
