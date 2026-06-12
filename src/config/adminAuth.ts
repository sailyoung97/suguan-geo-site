export const adminAuthStorageKey = "suguan.admin.auth.v1";
export const adminAuthCookieName = adminAuthStorageKey;

export const adminAuthConfig = {
  username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || "suguan",
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Suguan@2026"
};
