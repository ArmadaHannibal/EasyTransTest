export default function DemandepartenairePageFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: "#060010",
      }}
    >
      <div>{children}</div>
    </section>
  );
}
