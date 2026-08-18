export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-screen min-h-screen overflow-hidden">{children}</div>;
}
