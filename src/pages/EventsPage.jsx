import React, { useEffect, useState, useRef } from "react";
import { Calendar, MapPin, Clock, Filter, Search, Tag, ChevronDown, ChevronUp, X, Loader, Star, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Sports categories with icons
const sportCategories = [
  { name: "All Sports", icon: Trophy },
  { name: "Cricket", icon: Trophy },
  { name: "Football", icon: Trophy },
  { name: "Basketball", icon: Trophy },
  { name: "Swimming", icon: Trophy },
  { name: "Athletics", icon: Trophy },
  { name: "Badminton", icon: Trophy },
];

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All Sports");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [highlightedEvent, setHighlightedEvent] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Ref for the filter section
  const filterRef = useRef(null);

  // Enhanced images array with more variety
  const images = [
    "https://tiemdelhi.com/blogs/wp-content/uploads/2023/03/sports-1024x683.jpg",
    "https://img.freepik.com/free-vector/gradient-national-sports-day-illustration_23-2148995776.jpg",
    "https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg",
    "https://img.freepik.com/free-photo/top-view-various-sport-equipment_23-2148301728.jpg",
    "https://img.freepik.com/free-photo/top-view-ping-pong-ball-with-copy-space_23-2148796139.jpg",
  ];

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/user/getevent");
        const data = await response.json();

        if (data.success) {
          // Add a small delay to show loading animation
          setTimeout(() => {
            setEvents(
              data.events.map((event) => {
                const applyLastDate = new Date(event.applyLastDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Extract date objects for sorting
                const startDate = new Date(event.startDate);

                // Randomly assign a category for demo purposes
                const randomCategory = sportCategories[Math.floor(Math.random() * sportCategories.length)].name;

                // Random popularity metrics for demo
                const popularity = Math.floor(Math.random() * 100);
                const participantCount = Math.floor(Math.random() * 200) + 10;

                return {
                  id: event._id,
                  title: event.title,
                  description: event.description,
                  date: `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`,
                  startDate: startDate,
                  registrationDeadline: applyLastDate.toLocaleDateString(),
                  deadlineDate: applyLastDate,
                  location: event.location,
                  image: images[Math.floor(Math.random() * images.length)],
                  status: applyLastDate >= today ? "Available" : "Closed",
                  category: randomCategory,
                  popularity: popularity,
                  participantCount: participantCount,
                  featured: popularity > 80, // Mark high popularity events as featured
                };
              })
            );
            setIsLoading(false);
          }, 800);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle click outside of filter section to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter and sort events
  const getFilteredAndSortedEvents = () => {
    // First apply filters
    let result = events.filter((event) => {
      // Status filter
      const statusMatch = selectedStatus === "All" || event.status === selectedStatus;

      // Category filter
      const categoryMatch = selectedCategory === "All Sports" || event.category === selectedCategory;

      // Search term filter
      const searchMatch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && categoryMatch && searchMatch;
    });

    // Then sort the filtered results
    switch (sortBy) {
      case "date":
        result = result.sort((a, b) => a.startDate - b.startDate);
        break;
      case "deadline":
        result = result.sort((a, b) => a.deadlineDate - b.deadlineDate);
        break;
      case "popularity":
        result = result.sort((a, b) => b.popularity - a.popularity);
        break;
      case "title":
        result = result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  };

  const filteredEvents = getFilteredAndSortedEvents();

  // Find a featured event for the hero section
  const featuredEvent = events.find(event => event.featured && event.status === "Available") ||
                        (events.length > 0 ? events[0] : null);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All");
    setSelectedCategory("All Sports");
    setSortBy("date");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section with Featured Event */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Discover Amazing Sports Events
                </h1>
                <p className="text-xl text-indigo-200 mb-8">
                  Find and register for the best sporting events at Sinhgad College
                </p>

                {/* Search Bar */}
                <div className={`relative transition-all duration-300 ${
                  isSearchFocused ? "scale-105" : ""
                }`}>
                  <input
                    type="text"
                    placeholder="Search for events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full py-4 px-6 pl-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-indigo-200"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-300" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-300 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            {featuredEvent && (
              <div className="order-1 md:order-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative rounded-xl overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center mb-2">
                      <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wider mr-2">
                        Featured
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wider ${
                        featuredEvent.status === "Available" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                      }`}>
                        {featuredEvent.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{featuredEvent.title}</h3>
                    <div className="flex items-center text-indigo-200 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm mr-4">{featuredEvent.date}</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{featuredEvent.location}</span>
                    </div>
                    <Link
                      to={`/events/${featuredEvent.id}`}
                      className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Controls */}
        <div className="mb-8" ref={filterRef}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-900 mr-4">Events</h2>
              <div className="flex items-center text-gray-500 text-sm">
                <span className="mr-1">{filteredEvents.length}</span>
                <span>{filteredEvents.length === 1 ? 'event' : 'events'} found</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* View Mode Toggle */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 rounded ${
                    viewMode === "grid"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 rounded ${
                    viewMode === "list"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  List
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700"
              >
                <Filter size={16} />
                <span>Filters</span>
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="deadline">Sort by Deadline</option>
                  <option value="popularity">Sort by Popularity</option>
                  <option value="title">Sort by Title</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <div className="flex flex-wrap gap-2">
                        {["All", "Available", "Closed"].map((status) => (
                          <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-full text-sm ${
                              selectedStatus === status
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {sportCategories.slice(0, 4).map(({ name }) => (
                          <button
                            key={name}
                            onClick={() => setSelectedCategory(name)}
                            className={`px-4 py-2 rounded-full text-sm ${
                              selectedCategory === name
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {name}
                          </button>
                        ))}
                        <div className="relative group">
                          <button className="px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                            More...
                          </button>
                          <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 hidden group-hover:block z-10">
                            {sportCategories.slice(4).map(({ name }) => (
                              <button
                                key={name}
                                onClick={() => setSelectedCategory(name)}
                                className={`block w-full text-left px-4 py-2 rounded text-sm ${
                                  selectedCategory === name
                                    ? "bg-indigo-100 text-indigo-700"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm flex items-center gap-2"
                      >
                        <X size={16} />
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Display */}
          {(selectedStatus !== "All" || selectedCategory !== "All Sports" || searchTerm) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-gray-500">Active filters:</span>

              {selectedStatus !== "All" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                  Status: {selectedStatus}
                  <button
                    onClick={() => setSelectedStatus("All")}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              {selectedCategory !== "All Sports" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All Sports")}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      onMouseEnter={() => setHighlightedEvent(event.id)}
                      onMouseLeave={() => setHighlightedEvent(null)}
                      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        {/* Category Tag */}
                        <span className="absolute top-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-sm text-indigo-800 rounded-full text-xs font-medium">
                          {event.category}
                        </span>

                        {/* Status Tag */}
                        <span
                          className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                            event.status === "Available"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>Deadline: {event.registrationDeadline}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>{event.participantCount} participants</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className={`h-5 w-5 ${event.popularity > 80 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                            <span className="ml-1 text-sm text-gray-600">{event.popularity}% popularity</span>
                          </div>
                          <Link
                            to={`/events/${event.id}`}
                            className={`px-4 py-2 rounded-lg font-semibold text-center ${
                              highlightedEvent === event.id
                                ? "bg-indigo-700 text-white"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            } transition-all duration-300`}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto relative">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />

                          {/* Status Tag */}
                          <span
                            className={`absolute bottom-4 left-4 md:top-4 px-3 py-1 rounded-full text-sm font-semibold ${
                              event.status === "Available"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>

                        <div className="p-6 md:w-3/4 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                                {event.category}
                              </span>
                              {event.popularity > 80 && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
                                  <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                                  Popular
                                </span>
                              )}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {event.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {event.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                              <span>Deadline: {event.registrationDeadline}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Users className="h-5 w-5 mr-2 text-indigo-500" />
                              <span>{event.participantCount} participants</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-600"
                                  style={{ width: `${event.popularity}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm text-gray-600">{event.popularity}% popularity</span>
                            </div>
                            <Link
                              to={`/events/${event.id}`}
                              className="px-6 py-2 rounded-lg font-semibold text-center bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* No Results Message */}
            {filteredEvents.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="bg-indigo-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


export default EventsPage;
