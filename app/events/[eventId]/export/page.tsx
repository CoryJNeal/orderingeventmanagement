import { EventExportPage } from "@/components/event-export-page";

export default async function EventExportRoute({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <EventExportPage eventId={eventId} />;
}
