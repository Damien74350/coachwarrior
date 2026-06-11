export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-12 skeleton rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
      </div>
      <div className="h-64 skeleton rounded-2xl" />
    </div>
  );
}
