import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useToast } from '../hooks/use-toast';
import { enterpriseApi, workshopApi } from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BarChart3,
  Users,
  Clock,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  IndianRupee,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarDays
} from 'lucide-react';
import { format } from 'date-fns';

const EnterpriseDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');

  // Fetch enterprise workshops
  const { data: myWorkshops = [], isLoading: workshopsLoading } = useQuery({
    queryKey: ['enterprise-workshops'],
    queryFn: enterpriseApi.getWorkshops,
  });

  // Fetch registrations for selected workshop
  const { data: registrations = [], isLoading: registrationsLoading } = useQuery({
    queryKey: ['workshop-registrations', selectedWorkshop],
    queryFn: () => selectedWorkshop ? enterpriseApi.getRegistrations(selectedWorkshop) : [],
    enabled: !!selectedWorkshop,
  });

  // Create workshop mutation
  const createWorkshopMutation = useMutation({
    mutationFn: workshopApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprise-workshops'] });
      toast({
        title: "Workshop Created",
        description: "Your workshop has been submitted for admin approval.",
      });
      setShowCreateForm(false);
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Could not create workshop. Please try again.",
      });
    },
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mode: '',
    location: '',
    price: 0,
    seats: 25,
    registrationMode: 'automated',
    requirements: '',
    agenda: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      mode: '',
      location: '',
      price: 0,
      seats: 25,
      registrationMode: 'automated',
      requirements: '',
      agenda: ''
    });
    setSelectedDate(undefined);
    setSelectedTime('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'seats' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateWorkshop = async () => {
    if (!formData.title || !formData.description || !formData.mode || !selectedDate || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields including date and time.",
      });
      return;
    }

    // Combine date and time
    const [hours, minutes] = selectedTime.split(':');
    const workshopDateTime = new Date(selectedDate);
    workshopDateTime.setHours(parseInt(hours), parseInt(minutes));

    const workshopData = {
      ...formData,
      date: workshopDateTime.toISOString(),
      registeredSeats: 0,
      status: 'pending'
    };

    createWorkshopMutation.mutate(workshopData);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRegistrationStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
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

  if (workshopsLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-[#7C3AED] mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {myWorkshops.filter(w => w.status === 'approved').length}
            </div>
            <div className="text-gray-600">Active Workshops</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {myWorkshops.reduce((total, workshop) => total + (workshop.registeredSeats || 0), 0)}
            </div>
            <div className="text-gray-600">Total Registrations</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {myWorkshops.filter(w => w.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending Approval</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <IndianRupee className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {myWorkshops.reduce((total, workshop) => total + (workshop.price || 0) * (workshop.registeredSeats || 0), 0)}
            </div>
            <div className="text-gray-600">Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Workshop Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Workshop Management</h2>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Workshop</span>
        </Button>
      </div>

      {/* Create Workshop Form */}
      {showCreateForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Create New Workshop</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Workshop Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter workshop title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mode">Mode *</Label>
                <Select value={formData.mode} onValueChange={(value) => handleSelectChange('mode', value)}>
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

              <div className="space-y-2">
                <Label>Workshop Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Workshop Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>

              {(formData.mode === 'offline' || formData.mode === 'hybrid') && (
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0 for free"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">Total Seats *</Label>
                <Input
                  id="seats"
                  name="seats"
                  type="number"
                  min="1"
                  value={formData.seats}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationMode">Registration Mode</Label>
                <Select value={formData.registrationMode} onValueChange={(value) => handleSelectChange('registrationMode', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automated">Automated (Instant approval)</SelectItem>
                    <SelectItem value="manual">Manual (Requires approval)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your workshop..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Prerequisites</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="What should participants know beforehand?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agenda">Agenda</Label>
                <Textarea
                  id="agenda"
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleInputChange}
                  placeholder="Workshop schedule and topics..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleCreateWorkshop}
                disabled={createWorkshopMutation.isPending}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]"
              >
                {createWorkshopMutation.isPending ? 'Creating...' : 'Create Workshop'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workshop List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Workshops */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>My Workshops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myWorkshops.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No workshops created yet.</p>
              ) : (
                myWorkshops.map((workshop) => (
                  <div
                    key={workshop.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedWorkshop === workshop.id ? 'border-[#7C3AED] bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedWorkshop(workshop.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{workshop.title}</h3>
                      {getStatusBadge(workshop.status)}
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <CalendarDays className="h-3 w-3" />
                          <span>{workshop.date ? format(new Date(workshop.date), "MMM dd, yyyy") : 'Date TBD'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{workshop.registeredSeats || 0}/{workshop.seats}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{workshop.mode} {workshop.location && `- ${workshop.location}`}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Workshop Registrations */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Workshop Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedWorkshop ? (
              <div className="space-y-4">
                {registrationsLoading ? (
                  <p className="text-center py-4">Loading registrations...</p>
                ) : registrations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No registrations yet.</p>
                ) : (
                  registrations.map((registration) => (
                    <div key={registration.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{registration.user?.name}</h4>
                          <p className="text-sm text-gray-600">{registration.user?.email}</p>
                        </div>
                        {getRegistrationStatusBadge(registration.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Registered: {format(new Date(registration.createdAt), "MMM dd, yyyy")}</p>
                        {registration.reason && (
                          <p className="mt-2"><strong>Reason:</strong> {registration.reason}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Select a workshop to view registrations.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;