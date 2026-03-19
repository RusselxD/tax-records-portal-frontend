const AVATAR_COLORS = [
  { bg: "bg-red-200", text: "text-red-700" },
  { bg: "bg-orange-200", text: "text-orange-700" },
  { bg: "bg-amber-200", text: "text-amber-700" },
  { bg: "bg-yellow-200", text: "text-yellow-700" },
  { bg: "bg-lime-200", text: "text-lime-700" },
  { bg: "bg-green-200", text: "text-green-700" },
  { bg: "bg-emerald-200", text: "text-emerald-700" },
  { bg: "bg-teal-200", text: "text-teal-700" },
  { bg: "bg-cyan-200", text: "text-cyan-700" },
  { bg: "bg-sky-200", text: "text-sky-700" },
  { bg: "bg-blue-200", text: "text-blue-700" },
  { bg: "bg-indigo-200", text: "text-indigo-700" },
  { bg: "bg-violet-200", text: "text-violet-700" },
  { bg: "bg-purple-200", text: "text-purple-700" },
  { bg: "bg-fuchsia-200", text: "text-fuchsia-700" },
  { bg: "bg-pink-200", text: "text-pink-700" },
  { bg: "bg-rose-200", text: "text-rose-700" },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarColor(name: string) {
  const index = hashString(name) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}
