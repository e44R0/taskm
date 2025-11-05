import { useState } from 'react';

export const useSidebarState = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const navIsCollapsed = localStorage.getItem('@taskm_nav_isCollapsed');
    if (navIsCollapsed !== null) {
      if (navIsCollapsed === 'true') return true;
    }
    return false;
  });

  const toggleSidebar = () => {
    localStorage.setItem('@taskm_nav_isCollapsed', `${!isCollapsed}`);
    setIsCollapsed(!isCollapsed);
  };

  return [isCollapsed, toggleSidebar] as const;
};
