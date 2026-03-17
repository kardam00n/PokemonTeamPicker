"use server";

import { saveTeamToFile, loadTeamFromFile } from "@/lib/server-storage";

/**
 * Server Action to save the team IDs to a file.
 */
export async function saveTeamAction(ids: number[]) {
  try {
    // Input validation
    if (!Array.isArray(ids)) {
      return { success: false, error: "Invalid input: expected an array" };
    }
    if (ids.length > 6) {
      return { success: false, error: "Invalid input: team size cannot exceed 6" };
    }
    if (!ids.every((id) => typeof id === "number")) {
      return { success: false, error: "Invalid input: all IDs must be numbers" };
    }

    await saveTeamToFile(ids);
    return { success: true };
  } catch (error) {
    console.error("Action failed: saveTeamAction", error);
    return { success: false, error: "Failed to save team" };
  }
}

/**
 * Server Action to retrieve the team IDs from a file.
 */
export async function getTeamAction() {
  try {
    const ids = await loadTeamFromFile();
    return { success: true, ids };
  } catch (error) {
    console.error("Action failed: getTeamAction", error);
    return { success: false, error: "Failed to load team", ids: [] };
  }
}
