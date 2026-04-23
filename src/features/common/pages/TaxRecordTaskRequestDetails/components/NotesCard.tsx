export default function NotesCard({ notes }: { notes: string }) {
  return (
    <div className="rounded-lg bg-white border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-primary mb-2">Notes from Requester</h3>
      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {notes}
      </p>
    </div>
  );
}
