"use server"

import { AIRTABLE_CONFIG, formatLeadForAirtable, type LeadData } from "@/lib/airtable"

export type LeadState = { ok: boolean; error?: string }

async function createAirtableRecord(leadData: LeadData) {
  try {
    const formattedData = formatLeadForAirtable(leadData)
    
    // Get Airtable token from environment
    const airtableToken = process.env.AIRTABLE_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY
    
    if (!airtableToken) {
      console.error('Airtable API token not found in environment variables')
      throw new Error('Airtable configuration error')
    }
    
    // Make direct API call to Airtable
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.LEADS_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${airtableToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: formattedData
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      console.error('Airtable API error:', error)
      throw new Error(`Airtable API error: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('Successfully created Airtable record:', result.id)
    
    return { success: true, recordId: result.id }
  } catch (error) {
    console.error('Failed to create Airtable record:', error)
    throw error
  }
}

export async function submitLead(
  prevState: LeadState | undefined,
  formData: FormData
): Promise<LeadState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const company = String(formData.get("company") ?? "").trim()
  const notes = String(formData.get("notes") ?? "").trim()

  if (!name || !email || !company) {
    return { ok: false, error: "Please fill in name, work email, and company." }
  }

  try {
    // Send data to Airtable
    await createAirtableRecord({
      name,
      email,
      company,
      notes,
      source: "Contact Form"
    })

    // Server-side logging
    console.log("New lead submitted:", { name, email, company, notes })

    return { ok: true }
  } catch (error) {
    console.error("Failed to submit lead:", error)
    return { ok: false, error: "Failed to submit form. Please try again." }
  }
}
