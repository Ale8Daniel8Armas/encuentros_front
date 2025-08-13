import { ENDPOINTS } from '../../../../config/api'

//RUTA PARA GESTIONAR USUARIOS
export async function listUsers(authFetch) {
  const res = await authFetch(ENDPOINTS.users)
  if (!res.ok) throw new Error('users_list_error')
  return await res.json()
}

export async function createUser(authFetch, payload) {
  const res = await authFetch(ENDPOINTS.users, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('users_create_error')
  return await res.json()
}
