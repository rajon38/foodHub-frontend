import Footer from "@/components/footer";
import { NavbarWrapper } from "@/components/layout/NavbarWrapper";

export default function CommonLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
        <NavbarWrapper />
        {children}
        <Footer />
    </div>
  );
}