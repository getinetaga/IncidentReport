import { sendReport } from './api';

export async function sendGuardianAlert(payload){
  // Prepare a guardian-specific payload; server should route to guardians/authorities
  const body = { ...payload, guardianAlert: true };
  // If API_URL not set, sendReport resolves immediately (no-op)
  return sendReport(body);
}
