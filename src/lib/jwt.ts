export function decodeJwtPermissions(token: string): string[] {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const raw = payload['permission'];
    if (!raw) return [];
    return Array.isArray(raw) ? raw : [raw];
  } catch {
    return [];
  }
}
