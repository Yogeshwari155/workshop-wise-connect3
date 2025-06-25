
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { 
  Users, 
  Calendar, 
  Building, 
  TrendingUp, 
  Search, 
  Check, 
  X, 
  Edit, 
  Trash2,
  Plus,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: "Total Users", value: "2,543", icon: Users, color: "text-blue-600" },
    { label: "Active Workshops", value: "48", icon: Calendar, color: "text-green-600" },
    { label: "Enterprise Partners", value: "23", icon: Building, color: "text-purple-600" },
    { label: "Registration Rate", value: "87%", icon: TrendingUp, color: "text-orange-600" }
  ];

  const workshops = [
    {
      id: 1,
      title: "Advanced React Development",
      company: "TechCorp Solutions",
      date: "15 Jan 2025",
      registrations: 18,
      capacity: 25,
      status: "active",
      price: 2500
    },
    {
      id: 2,
      title: "Digital Marketing Masterclass",
      company: "Growth Academy",
      date: "20 Jan 2025",
      registrations: 45,
      capacity: 50,
      status: "active",
      price: 0
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      company: "DataMinds Inc",
      date: "10 Jan 2025",
      registrations: 30,
      capacity: 30,
      status: "completed",
      price: 1800
    }
  ];

  const pendingRegistrations = [
    {
      id: 1,
      user: "Priya Sharma",
      workshop: "Advanced React Development",
      reason: "I want to enhance my React skills for my current project at work...",
      submittedAt: "2 hours ago"
    },
    {
      id: 2,
      user: "Rajesh Kumar",
      workshop: "Digital Marketing Masterclass",
      reason: "Looking to transition into digital marketing and need foundational knowledge...",
      submittedAt: "5 hours ago"
    }
  ];

  const enterprises = [
    {
      id: 1,
      name: "TechCorp Solutions",
      contact: "contact@techcorp.com",
      workshops: 5,
      status: "active",
      joinedAt: "Dec 2024"
    },
    {
      id: 2,
      name: "Growth Academy",
      contact: "hello@growthacademy.com",
      workshops: 3,
      status: "active",
      joinedAt: "Nov 2024"
    }
  ];

  const handleApproveRegistration = (id: number) => {
    toast({
      title: "Registration Approved ✅",
      description: "User has been notified of the approval.",
    });
  };

  const handleRejectRegistration = (id: number) => {
    toast({
      title: "Registration Rejected ❌",
      description: "User has been notified of the rejection.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage workshops, users, and monitor platform activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="workshops" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
            <TabsTrigger value="registrations">Pending Approvals</TabsTrigger>
            <TabsTrigger value="enterprises">Enterprises</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="workshops" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Workshop Management</CardTitle>
                <Button className="bg-gradient-to-r from-primary-500 to-accent-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Workshop
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search workshops..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-4">
                    {workshops.map((workshop) => (
                      <div key={workshop.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-900">{workshop.title}</h3>
                              <Badge variant={workshop.status === 'active' ? 'default' : 'secondary'}>
                                {workshop.status}
                              </Badge>
                              {workshop.price === 0 && (
                                <Badge className="bg-green-500 text-white">FREE</Badge>
                              )}
                            </div>
                            <p className="text-gray-600">{workshop.company}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                              <span>📅 {workshop.date}</span>
                              <span>👥 {workshop.registrations}/{workshop.capacity} registered</span>
                              {workshop.price > 0 && <span>💰 ₹{workshop.price}</span>}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full" 
                              style={{ width: `${(workshop.registrations / workshop.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Pending Registration Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingRegistrations.length === 0 ? (
                  <div className="text-center py-8">
                    <Check className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-600">No pending registrations to review.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRegistrations.map((registration) => (
                      <div key={registration.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{registration.user}</h3>
                            <p className="text-gray-600">{registration.workshop}</p>
                            <p className="text-sm text-gray-500">Submitted {registration.submittedAt}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => handleApproveRegistration(registration.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectRegistration(registration.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-sm text-gray-700">{registration.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enterprises" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Enterprise Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enterprises.map((enterprise) => (
                    <div key={enterprise.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{enterprise.name}</h3>
                        <p className="text-gray-600">{enterprise.contact}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>📚 {enterprise.workshops} workshops</span>
                          <span>📅 Joined {enterprise.joinedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={enterprise.status === 'active' ? 'default' : 'secondary'}>
                          {enterprise.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                  <p className="text-gray-600">Detailed user management features coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedWorkshop ? `Registrations: ${selectedWorkshop.title}` : 'Select a Workshop'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedWorkshop ? (
                  registrationsLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500">Loading registrations...</div>
                    </div>
                  ) : registrations.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500">No registrations found for this workshop.</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {registrations.map((registration: any) => (
                        <div key={registration.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold">{registration.user?.name}</h4>
                              <p className="text-gray-600">{registration.user?.email}</p>
                              {registration.reason && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Reason: "{registration.reason}"
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                Registered: {new Date(registration.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                className={
                                  registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  registration.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {registration.status}
                              </Badge>
                              
                              {registration.status === 'pending' && (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => approveRegistrationMutation.mutate(registration.id)}
                                    disabled={approveRegistrationMutation.isPending}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => rejectRegistrationMutation.mutate(registration.id)}
                                    disabled={rejectRegistrationMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500">
                      Click "View Registrations" on any workshop to see its registrations.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
