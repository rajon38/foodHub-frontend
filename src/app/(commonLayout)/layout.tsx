import { Navbar } from "@/components/layout/Navber";

export default function CommonLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
        <Navbar />
        {children}
    </div>
  );
}