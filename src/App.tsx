import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@/hooks/use-theme";
import {CookiesProvider} from "react-cookie";
import {MainLayout} from "@/components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Analytics from "./pages/Analytics";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import RequireAuth from "@/components/RequireAuth";
import Home from "@/pages/Home.tsx";

const queryClient = new QueryClient();

const App = () => (<QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
        <CookiesProvider>
            <TooltipProvider>
                <Toaster/>
                <Sonner/>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/auth"
                               element={<RequireAuth isPublic={true}>
                                   <Auth/>
                               </RequireAuth>}/>
                        <Route path="/dashboard"
                               element={<RequireAuth>
                                   <MainLayout>
                                       <Dashboard/>
                                   </MainLayout>
                               </RequireAuth>}/>
                        <Route path="/transactions"
                               element={<RequireAuth>
                                   <MainLayout>
                                       <Transactions/>
                                   </MainLayout>
                               </RequireAuth>}/>
                        <Route path="/budgets"
                               element={<RequireAuth>
                                   <MainLayout>
                                       <Budgets/>
                                   </MainLayout>
                               </RequireAuth>}/>
                        <Route path="/analytics"
                               element={<RequireAuth>
                                   <MainLayout>
                                       <Analytics/>
                                   </MainLayout>
                               </RequireAuth>}/>
                        <Route path="/goals"
                               element={<RequireAuth>
                                   <MainLayout>
                                       <Goals/>
                                   </MainLayout>
                               </RequireAuth>}/>
                        <Route path="/settings"
                               element={<RequireAuth>
                                   <MainLayout>
                                       <Settings/>
                                   </MainLayout>
                               </RequireAuth>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </CookiesProvider>
    </ThemeProvider>
</QueryClientProvider>);

export default App;
