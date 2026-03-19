import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationsContext";
import { getRolePrefix } from "../../constants";
import { getAvatarColor } from "../../lib/avatar-colors";
import { resolveAssetUrl } from "../../lib/formatters";

interface TopNavProps {
  pageTitle: string;
  onMenuClick: () => void;
}

interface UserAvatarProps {
  name: string;
  profileUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    const prefix = getRolePrefix(user!.roleKey);
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

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

const UserAvatar = ({ name, profileUrl, size = "md" }: UserAvatarProps) => {
  const sizeClasses =
    size === "sm" ? "w-6 h-6 text-[10px]" :
    size === "lg" ? "w-10 h-10 text-sm" :
    "w-8 h-8 text-xs";
  const { bg, text } = getAvatarColor(name);

  if (profileUrl) {
    return (
      <img
        src={resolveAssetUrl(profileUrl) ?? profileUrl}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizeClasses} ${bg} rounded-full flex items-center justify-center shrink-0`}>
      <span className={`${text} font-medium`}>{getInitials(name)}</span>
    </div>
  );
};

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

interface UserMenuDropdownProps {
  name: string;
  subtitle: string;
  profileUrl?: string | null;
  onClose: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
}

const UserMenuDropdown = ({
  name,
  subtitle,
  profileUrl,
  onClose,
  onViewProfile,
  onLogout,
}: UserMenuDropdownProps) => (
  <>
    <div className="fixed inset-0 z-10" onClick={onClose} />
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20">
      {/* Info header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
        <UserAvatar name={name} profileUrl={profileUrl} size="lg" />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-primary truncate">{name}</div>
          <div className="text-xs text-gray-500 truncate">{subtitle}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="py-1">
        <button
          onClick={onViewProfile}
          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Profile
        </button>
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
  </>
);

export default function TopNav({ pageTitle, onMenuClick }: TopNavProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullName = user?.name || "User";
  const subtitle = user?.position || user?.role || "";

  const handleViewProfile = () => {
    setShowUserMenu(false);
    const prefix = getRolePrefix(user!.roleKey);
    navigate(`${prefix}/profile`);
  };

  return (
    <header className="h-[70px] bg-white border-b border-gray-200">
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <MenuButton onClick={onMenuClick} />
          {pageTitle && <PageTitle title={pageTitle} />}
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UserAvatar name={fullName} profileUrl={user?.profileUrl} />
              <div className="text-left">
                <div className="text-sm font-medium text-primary">{fullName}</div>
                <div className="text-xs text-gray-600">{subtitle}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
            </button>

            {showUserMenu && (
              <UserMenuDropdown
                name={fullName}
                subtitle={subtitle}
                profileUrl={user?.profileUrl}
                onClose={() => setShowUserMenu(false)}
                onViewProfile={handleViewProfile}
                onLogout={logout}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
