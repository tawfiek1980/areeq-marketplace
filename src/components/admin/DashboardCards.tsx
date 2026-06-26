type Props = {
  stats: Record<string, number>;
};

export default function DashboardCards({ stats }: Props) {
  const cards = [
    { label: 'الإعلانات', value: stats.listings },
    { label: 'المستخدمين', value: stats.users },
    { label: 'الحمولات', value: stats.loads },
    { label: 'الوظائف', value: stats.jobs },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">{c.label}</p>
          <p className="text-xl font-bold">{c.value}</p>
        </div>
      ))}
    </div>
  );
}