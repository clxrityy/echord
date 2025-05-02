export function parseUsername(username: string): string {
  // Remove any leading or trailing whitespace
  username = username.trim();

  // Convert to lowercase
  username = username.toLowerCase();

  // Replace spaces with underscores
  username = username.replace(/\s+/g, '_');

  // Remove any special characters except for underscores and hyphens
  username = username.replace(/[^a-z0-9_]/g, '');

  return username;
}
