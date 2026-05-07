export default function profilLayout({
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
