import MissionTracker from './MissionTracker';

export default async function MissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MissionTracker missionId={id} />;
}
