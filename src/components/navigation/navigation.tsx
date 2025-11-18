import Link from 'next/link';
// import styles from './navigation.module.css';
import { logout } from '@/api/logout';
import { useContext } from 'react';
import { AuthContext } from '@/components/auth-context/auth-context';
import router from 'next/router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useSidebarState } from './hooks/use-sidebar-state';

export const Navigation = () => {
  const auth = useContext(AuthContext);
  const [isCollapsed, toggleSidebar] = useSidebarState();

  const handleLogout = async () => {
    logout()
      .then(() => {
        console.log('Вы успешно разлогинились');
        auth.setStatus('unauthorized');
        auth.setUserData(null);
        router.push('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A]">
      <div
        className={`bg-[#0A0A0A] border-r border-[#0A0A0A] transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        } flex flex-col`}
      >
        <div className="p-4 flex flex-col items-center space-y-3">
          <Avatar
            className={`${isCollapsed ? 'h-8 w-8' : 'h-16 w-16'} transition-all duration-300`}
          >
            <AvatarImage src="" alt="User Avatar" />
            <AvatarFallback className={'text-gray-400'}>
              {auth.userData?.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="text-center">
              <h3 className="font-semibold text-lg text-white">
                {auth.userData?.username}
              </h3>
              <p className="text-sm text-gray-400">{auth.userData?.email}</p>
            </div>
          )}
        </div>

        {/*<Separator className="bg-[#2a2a2a]" />*/}

        <div className="flex-1"></div>

        <div className="p-4 space-y-2">
          <div className="space-y-2 mb-4">
            <Link href="/account">
              <Button
                variant="ghost"
                className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 ${isCollapsed ? 'px-2' : 'px-4'}`}
              >
                <User className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Account</span>}
              </Button>
            </Link>
            <Link href="/settings">
              <Button
                variant="ghost"
                className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 ${isCollapsed ? 'px-2' : 'px-4'}`}
              >
                <Settings className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Settings</span>}
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            className={`w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 ${
              isCollapsed ? 'px-2' : 'px-4'
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
            className={`w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white ${isCollapsed ? 'px-2' : 'px-4'}`}
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
