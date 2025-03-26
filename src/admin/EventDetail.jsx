import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch event details from backend
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin/events/${id}`,
          {
            credentials: "include", // Include cookies for authentication
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await response.json();
        if (data.success) {
          setEvent(data.event);
        } else {
          throw new Error(data.message || "Event not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleNavigateToEvents = () => {
    navigate("/admin/events");
  };

  if (loading) {
    return <div className="content-area">Loading event details...</div>;
  }

  if (error) {
    return (
      <div className="content-area">
        <p className="text-red-500">{error}</p>
        <button
          onClick={handleNavigateToEvents}
          className="mt-4 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          <FaArrowLeft className="mr-2" />
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="content-area">
        <p>Event not found.</p>
        <button
          onClick={handleNavigateToEvents}
          className="mt-4 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          <FaArrowLeft className="mr-2" />
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="content-area">
      <button
        onClick={handleNavigateToEvents}
        className="flex items-center text-gray-600 dark:text-gray-300 mb-6 hover:text-gray-800 dark:hover:text-white"
      >
        <FaArrowLeft className="mr-2" />
        Back to Events
      </button>

      <div className="space-y-6">
        <div className="card">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            {event.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Event Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Start Date
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    End Date
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Location
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {event.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Sports Category
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {event.sportsCategory}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Organizer
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {event.organizer}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Contact
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {event.contact}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {event.description}
              </p>

              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Rules
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {event.rules.split("\n").map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>

              <h2 className="text-lg font-semibold mt-6 mb-4 text-gray-800 dark:text-white">
                Prizes
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {event.prizes.split("\n").map((prize, index) => (
                  <li key={index}>{prize}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Participants
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                    Mobile
                  </th>
                  <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {event.participants.map((participant, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                      {participant.fullname}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                      {participant.mobile_number}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                      {participant.email}
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

export default EventDetail;