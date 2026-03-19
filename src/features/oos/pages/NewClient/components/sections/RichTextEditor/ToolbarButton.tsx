interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

export default function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1 rounded transition-colors ${
        disabled
          ? "text-gray-300 cursor-not-allowed"
          : isActive
            ? "bg-primary/10 text-primary"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}
