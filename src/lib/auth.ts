export const AUTH_COOKIE_NAME = "auth_session";

export function setAuthSession() {
    // In a real app, this would be a JWT or session ID
    document.cookie = `${AUTH_COOKIE_NAME}=true; path=/; max-age=86400; SameSite=Lax`;
}

export function clearAuthSession() {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function isAuthenticated() {
    if (typeof document === "undefined") return false;
    return document.cookie.includes(`${AUTH_COOKIE_NAME}=true`);
}
