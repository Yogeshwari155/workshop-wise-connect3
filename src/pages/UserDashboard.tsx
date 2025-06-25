
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ProfileManagement from '../components/ProfileManagement';
import EnterpriseDashboard from '../components/EnterpriseDashboard';
import WorkshopRegistrationModal from '../components/WorkshopRegistrationModal';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Calendar, Clock, MapPin, User, Star, Building, ExternalLink, Users, Plus } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Mock available workshops for registration
  const availableWorkshops = [
    {
      id: 4,
      title: "Python for Beginners",
      company: "CodeAcademy",
      date: "25 Jan 2025",
      time: "11:00 AM",
      mode: "Online",
      price: 0,
      seats: 30,
      registeredSeats: 15,
      registrationMode: "automated",
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=200&fit=crop"
    },
    {
      id: 5,
      title: "UI/UX Design Workshop",
      company: "Design Studio",
      date: "30 Jan 2025",
      time: "2:00 PM",
      mode: "Hybrid",
      location: "Mumbai",
      price: 1500,
      seats: 20,
      registeredSeats: 8,
      registrationMode: "manual",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop"
    }
  ];

  // If user is enterprise, show enterprise dashboard
  if (user?.role === 'enterprise') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Enterprise Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <EnterpriseDashboard />
            </TabsContent>

            <TabsContent value="profile">
              <ProfileManagement />
            </TabsContent>
          </Tabs>
        </div>

        <Footer />
      </div>
    );
  }

  // Enhanced registered workshops with meet links and status
  const registeredWorkshops = [
    {
      id: 1,
      title: "Advanced React Development",
      company: "TechCorp Solutions",
      date: "15 Jan 2025",
      time: "10:00 AM",
      mode: "Online",
      status: "confirmed",
      meetLink: "https://meet.google.com/abc-defg-hij",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Digital Marketing Masterclass",
      company: "Growth Academy",
      date: "20 Jan 2025",
      time: "2:00 PM",
      mode: "Hybrid",
      status: "pending",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      company: "DataMinds Inc",
      date: "10 Jan 2025",
      time: "9:00 AM",
      mode: "Offline",
      location: "Bangalore",
      status: "completed",
      rating: 5,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop"
    }
  ];

  const handleWorkshopRegistration = (workshopId: number, registrationData: any) => {
    console.log('Registration data:', registrationData);
    // In real app, this would call an API
    setShowRegistrationModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending Approval</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500 text-white">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your workshops and track your learning progress
          </p>
        </div>

        <Tabs defaultValue="my-workshops" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="my-workshops" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>My Workshops</span>
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Available</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-workshops" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {registeredWorkshops.length}
                  </div>
                  <div className="text-gray-600">Total Workshops</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {registeredWorkshops.filter(w => w.status === 'confirmed').length}
                  </div>
                  <div className="text-gray-600">Confirmed</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {registeredWorkshops.filter(w => w.status === 'pending').length}
                  </div>
                  <div className="text-gray-600">Pending</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {registeredWorkshops.filter(w => w.status === 'completed').length}
                  </div>
                  <div className="text-gray-600">Completed</div>
                </CardContent>
              </Card>
            </div>

            {/* Registered Workshop List */}
            <div className="space-y-4">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Your Registered Workshops
              </h2>

              {registeredWorkshops.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No workshops registered yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start your learning journey by registering for your first workshop
                    </p>
                    <Link to="/workshops">
                      <Button className="bg-gradient-to-r from-primary-500 to-accent-500">
                        Explore Workshops
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {registeredWorkshops.map((workshop) => (
                    <Card key={workshop.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex">
                          <img 
                            src={workshop.image} 
                            alt={workshop.title}
                            className="w-24 h-24 object-cover rounded-l-lg"
                          />
                          <div className="flex-1 p-4 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900">{workshop.title}</h3>
                                <p className="text-sm text-gray-600">{workshop.company}</p>
                              </div>
                              {getStatusBadge(workshop.status)}
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{workshop.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{workshop.time}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm">
                                <Badge variant="secondary">{workshop.mode}</Badge>
                                {workshop.location && (
                                  <div className="flex items-center space-x-1 text-gray-600">
                                    <MapPin className="h-3 w-3" />
                                    <span>{workshop.location}</span>
                                  </div>
                                )}
                              </div>
                              
                              {workshop.status === 'completed' && workshop.rating && (
                                <div className="flex items-center space-x-1">
                                  {[...Array(workshop.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Google Meet Link for Online Confirmed Workshops */}
                            {workshop.mode === 'Online' && workshop.status === 'confirmed' && workshop.meetLink && (
                              <div className="bg-green-50 p-3 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-green-800">Meeting Link Ready</span>
                                  <a 
                                    href={workshop.meetLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-800"
                                  >
                                    <span>Join Meeting</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>
                            )}

                            {/* Pending Request Status */}
                            {workshop.status === 'pending' && (
                              <div className="bg-yellow-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-yellow-800">
                                  Request Sent to Admin - Awaiting Approval
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  Available Workshops
                </h2>
                <Link to="/workshops">
                  <Button variant="outline">View All Workshops</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {availableWorkshops.map((workshop) => (
                  <Card key={workshop.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex">
                        <img 
                          src={workshop.image} 
                          alt={workshop.title}
                          className="w-24 h-24 object-cover rounded-l-lg"
                        />
                        <div className="flex-1 p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{workshop.title}</h3>
                              <p className="text-sm text-gray-600">{workshop.company}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Badge variant={workshop.registrationMode === 'automated' ? 'default' : 'secondary'}>
                                {workshop.registrationMode === 'automated' ? 'Instant' : 'Manual'}
                              </Badge>
                              {workshop.price === 0 && (
                                <Badge className="bg-green-500 text-white">FREE</Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{workshop.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{workshop.time}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm">
                              <Badge variant="secondary">{workshop.mode}</Badge>
                              <div className="flex items-center space-x-1 text-gray-600">
                                <Users className="h-3 w-3" />
                                <span>{workshop.seats - workshop.registeredSeats} seats left</span>
                              </div>
                              {workshop.price > 0 && (
                                <span className="font-medium text-green-600">₹{workshop.price}</span>
                              )}
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedWorkshop(workshop);
                                setShowRegistrationModal(true);
                              }}
                              disabled={workshop.seats <= workshop.registeredSeats}
                            >
                              Register
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileManagement />
          </TabsContent>
        </Tabs>
      </div>

      <WorkshopRegistrationModal
        workshop={selectedWorkshop}
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onRegister={handleWorkshopRegistration}
      />

      <Footer />
    </div>
  );
};

export default UserDashboard;
