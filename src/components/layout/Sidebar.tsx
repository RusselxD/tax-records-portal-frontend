import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useNotifications } from "../../contexts/NotificationsContext";
import { useTaskRequests } from "../../contexts/TaskRequestsContext";
import type { NavItem } from "../../types/navigation";

interface SidebarProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
  bottomAction?: ReactNode;
}

const Logo = ({ onClose }: { onClose: () => void }) => (
  <div className="h-[60px] flex items-center justify-between px-6 border-b border-white/10">
    <div className="flex items-center gap-3">
      <img src="/upturn.svg" className="w-8" />
      <div>
        <div className="font-semibold text-white text-sm">Upturn</div>
        <div className="text-xs text-white/50">Tax Records Portal</div>
      </div>
    </div>
    <button
      onClick={onClose}
      className="lg:hidden p-1.5 rounded-md text-white/60 hover:bg-white/10 transition-colors"
      aria-label="Close sidebar"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

const NavItemLink = ({
  item,
  onClick,
}: {
  item: NavItem;
  onClick: () => void;
}) => {
  const Icon = item.icon;
  const { unreadCount } = useNotifications();
  const { pendingCount } = useTaskRequests();
  const badgeCount =
    item.id === "notifications"
      ? unreadCount
      : item.id === "task-requests"
        ? pendingCount
        : 0;
  const showBadge = badgeCount > 0;

  return (
    <li>
      <NavLink
        to={item.path}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? "bg-accent text-primary"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {Icon && <Icon className="w-4 h-4" />}
            <span>{item.label}</span>
            {showBadge && (
              <span
                className={`w-[1.30rem] h-[1.30rem] rounded-full flex items-center justify-center text-[10px] font-semibold ${isActive ? "bg-primary text-accent" : "bg-accent text-primary"}`}
              >
                {badgeCount > 99 ? "99+" : badgeCount}
              </span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
};

const Navigation = ({
  items,
  onItemClick,
}: {
  items: NavItem[];
  onItemClick: () => void;
}) => (
  <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-dark">
    <ul className="space-y-1">
      {items.map((item) => (
        <NavItemLink key={item.id} item={item} onClick={onItemClick} />
      ))}
    </ul>
  </nav>
);

const Overlay = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <div
    className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
    onClick={onClick}
    aria-hidden="true"
  />
);

export default function Sidebar({
  navItems,
  isOpen,
  onClose,
  bottomAction,
}: SidebarProps) {
  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <aside
        className={`fixed left-0 top-0 h-dvh w-60 bg-sidebar-bg flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Logo onClose={onClose} />
        <Navigation items={navItems} onItemClick={onClose} />
        {bottomAction && (
          <div className="px-4 pb-6 border-t border-white/10 pt-4">
            {bottomAction}
          </div>
        )}
      </aside>
    </>
  );
}
