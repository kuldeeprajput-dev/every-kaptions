import { EditorProjectPage } from "@/features/editor/components/editor-project-page";

export default async function MediaEditorPage({
  params,
}: {
  params: Promise<{ mediaId: string }>;
}) {
  const { mediaId } = await params;
  return <EditorProjectPage mediaId={mediaId} />;
}
