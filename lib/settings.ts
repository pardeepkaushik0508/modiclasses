import { prisma } from "@/lib/prisma";

export interface GroupSettings {
  telegramLink: string;
  telegramName: string;
  telegramDescription: string;
  whatsappLink: string;
  whatsappName: string;
  whatsappDescription: string;
  mentorshipLink: string;
  mentorshipName: string;
  mentorshipDescription: string;
}

export const DEFAULT_GROUP_SETTINGS: GroupSettings = {
  telegramLink: "https://t.me/five_education_rdso",
  telegramName: "RRB ALP & Technician Psycho CBT 2026 Batch",
  telegramDescription:
    "Daily memory charts, doubt clearing, peer discussion & official RRB psycho updates directly on Telegram.",
  whatsappLink: "https://chat.whatsapp.com/invite/FiveEducationRDSO",
  whatsappName: "Station Master (SM) Psycho Cutoff Target 42.0+ Club",
  whatsappDescription:
    "High-focus group for Station Master aspirants targeting 42+ T-Score in every battery with daily peer quizzes.",
  mentorshipLink: "https://t.me/+FiveEducationExclusiveMentors",
  mentorshipName: "Five Education Close Group (Exclusive Mentorship)",
  mentorshipDescription:
    "Direct 1-on-1 faculty assistance with Ex-RDSO mentors, individualized scorecards, and live strategy audio rooms.",
};

export async function getGroupSettings(): Promise<GroupSettings> {
  try {
    const rows = await prisma.$queryRaw<Array<{ key: string; value: string }>>`
      SELECT key, value FROM site_settings 
      WHERE key LIKE 'group_%'
    `;

    const map = new Map<string, string>();
    for (const r of rows) {
      map.set(r.key, r.value);
    }

    return {
      telegramLink: map.get("group_telegram_link") || DEFAULT_GROUP_SETTINGS.telegramLink,
      telegramName: map.get("group_telegram_name") || DEFAULT_GROUP_SETTINGS.telegramName,
      telegramDescription:
        map.get("group_telegram_desc") || DEFAULT_GROUP_SETTINGS.telegramDescription,

      whatsappLink: map.get("group_whatsapp_link") || DEFAULT_GROUP_SETTINGS.whatsappLink,
      whatsappName: map.get("group_whatsapp_name") || DEFAULT_GROUP_SETTINGS.whatsappName,
      whatsappDescription:
        map.get("group_whatsapp_desc") || DEFAULT_GROUP_SETTINGS.whatsappDescription,

      mentorshipLink: map.get("group_mentorship_link") || DEFAULT_GROUP_SETTINGS.mentorshipLink,
      mentorshipName: map.get("group_mentorship_name") || DEFAULT_GROUP_SETTINGS.mentorshipName,
      mentorshipDescription:
        map.get("group_mentorship_desc") || DEFAULT_GROUP_SETTINGS.mentorshipDescription,
    };
  } catch (err) {
    console.error("Failed to load group settings from DB, using defaults:", err);
    return DEFAULT_GROUP_SETTINGS;
  }
}

export async function saveGroupSettings(settings: Partial<GroupSettings>): Promise<boolean> {
  try {
    const entries: [string, string | undefined][] = [
      ["group_telegram_link", settings.telegramLink],
      ["group_telegram_name", settings.telegramName],
      ["group_telegram_desc", settings.telegramDescription],
      ["group_whatsapp_link", settings.whatsappLink],
      ["group_whatsapp_name", settings.whatsappName],
      ["group_whatsapp_desc", settings.whatsappDescription],
      ["group_mentorship_link", settings.mentorshipLink],
      ["group_mentorship_name", settings.mentorshipName],
      ["group_mentorship_desc", settings.mentorshipDescription],
    ];

    for (const [key, value] of entries) {
      if (value !== undefined) {
        await prisma.$executeRaw`
          INSERT INTO site_settings (key, value, "updatedAt")
          VALUES (${key}, ${value}, NOW())
          ON CONFLICT (key) DO UPDATE
          SET value = ${value}, "updatedAt" = NOW()
        `;
      }
    }

    return true;
  } catch (err) {
    console.error("Failed to save group settings:", err);
    return false;
  }
}
