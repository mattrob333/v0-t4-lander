// Airtable integration constants
export const AIRTABLE_CONFIG = {
  BASE_ID: 'app8tJ3iERQFTdSSv',
  LEADS_TABLE_ID: 'tblqX6s9mj0TB4Scl'
} as const

export interface LeadData {
  name: string
  email: string
  company: string
  notes: string
  source: string
}

// This will be used by the server action to create records via MCP
export function formatLeadForAirtable(leadData: LeadData) {
  return {
    'Full Name': leadData.name,
    'Work Email': leadData.email,
    'Company': leadData.company,
    'Notes': leadData.notes,
    'Source': leadData.source,
    'Submission Date': new Date().toISOString(),
    'Lead Status': 'New'
  }
}