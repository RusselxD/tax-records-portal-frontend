export function fileExtColor(ext: string): { bg: string; text: string } {
  switch (ext) {
    case "pdf":
      return { bg: "bg-red-100", text: "text-red-600" };
    case "doc":
    case "docx":
      return { bg: "bg-blue-100", text: "text-blue-600" };
    case "xls":
    case "xlsx":
    case "csv":
      return { bg: "bg-emerald-100", text: "text-emerald-600" };
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return { bg: "bg-violet-100", text: "text-violet-600" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-500" };
  }
}
