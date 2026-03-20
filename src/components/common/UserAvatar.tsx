import { getAvatarColor } from "../../lib/avatar-colors";
import { getInitials } from "../../lib/formatters";
import { resolveAssetUrl } from "../../lib/formatters";

interface UserAvatarProps {
  name: string;
  profileUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
} as const;

export default function UserAvatar({ name, profileUrl, size = "md" }: UserAvatarProps) {
  const sizeClasses = sizeMap[size];
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
}
