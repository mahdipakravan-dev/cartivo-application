const COOKIE_NAME = "cartivo_access_token";

export function getAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));
  return cookie ? decodeURIComponent(cookie.slice(COOKIE_NAME.length + 1)) : null;
}

export function setAccessToken(token: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=604800; SameSite=Strict${secure}`;
  window.dispatchEvent(new Event("cartivo-auth-change"));
}

export function clearAccessToken(): void {
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Strict`;
  window.dispatchEvent(new Event("cartivo-auth-change"));
}
