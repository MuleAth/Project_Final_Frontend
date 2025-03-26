import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function UserDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data
  const user = {
    id: parseInt(id),
    name: "John Doe",
    email: "john@example.com",
    sport: "Basketball",
    joinDate: "2024-01-15",
    phone: "+91 2345678900",
    address: "123 Sports Street, Athletic City",
    emergencyContact: "Jane Doe (+91 2345678901)",
    membership: "Premium",
    attendance: "85%",
    achievements: [
      "First place in Inter-college Basketball 2023",
      "Best Player Award - Summer Tournament 2023",
    ],
    upcomingEvents: [
      "Basketball Championship - March 2024",
      "Fitness Workshop - April 2024",
    ],
    equipmentBorrowed: [
      { item: "Basketball", dueDate: "2024-03-20" },
      { item: "Training Kit", dueDate: "2024-03-25" },
    ],
  };
  const handleNavigateToUsers = () => {
    navigate("/admin/users");
  };
  return (
    <div className="content-area">
      <button
        onClick={handleNavigateToUsers}
        className="flex items-center text-gray-600 dark:text-gray-300 mb-6 hover:text-gray-800 dark:hover:text-white"
      >
        <FaArrowLeft className="mr-2" />
        Back to Users
      </button>

      <div className="space-y-6">
        <div className="card">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            User Profile
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Name
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Address
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.address}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Emergency Contact
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.emergencyContact}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Sports Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Sport Interest
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.sport}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Profile Creation Date :
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Achievements
            </h2>
            <ul className="space-y-2">
              {user.achievements.map((achievement, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  • {achievement}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Upcoming Events
            </h2>
            <ul className="space-y-2">
              {user.upcomingEvents.map((event, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  • {event}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Equipment Borrowed
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                    Item
                  </th>
                  <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {user.equipmentBorrowed.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                      {item.item}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                      {new Date(item.dueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
