const CONFIG: Record<string, { label: string; className: string }> = {
  pending:   { label: 'ממתין לאישור', className: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'מאושר',        className: 'bg-green-100 text-green-700' },
  completed: { label: 'הושלם',        className: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'בוטל',         className: 'bg-red-100 text-red-600' },
};

export default function StatusBadge({ status }: { status: string }) {
  const { label, className } = CONFIG[status] || { label: status, className: 'bg-gray-100' };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{label}</span>;
}
