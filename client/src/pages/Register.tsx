import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Calendar, Users, Building } from 'lucide-react';

const Register = () => {
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [enterpriseForm, setEnterpriseForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    password: '',
    confirmPassword: '',
    domain: '',
    location: '',
    website: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userForm.password !== userForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await register({ ...userForm, role: 'user' });
      if (success) {
        toast({
          title: "Welcome to WorkshopWise! 🎉",
          description: "Your account has been created successfully.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enterpriseForm.password !== enterpriseForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await register({ ...enterpriseForm, role: 'enterprise' });
      if (success) {
        toast({
          title: "Welcome to WorkshopWise! 🎉",
          description: "Your enterprise account has been created successfully.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-[#7C3AED] to-[#7C3AED] p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-gray-900">
                WorkshopWise
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-[#7C3AED] to-[#7C3AED] bg-clip-text text-transparent">
              Join WorkshopWise
            </h2>
            <p className="mt-2 text-gray-600">
              Create your account and start your learning journey
            </p>
          </div>

          <Card className="shadow-xl border-0 rounded-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold">Create Account</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="user" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="user" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Individual</span>
                  </TabsTrigger>
                  <TabsTrigger value="enterprise" className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>Enterprise</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user">
                  <form onSubmit={handleUserSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-name">Full Name</Label>
                        <Input
                          id="user-name"
                          value={userForm.name}
                          onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                          placeholder="John Doe"
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-email">Email Address</Label>
                        <Input
                          id="user-email"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                          placeholder="john@example.com"
                          required
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-password">Password</Label>
                        <Input
                          id="user-password"
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                          placeholder="Create a password"
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-confirm-password">Confirm Password</Label>
                        <Input
                          id="user-confirm-password"
                          type="password"
                          value={userForm.confirmPassword}
                          onChange={(e) => setUserForm({...userForm, confirmPassword: e.target.value})}
                          placeholder="Confirm your password"
                          required
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#7C3AED] to-[#7C3AED] hover:from-[#6D28D9] hover:to-[#6D28D9] text-white py-3 rounded-lg font-semibold"
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="enterprise">
                  <form onSubmit={handleEnterpriseSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                          id="company-name"
                          value={enterpriseForm.companyName}
                          onChange={(e) => setEnterpriseForm({...enterpriseForm, companyName: e.target.value})}
                          placeholder="TechCorp Solutions"
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-person">Contact Person</Label>
                        <Input
                          id="contact-person"
                          value={enterpriseForm.contactPerson}
                          onChange={(e) => setEnterpriseForm({...enterpriseForm, contactPerson: e.target.value})}
                          placeholder="Jane Smith"
                          required
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="enterprise-email">Business Email</Label>
                        <Input
                          id="enterprise-email"
                          type="email"
                          value={enterpriseForm.email}
                          onChange={(e) => setEnterpriseForm({...enterpriseForm, email: e.target.value})}
                          placeholder="contact@company.com"
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="domain">Industry Domain</Label>
                        <Input
                          id="domain"
                          value={enterpriseForm.domain}
                          onChange={(e) => setEnterpriseForm({...enterpriseForm, domain: e.target.value})}
                          placeholder="Technology, Finance, etc."
                          required
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={enterpriseForm.location}
                          onChange={(e) => setEnterpriseForm({...enterpriseForm, location: e.target.value})}
                          placeholder="Bangalore, India"
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website (Optional)</Label>
                        <Input
                          id="website"
                          value={enterpriseForm.website}
                          onChange={(e) => setEnterpriseForm({...enterpriseForm, website: e.target.value})}
                          placeholder="https://company.com"
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="enterprise-password">Password</Label>
                        <Input
                          id="enterprise-password"
                          type="password"
                          value={enterpriseForm.password}
                          onChange={(e) => setEnterpriseForm({...enterpriseForm, password: e.target.value})}
                          placeholder="Create a password"
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="enterprise-confirm-password">Confirm Password</Label>
                        <Input
                          id="enterprise-confirm-password"
                          type="password"
                          value={enterpriseForm.confirmPassword}
                          onChange={(e) => setEnterpriseForm({...enterpriseForm, confirmPassword: e.target.value})}
                          placeholder="Confirm your password"
                          required
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#7C3AED] to-[#7C3AED] hover:from-[#6D28D9] hover:to-[#6D28D9] text-white py-3 rounded-lg font-semibold"
                    >
                      {isLoading ? "Creating Account..." : "Create Enterprise Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;