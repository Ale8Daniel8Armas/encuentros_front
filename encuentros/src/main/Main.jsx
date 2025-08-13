import MainHeader from '../components/MainHeader.jsx'
import EventList from '../components/EventList.jsx'
// import NotificationBell from '../components/NotificationBell.jsx' // desactivado: backend no tiene notifs

export default function Main() {
  return (
    <div className="space-y-10">
      <div className="container mx-auto px-4">
      </div>
      <MainHeader />
      <div className="container mx-auto px-4">
        <EventList />
      </div>
    </div>
  )
}
