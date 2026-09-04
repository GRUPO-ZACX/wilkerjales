export const ADMIN_DASHBOARD_PATH = "/dashboard/informativos"
export const ADMIN_LOGIN_PATH = "/acesso-wilker"

export function getSafeDashboardRedirect(value: string | null | undefined) {
  if (value?.startsWith("/dashboard")) {
    return value
  }

  return ADMIN_DASHBOARD_PATH
}
