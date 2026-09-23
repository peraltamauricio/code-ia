// Supabase Auth needs an email under the hood; the workshop's real
// login is by nickname, so we map nickname -> a fake, never-emailed
// address. Safe to import from client or server code (no secrets).
export const FAKE_EMAIL_DOMAIN = "codeia.com";

export const nicknameToEmail = (nickname: string) =>
  `${nickname.trim().toLowerCase()}@${FAKE_EMAIL_DOMAIN}`;
