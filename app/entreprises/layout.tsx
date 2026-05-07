export default function EntreprisesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        backgroundColor: "#060010",
      }}
    >
      <div>{children}</div>
    </section>
  );
}
