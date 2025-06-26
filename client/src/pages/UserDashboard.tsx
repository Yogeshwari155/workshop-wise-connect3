import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ProfileManagement from '../components/ProfileManagement';
import WorkshopRegistrationModal from '../components/WorkshopRegistrationModal';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { useMyRegistrations, useWorkshops, useRegisterForWorkshop } from '../hooks/useWorkshops';
import { Calendar, Clock, MapPin, User, Star, Building, ExternalLink, Users, Plus } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const { data: myRegistrations = [], isLoading: registrationsLoading, refetch: refetchRegistrations } = useMyRegistrations();
  const { data: availableWorkshops = [], isLoading: workshopsLoading } = useWorkshops();
  const registerMutation = useRegisterForWorkshop();

  const handleQuickRegister = async (workshopId: number) => {
    try {
      await registerMutation.mutateAsync({
        workshopId,
        reason: 'Quick registration from dashboard',
        paymentScreenshot: null
      });

      toast({
        title: "Registration Successful! 🎉",
        description: "You have been registered for the workshop.",
      });

      refetchRegistrations();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Unable to register for workshop. Please try again.",
      });
    }
  };

  // Enterprise users should be redirected to enterprise dashboard
  if (user?.role === 'enterprise') {
    window.location.href = '/enterprise-dashboard';
    return null;
  }

  const handleWorkshopRegistration = async (workshopId: number, registrationData: any) => {
    try {
      await registerMutation.mutateAsync({
        workshopId,
        ...registrationData
      });

      toast({
        title: "Registration Successful",
        description: "You have been registered for the workshop.",
      });

      setShowRegistrationModal(false);
      refetchRegistrations();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please try again later.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending Approval</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500 text-white">Completed</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (registrationsLoading || workshopsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

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
                  <div className="text-2xl font-bold text-[#7C3AED] mb-2">
                    {myRegistrations.length}
                  </div>
                  <div className="text-gray-600">Total Workshops</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {myRegistrations.filter(r => r.status === 'confirmed' || r.status === 'approved').length}
                  </div>
                  <div className="text-gray-600">Confirmed</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {myRegistrations.filter(r => r.status === 'pending').length}
                  </div>
                  <div className="text-gray-600">Pending</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {myRegistrations.filter(r => r.status === 'completed').length}
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

              {myRegistrations.length === 0 ? (
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
                      <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]">
                        Explore Workshops
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myRegistrations.map((registration) => (
                    <Card key={registration.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex">
                          <img 
                            src={registration.workshop?.image || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop"} 
                            alt={registration.workshop?.title}
                            className="w-24 h-24 object-cover rounded-l-lg"
                          />
                          <div className="flex-1 p-4 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900">{registration.workshop?.title}</h3>
                                <p className="text-sm text-gray-600">{registration.workshop?.company}</p>
                              </div>
                              {getStatusBadge(registration.status)}
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{registration.workshop?.date ? formatDate(registration.workshop.date) : 'TBD'}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{registration.workshop?.date ? formatTime(registration.workshop.date) : 'TBD'}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm">
                                <Badge variant="secondary">{registration.workshop?.mode}</Badge>
                                {registration.workshop?.location && (
                                  <div className="flex items-center space-x-1 text-gray-600">
                                    <MapPin className="h-3 w-3" />
                                    <span>{registration.workshop.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Google Meet Link for Online Confirmed Workshops */}
                            {registration.workshop?.mode === 'online' && 
                             (registration.status === 'confirmed' || registration.status === 'approved') && 
                             registration.workshop?.meetLink && (
                              <div className="bg-green-50 p-3 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-green-800">Meeting Link Ready</span>
                                  <a 
                                    href={registration.workshop.meetLink} 
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
                            {registration.status === 'pending' && (
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
                {availableWorkshops.slice(0, 4).map((workshop) => {
                  const isRegistered = myRegistrations.some(r => r.workshopId === workshop.id);
                  const availableSeats = workshop.seats - workshop.registeredSeats;

                  return (
                    <Card key={workshop.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex">
                          <img 
                            src={workshop.image || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop"} 
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
                                <span>{workshop.date ? formatDate(workshop.date) : 'TBD'}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{workshop.date ? formatTime(workshop.date) : 'TBD'}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm">
                                <Badge variant="secondary">{workshop.mode}</Badge>
                                <div className="flex items-center space-x-1 text-gray-600">
                                  <Users className="h-3 w-3" />
                                  <span>{availableSeats} seats left</span>
                                </div>
                                {workshop.price > 0 && (
                                  <span className="font-medium text-green-600">₹{workshop.price}</span>
                                )}
                              </div>
                              {isRegistered ? (
                                <Badge className="bg-[#7C3AED] text-white">Registered</Badge>
                              ) : (
                                <Button 
                                  size="sm"
                                  className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]"
                                  onClick={() => {
                                    setSelectedWorkshop(workshop);
                                    setShowRegistrationModal(true);
                                  }}
                                  disabled={availableSeats <= 0}
                                >
                                  {availableSeats <= 0 ? 'Full' : 'Register'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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