/**
 * Login page that triggers Internet Identity authentication and redirects based on user role.
 */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Droplet, Loader2 } from "lucide-react";
import { useAuth } from "../features/auth/useAuth";

export default function LoginPage() {
  const { login, loginStatus } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Droplet className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Blood Bank Management</CardTitle>
          <CardDescription>
            Sign in with Internet Identity to access the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in with Internet Identity"
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            New users will be prompted to create a profile after signing in
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
