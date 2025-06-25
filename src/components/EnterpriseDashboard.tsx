
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  Building, 
  Plus, 
  Calendar, 
  Users, 
  BarChart3, 
  CheckCircle, 
  XCircle,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Clock,
  IndianRupee
} from 'lucide-react';

const EnterpriseDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreatingWorkshop, setIsCreatingWorkshop] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    description: '',
    price: '',
    mode: '',
    location: '',
    duration: '',
    seats: '',
    registrationMode: 'manual'
  });

  // Mock data for enterprise workshops
  const myWorkshops = [
    {
      id: 1,
      title: "Advanced React Development",
      date: "15 Jan 2025",
      status: "Active",
      registrations: 18,
      totalSeats: 25,
      mode: "Online",
      price: 2500
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      date: "20 Jan 2025",
      status: "Active",
      registrations: 30,
      totalSeats: 30,
      mode: "Hybrid",
      price: 1800
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      date: "5 Jan 2025",
      status: "Closed",
      registrations: 50,
      totalSeats: 50,
      mode: "Offline",
      price: 3500
    }
  ];

  // Mock data for user registrations
  const userRegistrations = [
    {
      id: 1,
      workshopTitle: "Advanced React Development",
      userName: "Priya Sharma",
      userEmail: "priya@example.com",
      registrationDate: "12 Jan 2025",
      status: "pending",
      paymentStatus: "paid"
    },
    {
      id: 2,
      workshopTitle: "Advanced React Development",
      userName: "Rajesh Kumar",
      userEmail: "rajesh@example.com",
      registrationDate: "11 Jan 2025",
      status: "approved",
      paymentStatus: "paid"
    },
    {
      id: 3,
      workshopTitle: "JavaScript Fundamentals",
      userName: "Sneha Patel",
      userEmail: "sneha@example.com",
      registrationDate: "10 Jan 2025",
      status: "pending",
      paymentStatus: "pending"
    }
  ];

  const handleCreateWorkshop = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Workshop Created! 🎉",
        description: "Your workshop has been successfully created and is now live.",
      });
      
      setNewWorkshop({
        title: '',
        description: '',
        price: '',
        mode: '',
        location: '',
        duration: '',
        seats: '',
        registrationMode: 'manual'
      });
      setIsCreatingWorkshop(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRegistration = async (registrationId: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration Approved ✅",
        description: "User has been notified via email.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRegistration = async (registrationId: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration Rejected",
        description: "User has been notified via email.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Rejection Failed",
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500 text-white">Closed</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Building className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">
              Welcome, {user?.company || user?.name}! 
            </h1>
            <p className="text-white/90 text-lg">
              Manage your workshops and engage with learners
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {myWorkshops.filter(w => w.status === 'Active').length}
            </div>
            <div className="text-gray-600">Active Workshops</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {myWorkshops.reduce((total, workshop) => total + workshop.registrations, 0)}
            </div>
            <div className="text-gray-600">Total Registrations</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {userRegistrations.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending Approvals</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <IndianRupee className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ₹{myWorkshops.reduce((total, workshop) => total + (workshop.price * workshop.registrations), 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Workshop Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Workshop Management</span>
          </CardTitle>
          <Dialog open={isCreatingWorkshop} onOpenChange={setIsCreatingWorkshop}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600">
                <Plus className="h-4 w-4 mr-2" />
                Create New Workshop
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Workshop</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Workshop Title</Label>
                    <Input
                      value={newWorkshop.title}
                      onChange={(e) => setNewWorkshop({...newWorkshop, title: e.target.value})}
                      placeholder="e.g., Advanced React Development"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <Select value={newWorkshop.mode} onValueChange={(value) => setNewWorkshop({...newWorkshop, mode: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newWorkshop.description}
                    onChange={(e) => setNewWorkshop({...newWorkshop, description: e.target.value})}
                    placeholder="Describe what participants will learn..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      value={newWorkshop.price}
                      onChange={(e) => setNewWorkshop({...newWorkshop, price: e.target.value})}
                      placeholder="0 for free"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={newWorkshop.duration}
                      onChange={(e) => setNewWorkshop({...newWorkshop, duration: e.target.value})}
                      placeholder="e.g., 3 days"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Seats</Label>
                    <Input
                      type="number"
                      value={newWorkshop.seats}
                      onChange={(e) => setNewWorkshop({...newWorkshop, seats: e.target.value})}
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>

                {newWorkshop.mode === 'offline' && (
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={newWorkshop.location}
                      onChange={(e) => setNewWorkshop({...newWorkshop, location: e.target.value})}
                      placeholder="e.g., Bangalore"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Registration Mode</Label>
                  <Select value={newWorkshop.registrationMode} onValueChange={(value) => setNewWorkshop({...newWorkshop, registrationMode: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Approval</SelectItem>
                      <SelectItem value="automatic">Automatic Registration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    onClick={handleCreateWorkshop}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Creating...' : 'Create Workshop'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreatingWorkshop(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      {/* My Workshops */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>My Workshops</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myWorkshops.map((workshop) => (
              <div key={workshop.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{workshop.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{workshop.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{workshop.registrations}/{workshop.totalSeats} registered</span>
                        </div>
                        <Badge variant="secondary">{workshop.mode}</Badge>
                        <span className="font-medium">₹{workshop.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(workshop.status)}
                  <div className="flex space-x-2">
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Registrations */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>User Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userRegistrations.map((registration) => (
              <div key={registration.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{registration.userName}</h4>
                      <p className="text-sm text-gray-600">{registration.userEmail}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">Workshop:</span>
                        <span className="text-sm font-medium">{registration.workshopTitle}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Registered on</div>
                    <div className="text-sm font-medium">{registration.registrationDate}</div>
                  </div>
                  {getStatusBadge(registration.status)}
                  {registration.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        onClick={() => handleApproveRegistration(registration.id)}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRejectRegistration(registration.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterpriseDashboard;
