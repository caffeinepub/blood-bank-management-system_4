import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
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

// Root route component — renders correct page based on auth state and route
function RootComponent() {
  const { isAuthenticated } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Always allow access to login pages regardless of auth state
  if (currentPath === "/admin-login") return <AdminLoginPage />;
  if (currentPath === "/user-login") return <UserLoginPage />;
  if (currentPath === "/login") return <LandingPage />;

  // If not authenticated, show landing page for all other routes
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Authenticated users get the full app layout with nested routes
  return <AppLayout />;
}

// Root route
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
