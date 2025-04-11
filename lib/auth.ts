// Simple authentication system
const ADMIN_USERNAME = "Admin"
const ADMIN_PASSWORD = "12345"

export async function getSession() {
  // This is a mock session that will be used for development
  return {
    user: {
      name: ADMIN_USERNAME,
      email: "admin@example.com",
      image: null
    }
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

export function validateCredentials(username: string, password: string) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}
