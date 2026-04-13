import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationsContext";
import { getRolePrefix, UserRole } from "../../constants";
import UserAvatar from "../common/UserAvatar";

interface TopNavProps {
  pageTitle: string;
  onMenuClick: () => void;
}

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    const prefix = getRolePrefix(user?.roleKey ?? "");
    navigate(`${prefix}/notifications`);
  };

  return (
    <button onClick={handleClick} className="relative p-2 text-gray-600 hover:text-primary transition-colors">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && <UnreadBadge />}
    </button>
  );
};

const UnreadBadge = () => (
  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
);

const MenuButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="lg:hidden p-2 -ml-2 mr-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
    aria-label="Toggle sidebar"
  >
    <Menu className="w-5 h-5" />
  </button>
);

const PageTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2">
    <h1 className="text-lg font-semibold text-primary">{title}</h1>
  </div>
);

interface MenuAction {
  label: string;
  onClick: () => void;
}

interface UserMenuDropdownProps {
  name: string;
  subtitle: string;
  profileUrl?: string | null;
  actions: MenuAction[];
  onLogout: () => void;
}

const UserMenuDropdown = ({
  name,
  subtitle,
  profileUrl,
  actions,
  onLogout,
}: UserMenuDropdownProps) => (
    <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-64 max-w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20">
      {/* Info header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
        <UserAvatar name={name} profileUrl={profileUrl} size="lg" />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-primary truncate">{name}</div>
          {subtitle && <div className="text-xs text-gray-500 truncate">{subtitle}</div>}
        </div>
      </div>

      {/* Actions */}
      <div className="py-1">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="border-t border-gray-100 py-1">
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
);

export default function TopNav({ pageTitle, onMenuClick }: TopNavProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!showUserMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const isClient = user?.roleKey === UserRole.CLIENT;
  const isBilling = user?.roleKey === UserRole.BILLING;
  const isViewer = user?.roleKey === UserRole.VIEWER;
  const fullName = user?.name || "User";
  const subtitle = isClient ? "" : (user?.position || user?.role || "");

  const prefix = getRolePrefix(user?.roleKey ?? "");

  const menuActions: MenuAction[] = isClient
    ? [
        { label: "View Profile", onClick: () => { setShowUserMenu(false); navigate(`${prefix}/profile`); } },
        { label: "Account Settings", onClick: () => { setShowUserMenu(false); navigate(`${prefix}/account-settings`); } },
      ]
    : [
        { label: "View Profile", onClick: () => { setShowUserMenu(false); navigate(`${prefix}/profile`); } },
      ];

  return (
    <header className="h-[70px] bg-white border-b border-gray-200">
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <MenuButton onClick={onMenuClick} />
          {pageTitle && <PageTitle title={pageTitle} />}
        </div>

        <div className="flex items-center gap-4">
          {!isClient && !isBilling && !isViewer && <NotificationBell />}

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UserAvatar name={fullName} profileUrl={user?.profileUrl} />
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-primary">{fullName}</div>
                <div className="text-xs text-gray-600">{subtitle}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 hidden md:block" />
            </button>

            {showUserMenu && (
              <UserMenuDropdown
                name={fullName}
                subtitle={subtitle}
                profileUrl={user?.profileUrl}
                actions={menuActions}

                onLogout={logout}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
