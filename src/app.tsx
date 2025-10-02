import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { toast, Toaster } from "sonner";
import { useAuthInit } from "./hooks/use-auth-init";
import { SignInPage } from "./pages/auth/sign-in/page";
import { Home } from "./pages/home";
import { ServiceDetailsPage } from "./pages/service-details";
import { AboutPage } from "./pages/about";
import { ContactPage } from "./pages/contact";
import { ForCompaniesPage } from "./pages/for-companies";
import { Dashboard } from "./pages/dashboard";
import { ProfilePage } from "./pages/profile";
import { AxiosError } from "axios";
import SignUpPage from "./pages/auth/sign-up/page";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
        mutations: {
            onError: (error) => {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.message || "Erro ao fazer login");
                }
            }
        }
    },

})

export default function App() {

    useAuthInit();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path='/entrar' element={<SignInPage />} />
                        <Route path='/cadastrar' element={<SignUpPage />} />
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/perfil' element={<ProfilePage />} />
                        <Route path='/sobre-nos' element={<AboutPage />} />
                        <Route path='/contato' element={<ContactPage />} />
                        <Route path='/for-companies' element={<ForCompaniesPage />} />
                        <Route path='/empresa/:companyId' element={<ServiceDetailsPage />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
            <Toaster />
        </>
    );
}
