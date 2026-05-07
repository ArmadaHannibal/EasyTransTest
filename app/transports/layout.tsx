export default function TransportsLayout({
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
