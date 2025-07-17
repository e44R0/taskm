import Link from 'next/link';
// import styles from './navigation.module.css';
import { logout } from '@/api/logout';
import { useContext } from 'react';
import { AuthContext } from '@/components/auth-context/auth-context';
import router from 'next/router';
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, LogOut, Settings, User } from "lucide-react"

export const Navigation = () => {
  const auth = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogout = async () => {
    logout()
      .then(() => {
        console.log('Вы успешно разлогинились');
        auth.setStatus('unauthorized');
        router.push('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A]">
      <div
        className={`bg-[#0A0A0A] border-r border-[#2a2a2a] transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        } flex flex-col`}
      >

        <div className="p-4 flex flex-col items-center space-y-3">
          <Avatar className={`${isCollapsed ? "h-8 w-8" : "h-16 w-16"} transition-all duration-300`}>
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="text-center">
              <h3 className="font-semibold text-lg text-white">John Doe</h3>
              <p className="text-sm text-gray-400">john@example.com</p>
            </div>
          )}
        </div>

        <Separator className="bg-[#2a2a2a]" />

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/account">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-[#2a2a2a] ${isCollapsed ? "px-2" : "px-4"}`}
                >
                  <User className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3">Account</span>}
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-[#2a2a2a] ${isCollapsed ? "px-2" : "px-4"}`}
                >
                  <Settings className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3">Settings</span>}
                </Button>
              </Link>
            </li>
          </ul>
        </nav>

        <Separator className="bg-[#2a2a2a]" />


        <div className="p-4 space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 ${
              isCollapsed ? "px-2" : "px-4"
            }`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className={`w-full border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white ${isCollapsed ? "px-2" : "px-4"}`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Свернуть</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
