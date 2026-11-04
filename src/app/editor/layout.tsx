import { StudioAccess } from "@/features/auth/components/studio-access";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <StudioAccess destination="editor">{children}</StudioAccess>;
}
