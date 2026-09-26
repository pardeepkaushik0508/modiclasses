"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveGroupSettings, GroupSettings } from "@/lib/settings";
import { revalidatePath } from "next/cache";

export async function updateGroupSettingsAction(
  data: Partial<GroupSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized access: Admin only" };
    }

    const ok = await saveGroupSettings(data);
    if (!ok) {
      return { success: false, error: "Failed to save group settings in database." };
    }

    try {
      revalidatePath("/groups");
      revalidatePath("/admin/settings");
      revalidatePath("/");
    } catch {
      // Best effort revalidation
    }

    return { success: true };
  } catch (err: any) {
    console.error("updateGroupSettingsAction error:", err);
    return { success: false, error: err.message || "Failed to update group settings." };
  }
}
