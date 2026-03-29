interface EmptyCardStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

export default function EmptyCardState({ icon, title, message }: EmptyCardStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[15rem] gap-2 text-center">
      <div className="text-gray-300 mb-1">{icon}</div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}
