export default function VoituresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-(--bg-legebluefort)">
      <div>
        {children}
      </div>
    </section>
  );
}
