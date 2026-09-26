import { getGroupSettings } from "@/lib/settings";
import SettingsClient from "./settings-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Community & Group Settings | Admin Console - Five Education",
  description: "Configure dynamic mentorship, Telegram, and WhatsApp community links.",
};

export default async function AdminSettingsPage() {
  const settings = await getGroupSettings();

  return <SettingsClient initialSettings={settings} />;
}
