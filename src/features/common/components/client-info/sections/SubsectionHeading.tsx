interface SubsectionHeadingProps {
  label: string;
}

export default function SubsectionHeading({ label }: SubsectionHeadingProps) {
  return (
    <div className="col-span-2 flex items-center gap-3 mt-2 first:mt-0">
      <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
