import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:pl-64">
                <Header />
                <main className="py-6 px-4 lg:px-8 pb-20 lg:pb-6">
                    {children}
                </main>
            </div>
            <MobileNav />
        </div>
    );
}
