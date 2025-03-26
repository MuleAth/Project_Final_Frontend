import { FaUsers, FaCalendarAlt, FaDumbbell, FaComments } from 'react-icons/fa'

function Dashboard() {
  const stats = {
    users: 156,
    equipments: 45,
    liveEvents: 3,
    feedbacks: 89
  }

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-2xl text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="content-area">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FaUsers}
          title="Total Users"
          value={stats.users}
          color="bg-blue-500"
        />
        <StatCard
          icon={FaDumbbell}
          title="Total Equipment"
          value={stats.equipments}
          color="bg-green-500"
        />
        <StatCard
          icon={FaCalendarAlt}
          title="Live Events"
          value={stats.liveEvents}
          color="bg-purple-500"
        />
        <StatCard
          icon={FaComments}
          title="Total Feedback"
          value={stats.feedbacks}
          color="bg-yellow-500"
        />
      </div>
    </div>
  )
}

export default Dashboard