import { AuthGuard } from "@/components/auth-guard";
import { HomeDashboard } from "@/components/home-dashboard";

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeDashboard />
    </AuthGuard>
  );
}
