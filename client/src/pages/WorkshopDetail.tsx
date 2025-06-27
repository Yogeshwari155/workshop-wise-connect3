import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, IndianRupee, Users, Clock, Star, User, Building } from 'lucide-react';

const WorkshopDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  // Mock workshop data - in real app, this would come from API
  const workshopData = {
    id: 1,
    title: "Advanced React Development",
    company: "TechCorp Solutions",
    price: 2500,
    originalPrice: 3500,
    mode: "Online",
    duration: "3 days",
    seats: 25,
    bookedSeats: 18,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    tags: ["React", "JavaScript", "Frontend"],
    isFree: false,
    date: "15 Jan 2025",
    time: "10:00 AM - 6:00 PM",
    registrationDeadline: "10 Jan 2025",
    instructor: {
      name: "Rahul Sharma",
      designation: "Senior React Developer",
      company: "TechCorp Solutions",
      experience: "8+ years",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    description: `Join us for an intensive 3-day workshop on Advanced React Development. This hands-on session will cover modern React patterns, performance optimization, and best practices used in production applications.

    What you'll learn:
    • Advanced React Hooks and Custom Hooks
    • State Management with Context API and Redux Toolkit
    • Performance Optimization Techniques
    • Testing React Applications
    • Deployment Strategies

    Prerequisites:
    • Basic knowledge of React and JavaScript
    • Familiarity with ES6+ features
    • Understanding of HTML/CSS

    Materials Provided:
    • Access to recorded sessions
    • Code repository with examples
    • Certificate of completion
    • 1-month mentorship support`,
    agenda: [
      { day: "Day 1", topic: "Advanced Hooks & Patterns", duration: "8 hours" },
      { day: "Day 2", topic: "State Management & Performance", duration: "8 hours" },
      { day: "Day 3", topic: "Testing & Deployment", duration: "8 hours" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workshop Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img 
              src={workshopData.image} 
              alt={workshopData.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute top-6 left-6 flex gap-2">
              {workshopData.isFree ? (
                <Badge className="bg-green-500 text-white border-0 text-lg px-4 py-2">FREE</Badge>
              ) : (
                <Badge className="bg-primary-500 text-white border-0 text-lg px-4 py-2">PAID</Badge>
              )}
              <Badge variant="secondary" className="bg-white/90 text-gray-700 text-lg px-4 py-2">
                {workshopData.mode}
              </Badge>
            </div>
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-lg font-semibold">{workshopData.rating}</span>
                <span className="text-gray-600">({workshopData.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                    {workshopData.title}
                  </h1>
                  <p className="text-xl text-gray-600 font-medium">{workshopData.company}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {workshopData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{new Date(workshopData.date).toLocaleDateString('en-US', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}</div>
                      <div>{workshopData.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{workshopData.duration}</div>
                      <div>Duration</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{workshopData.seats - workshopData.registeredSeats} left</span>
                  </div>
                  <div>of {workshopData.seats} seats</div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Deadline</div>
                      <div>{workshopData.registrationDeadline}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Card */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-xl">
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      {workshopData.isFree ? (
                        <div className="text-3xl font-bold text-green-600">FREE</div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-center space-x-1">
                            <IndianRupee className="h-6 w-6 text-gray-900" />
                            <span className="text-3xl font-bold text-gray-900">{workshopData.price}</span>
                          </div>
                          {workshopData.originalPrice && (
                            <div className="text-lg text-gray-500 line-through">₹{workshopData.originalPrice}</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Seats Available</span>
                        <span className="font-medium">{workshopData.seats - workshopData.bookedSeats} of {workshopData.seats}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full" 
                          style={{ width: `${(workshopData.bookedSeats / workshopData.seats) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {isAuthenticated ? (
                      <Link to={`/workshop/${workshopData.id}/register`} className="block">
                        <Button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#7C3AED] hover:from-[#6D28D9] hover:to-[#6D28D9] text-white py-3 text-lg font-semibold">
                          Register Now
                        </Button>
                      </Link>
                    ) : (
                      <div className="space-y-3">
                        <Link to="/login" className="block">
                          <Button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#7C3AED] hover:from-[#6D28D9] hover:to-[#6D28D9] text-white py-3 text-lg font-semibold">
                            Login to Register
                          </Button>
                        </Link>
                        <p className="text-center text-sm text-gray-600">
                          New to WorkshopWise?{' '}
                          <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                            Create account
                          </Link>
                        </p>
                      </div>
                    )}

                    <div className="text-center text-xs text-gray-500 pt-2 border-t">
                      Registration closes on {workshopData.registrationDeadline}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                  About This Workshop
                </h2>
                <div className="prose prose-gray max-w-none">
                  {workshopData.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Agenda */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  Workshop Agenda
                </h2>
                <div className="space-y-4">
                  {workshopData.agenda.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.day}</h3>
                        <p className="text-gray-600">{item.topic}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructor */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
                  Your Instructor
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={workshopData.instructor.avatar} 
                      alt={workshopData.instructor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{workshopData.instructor.name}</h3>
                      <p className="text-gray-600 text-sm">{workshopData.instructor.designation}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{workshopData.instructor.company}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{workshopData.instructor.experience} experience</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WorkshopDetail;