import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Users, Building, BookOpen, TrendingUp, Eye, Check, X, Calendar, MapPin, IndianRupee, RefreshCw, Trash2, Activity } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all data with real-time refresh
  const { data: users = [], refetch: refetchUsers } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const { data: enterprises = [], refetch: refetchEnterprises } = useQuery({
    queryKey: ['/api/admin/enterprises'],
    queryFn: async () => {
      const response = await fetch('/api/admin/enterprises', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch enterprises');
      return response.json();
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const { data: workshops = [], refetch: refetchWorkshops } = useQuery({
    queryKey: ['/api/admin/workshops'],
    queryFn: async () => {
      const response = await fetch('/api/admin/workshops', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch workshops');
      return response.json();
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const { data: registrations = [], refetch: refetchRegistrations } = useQuery({
    queryKey: ['/api/admin/registrations'],
    queryFn: async () => {
      const response = await fetch('/api/admin/registrations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch registrations');
      return response.json();
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const handleWorkshopAction = async (workshopId: number, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/workshops/${workshopId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          status: action === 'approve' ? 'approved' : 'rejected' 
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Workshop ${action}d successfully`,
        });
        // Refetch data to update the UI
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['/api/admin/workshops'] }),
          queryClient.invalidateQueries({ queryKey: ['/api/workshops'] })
        ]);
      } else {
        throw new Error('Failed to update workshop status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workshop status",
        variant: "destructive",
      });
    }
  };

  const handleEnterpriseAction = async (enterpriseId: number, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/enterprises/${enterpriseId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          status: action === 'approve' ? 'approved' : 'rejected' 
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Enterprise ${action}d successfully`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/enterprises'] });
      } else {
        throw new Error('Failed to update enterprise status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update enterprise status",
        variant: "destructive",
      });
    }
  };

  const handleRegistrationAction = async (registrationId: number, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          status: action === 'approve' ? 'approved' : 'rejected' 
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Registration ${action}d successfully`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/registrations'] });
      } else {
        throw new Error('Failed to update registration status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update registration status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEnterprise = async (enterpriseId: number, companyName: string) => {
    if (!confirm(`Are you sure you want to delete enterprise "${companyName}"? This will also delete all associated workshops and registrations.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/enterprises/${enterpriseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Enterprise deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/enterprises'] });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete enterprise');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete enterprise",
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const pendingWorkshops = workshops.filter((w: any) => w.status === 'pending').length;
  const pendingEnterprises = enterprises.filter((e: any) => e.status === 'pending').length;
  const pendingRegistrations = registrations.filter((r: any) => r.status === 'pending').length;
  const totalUsers = users.filter((u: any) => u.role === 'user').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Admin Dashboard
              </h1>
              <p className="text-xl text-purple-100">
                Manage users, enterprises, and workshops
              </p>
            </div>
            <Button 
              onClick={() => {
                refetchUsers();
                refetchEnterprises();
                refetchWorkshops();
                refetchRegistrations();
              }}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 -mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Enterprises</p>
                    <p className="text-3xl font-bold text-gray-900">{enterprises.length}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Building className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Workshops</p>
                    <p className="text-3xl font-bold text-gray-900">{workshops.length}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                    <p className="text-3xl font-bold text-gray-900">{pendingWorkshops + pendingEnterprises}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="workshops" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto">
              <TabsTrigger value="workshops">Workshops</TabsTrigger>
              <TabsTrigger value="enterprises">Enterprises</TabsTrigger>
              <TabsTrigger value="registrations">Registrations</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            {/* Workshop Management */}
            <TabsContent value="workshops" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workshop Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workshops.map((workshop: any) => (
                      <div key={workshop.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{workshop.title}</h3>
                          <p className="text-sm text-gray-600">{workshop.enterprise?.companyName}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(workshop.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{workshop.mode}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <IndianRupee className="h-4 w-4" />
                              <span>{workshop.isFree ? 'Free' : `₹${workshop.price}`}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            workshop.status === 'approved' ? 'default' :
                            workshop.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {workshop.status}
                          </Badge>
                          {workshop.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleWorkshopAction(workshop.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleWorkshopAction(workshop.id, 'reject')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enterprise Management */}
            <TabsContent value="enterprises" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enterprises.map((enterprise: any) => (
                      <div key={enterprise.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{enterprise.companyName}</h3>
                              <Badge variant={
                                enterprise.status === 'approved' ? 'default' :
                                enterprise.status === 'rejected' ? 'destructive' : 'secondary'
                              }>
                                {enterprise.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{enterprise.user?.email}</p>
                            <p className="text-sm text-gray-600 mt-1">Contact: {enterprise.user?.name}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>Domain: {enterprise.domain}</span>
                              <span>Location: {enterprise.location}</span>
                              <span>Workshops: {enterprise.workshopCount || 0}</span>
                            </div>
                            {enterprise.website && (
                              <p className="text-sm text-blue-600 mt-1">
                                <a href={enterprise.website} target="_blank" rel="noopener noreferrer">
                                  {enterprise.website}
                                </a>
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Registered {new Date(enterprise.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {enterprise.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleEnterpriseAction(enterprise.id, 'approve')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleEnterpriseAction(enterprise.id, 'reject')}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteEnterprise(enterprise.id, enterprise.companyName)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Registration Management */}
            <TabsContent value="registrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registration Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {registrations.map((registration: any) => (
                      <div key={registration.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{registration.userName}</h3>
                          <p className="text-sm text-gray-600">{registration.userEmail}</p>
                          <p className="text-sm text-gray-600 mt-1">Workshop: {registration.workshopTitle}</p>
                          {registration.reason && (
                            <p className="text-xs text-gray-500 mt-2">Reason: {registration.reason}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(registration.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <IndianRupee className="h-4 w-4" />
                              <span>{registration.workshopIsFree ? 'Free' : `₹${registration.workshopPrice}`}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            registration.status === 'approved' ? 'default' :
                            registration.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {registration.status}
                          </Badge>
                          {registration.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleRegistrationAction(registration.id, 'approve')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRegistrationAction(registration.id, 'reject')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user: any) => (
                      <div key={user.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{user.name}</h3>
                              <Badge variant="outline">
                                {user.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                            
                            {/* User Activities */}
                            {user.registrations && user.registrations.length > 0 && (
                              <div className="mt-3">
                                <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                                  <Activity className="h-4 w-4" />
                                  <span>Workshop Registrations ({user.registrations.length})</span>
                                </div>
                                <div className="space-y-1">
                                  {user.registrations.slice(0, 3).map((registration: any) => (
                                    <div key={registration.id} className="text-xs text-gray-600 flex items-center justify-between">
                                      <span>{registration.workshop?.title || 'Workshop'}</span>
                                      <div className="flex items-center gap-2">
                                        <Badge variant={
                                          registration.status === 'approved' ? 'default' :
                                          registration.status === 'rejected' ? 'destructive' : 'secondary'
                                        } className="text-xs">
                                          {registration.status}
                                        </Badge>
                                        <span>{new Date(registration.createdAt).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  ))}
                                  {user.registrations.length > 3 && (
                                    <div className="text-xs text-gray-500">
                                      +{user.registrations.length - 3} more registrations
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {user.role !== 'admin' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(user.id, user.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminDashboard;