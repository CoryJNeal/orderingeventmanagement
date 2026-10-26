import { EventRosterPage } from "@/components/event-roster-page";

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <EventRosterPage eventId={eventId} />;
}
