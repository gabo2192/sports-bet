import { Header } from "../sections/header";

interface Props {
  children: React.ReactNode;
}
export function MainLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="w-[90vw] mx-auto max-w-7xl">{children}</main>
    </>
  );
}
