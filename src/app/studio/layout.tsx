import { StudioAccess } from "@/features/auth/components/studio-access";
import "./studio.css";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <StudioAccess>{children}</StudioAccess>;
}
