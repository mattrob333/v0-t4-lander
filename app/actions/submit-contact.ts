"use server"

import { submitLead, type LeadState } from "./submit-lead"

export type { LeadState } from "./submit-lead"

export async function submitContact(
  prevState: LeadState | undefined,
  formData: FormData
): Promise<LeadState> {
  // Extract first and last name and combine them
  const firstName = String(formData.get("firstName") ?? "").trim()
  const lastName = String(formData.get("lastName") ?? "").trim()
  const fullName = `${firstName} ${lastName}`.trim()
  
  // Create new FormData with the expected structure for submitLead
  const leadFormData = new FormData()
  leadFormData.append("name", fullName)
  leadFormData.append("email", String(formData.get("email") ?? "").trim())
  leadFormData.append("company", String(formData.get("company") ?? "").trim())
  leadFormData.append("phone", String(formData.get("phone") ?? "").trim())
  leadFormData.append("notes", String(formData.get("notes") ?? "").trim())
  leadFormData.append("source", "Contact Form")
  
  // Call the existing submitLead action
  return submitLead(prevState, leadFormData)
}