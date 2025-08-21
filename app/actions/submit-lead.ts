"use server"

export type LeadState = { ok: boolean; error?: string }

export async function submitLead(
  prevState: LeadState | undefined,
  formData: FormData
): Promise<LeadState> {
  // Simulate I/O or CRM write
  await new Promise((r) => setTimeout(r, 600))

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const company = String(formData.get("company") ?? "").trim()
  const notes = String(formData.get("notes") ?? "").trim()

  if (!name || !email || !company) {
    return { ok: false, error: "Please fill in name, work email, and company." }
  }

  // Server-side logging (replace with CRM/DB integration)
  // eslint-disable-next-line no-console
  console.log("New lead:", { name, email, company, notes })

  return { ok: true }
}
