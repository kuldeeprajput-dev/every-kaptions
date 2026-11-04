import { StudioSetupPage } from "@/features/editor/components/studio-setup-page";

export default async function ProjectSetupPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <StudioSetupPage key={projectId} projectId={projectId} />;
}
