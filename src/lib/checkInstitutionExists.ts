const INSTITUTION_API_URL = process.env.INSTITUTION_API_URL ?? 'http://localhost:5252';

type InstitutionExistsResponse = {
  success: boolean;
  data: boolean;
};

export async function checkInstitutionExists(alias: string): Promise<boolean> {
  try {
    const res = await fetch(`${INSTITUTION_API_URL}/api/institution/${alias}/exists`, {
      cache: 'no-store',
    });

    if (!res.ok) return false;

    const body: InstitutionExistsResponse = await res.json();
    return body.success && body.data === true;
  } catch {
    return false;
  }
}
