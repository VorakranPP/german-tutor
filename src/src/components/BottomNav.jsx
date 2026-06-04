import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',        icon: '📚', label: 'คำศัพท์' },
  { to: '/grammar', icon: '✏️', label: 'ไวยากรณ์' },
  { to: '/reading', icon: '📖', label: 'อ่าน' },
  { to: '/speaking',icon: '🎤', label: 'ฝึกพูด' },
  { to: '/diary',   icon: '📝', label: 'ไดอารี่' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
      {tabs.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors ${
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-400'
            }`
          }
        >
          <span className="text-xl">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
