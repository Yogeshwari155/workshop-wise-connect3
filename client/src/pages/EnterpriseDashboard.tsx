import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Users, Eye, Clock, MapPin, IndianRupee, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { enterpriseApi, apiRequest } from '../utils/api';
import { useToast } from '../hooks/use-toast';

const workshopSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.date({
    required_error: "Please select a date for the workshop.",
  }),
  time: z.string().min(1, 'Time is required'),
  duration: z.string().min(1, 'Duration is required'),
  mode: z.enum(['online', 'offline', 'hybrid']),
  location: z.string().optional(),
  price: z.number().min(0),
  isFree: z.boolean(),
  seats: z.number().min(1),
  registrationMode: z.enum(['automated', 'manual']),
  tags: z.string().optional(),
});

type WorkshopForm = z.infer<typeof workshopSchema>;

const EnterpriseDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);

  const form = useForm<WorkshopForm>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      title: '',
      description: '',
      date: undefined,
      time: '',
      duration: '',
      mode: 'online',
      location: '',
      price: 0,
      isFree: true,
      seats: 20,
      registrationMode: 'automated',
      tags: '',
    },
  });

  const { data: workshops = [], isLoading, refetch } = useQuery({
    queryKey: ['enterprise-workshops'],
    queryFn: enterpriseApi.getWorkshops,
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true, // Refresh when window gets focus
  });

  const { data: registrations = [] } = useQuery({
    queryKey: ['workshop-registrations', selectedWorkshop?.id],
    queryFn: () => enterpriseApi.getRegistrations(selectedWorkshop.id),
    enabled: !!selectedWorkshop,
  });

  const createWorkshopMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/workshops', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprise-workshops'] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: 'Workshop Created',
        description: 'Your workshop has been submitted for admin approval.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create workshop',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: WorkshopForm) => {
    const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
    createWorkshopMutation.mutate({
      ...data,
      tags: tagsArray,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enterprise Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => refetch()} 
              variant="outline"
              className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-purple-600 hover:to-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workshop
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Workshop</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Workshop Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter workshop title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your workshop..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input
                                type="date"
                                value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                onChange={(e) => {
                                  const dateValue = e.target.value;
                                  if (dateValue) {
                                    field.onChange(new Date(dateValue));
                                  } else {
                                    field.onChange(undefined);
                                  }
                                }}
                                min={format(new Date(), "yyyy-MM-dd")}
                                className="flex-1"
                              />
                            </FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  type="button"
                                  className="shrink-0"
                                >
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                  }}
                                  disabled={(date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return date < today;
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 10:00 AM - 6:00 PM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 3 days, 6 hours" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mode</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select mode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="online">Online</SelectItem>
                              <SelectItem value="offline">Offline</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('mode') !== 'online' && (
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Workshop location" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pricing</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(value === 'true')} 
                            defaultValue={field.value ? 'true' : 'false'}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Free</SelectItem>
                              <SelectItem value="false">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {!form.watch('isFree') && (
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="seats"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Seats</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="20"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="registrationMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Mode</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="automated">Automated</SelectItem>
                              <SelectItem value="manual">Manual Approval</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Tags (comma-separated)</FormLabel>
                          <FormControl>
                            <Input placeholder="React, JavaScript, Frontend" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createWorkshopMutation.isPending}
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-purple-600 hover:to-purple-700"
                    >
                      {createWorkshopMutation.isPending ? 'Creating...' : 'Create Workshop'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Workshop Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Workshops</p>
                  <p className="text-2xl font-bold text-gray-900">{workshops.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {workshops.filter((w: any) => w.status === 'approved').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {workshops.filter((w: any) => w.status === 'pending').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {workshops.reduce((sum: number, w: any) => sum + w.registeredSeats, 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workshops List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Workshops</h2>
            <div className="space-y-4">
              {workshops.map((workshop: any) => (
                <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{workshop.title}</h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{workshop.description}</p>
                      </div>
                      {getStatusBadge(workshop.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(workshop.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{workshop.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {workshop.mode === 'offline' ? (
                          <>
                            <MapPin className="h-4 w-4" />
                            <span>{workshop.location}</span>
                          </>
                        ) : (
                          <>
                            <Users className="h-4 w-4" />
                            <span>{workshop.registeredSeats}/{workshop.seats} registered</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="h-4 w-4" />
                        <span>{workshop.isFree ? 'Free' : `₹${workshop.price}`}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedWorkshop(workshop)}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Registrations ({workshop.registeredSeats})
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {workshops.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No workshops created yet.</p>
                    <p className="text-sm text-gray-400 mt-2">Click "Create Workshop" to get started.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Registrations Panel */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedWorkshop ? `Registrations: ${selectedWorkshop.title}` : 'Select a Workshop'}
            </h2>
            
            {selectedWorkshop ? (
              <div className="space-y-4">
                {registrations.map((registration: any) => (
                  <Card key={registration.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{registration.user?.name}</h4>
                          <p className="text-sm text-gray-600">{registration.user?.email}</p>
                          {registration.reason && (
                            <p className="text-sm text-gray-500 mt-1">"{registration.reason}"</p>
                          )}
                        </div>
                        <Badge className={
                          registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {registration.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {registrations.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No registrations yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Select a workshop to view registrations.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EnterpriseDashboard;