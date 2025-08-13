import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { ENDPOINTS } from '../config/api'

export default function NotificationBell(){
  const [count,setCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    const fetchOnce = async () => {
      try {
        const res = await fetch(ENDPOINTS.notifications.list)
        if (!res.ok) return // ignora 404/500 sin ruido
        const data = await res.json()
        if (!cancelled) setCount(data?.unread ?? data?.length ?? 0)
      } catch {/* silencio */}
    }
    const id = setInterval(fetchOnce, 8000)
    fetchOnce()
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  return (
    <div className="relative">
      <Bell />
      {count>0 && (
        <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1">
          {count}
        </span>
      )}
    </div>
  )
}
