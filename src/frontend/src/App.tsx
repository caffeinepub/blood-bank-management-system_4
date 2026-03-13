import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import AppLayout from "./components/AppLayout";
import { useAuth } from "./features/auth/useAuth";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import BloodStockPage from "./pages/BloodStockPage";
import DonorsPage from "./pages/DonorsPage";
import LandingPage from "./pages/LandingPage";
import ManageRequestsPage from "./pages/ManageRequestsPage";
import RegisterPage from "./pages/RegisterPage";
import RequestBloodPage from "./pages/RequestBloodPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import UserLoginPage from "./pages/UserLoginPage";

// Root route component
function RootComponent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <AppLayout />;
}

// Root route with layout for authenticated pages
const rootRoute = createRootRoute({
  component: RootComponent,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LandingPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-login",
  component: AdminLoginPage,
});

const userLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user-login",
  component: UserLoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-dashboard",
  component: AdminDashboardPage,
});

const userDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user-dashboard",
  component: UserDashboardPage,
});

const donorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/donors",
  component: DonorsPage,
});

const bloodStockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blood-stock",
  component: BloodStockPage,
});

const requestBloodRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/request-blood",
  component: RequestBloodPage,
});

const manageRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/manage-requests",
  component: ManageRequestsPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => null,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminLoginRoute,
  userLoginRoute,
  registerRoute,
  adminDashboardRoute,
  userDashboardRoute,
  donorsRoute,
  bloodStockRoute,
  requestBloodRoute,
  manageRequestsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
