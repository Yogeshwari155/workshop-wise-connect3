
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Calendar, Clock, MapPin, User, Star, Upload, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useWorkshop, useRegisterForWorkshop } from '../hooks/useWorkshops';
import { IndianRupee, Users, CreditCard } from 'lucide-react';

const WorkshopRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registrationMode, setRegistrationMode] = useState('automated');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    reason: '',
    experience: '',
    expectations: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: workshop, isLoading, error } = useWorkshop(parseInt(id || '0'));
  const registerMutation = useRegisterForWorkshop();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading workshop details...</p>
        </div>
      </div>
    );
  }

  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Workshop Not Found</h1>
          <p className="text-gray-600 mb-4">The workshop you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/workshops')}>View All Workshops</Button>
        </div>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentScreenshot(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (registrationMode === 'automated') {
        if (!workshop.isFree && !paymentScreenshot) {
          toast({
            variant: "destructive",
            title: "Payment proof required",
            description: "Please upload payment screenshot to complete registration.",
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        if (!formData.reason.trim()) {
          toast({
            variant: "destructive",
            title: "Reason required",
            description: "Please provide a reason for wanting to attend this workshop.",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const registrationData = {
        workshopId: workshop.id,
        reason: registrationMode === 'manual' ? formData.reason : '',
        paymentScreenshot: paymentScreenshot
      };

      await registerMutation.mutateAsync(registrationData);

      if (registrationMode === 'automated') {
        toast({
          title: "Registration Successful! 🎉",
          description: "You're confirmed for the workshop. Check your email for details.",
        });
      } else {
        toast({
          title: "Registration Submitted! ⏳",
          description: "Your request has been sent to admin for approval. You'll be notified via email.",
        });
      }

      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Register for Workshop
          </h1>
          <p className="text-gray-600">
            Complete your registration for "{workshop.title}"
          </p>
        </div>

        {/* Workshop Summary */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{workshop.title}</h3>
                <p className="text-gray-600">{workshop.company}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>{new Date(workshop.date).toLocaleDateString('en-US', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                {workshop.isFree ? (
                  <span className="text-2xl font-bold text-green-600">FREE</span>
                ) : (
                  <div className="flex items-center space-x-1">
                    <IndianRupee className="h-5 w-5 text-gray-900" />
                    <span className="text-2xl font-bold text-gray-900">{workshop.price}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Registration Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Registration Mode */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Registration Mode</Label>
                    <RadioGroup value={registrationMode} onValueChange={setRegistrationMode}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="automated" id="automated" />
                          <div className="flex-1">
                            <Label htmlFor="automated" className="font-medium">
                              Automated Registration
                            </Label>
                            <p className="text-sm text-gray-600">
                              Complete payment and get instant confirmation
                            </p>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="manual" id="manual" />
                          <div className="flex-1">
                            <Label htmlFor="manual" className="font-medium">
                              Manual Approval
                            </Label>
                            <p className="text-sm text-gray-600">
                              Send request to admin for approval
                            </p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Payment Section for Paid Workshops */}
                  {!workshop.isFree && registrationMode === 'automated' && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900">Payment Information</h3>
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded border">
                          <p className="text-sm text-gray-600 mb-2">Make payment to:</p>
                          <div className="font-mono text-sm">
                            <p><strong>UPI ID:</strong> workshops@techcorp.com</p>
                            <p><strong>Amount:</strong> ₹{workshop.price}</p>
                            <p><strong>Reference:</strong> REACT-ADV-{id}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payment-proof">Upload Payment Screenshot *</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <div className="text-sm text-gray-600 mb-2">
                              Click to upload or drag and drop
                            </div>
                            <Input
                              id="payment-proof"
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('payment-proof')?.click()}
                            >
                              Select File
                            </Button>
                            {paymentScreenshot && (
                              <p className="text-sm text-green-600 mt-2">
                                ✓ {paymentScreenshot.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Manual Registration Form */}
                  {registrationMode === 'manual' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reason">Why do you want to attend this workshop? *</Label>
                        <Textarea
                          id="reason"
                          value={formData.reason}
                          onChange={(e) => setFormData({...formData, reason: e.target.value})}
                          placeholder="Explain your motivation and how this workshop aligns with your goals..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Your relevant experience</Label>
                        <Textarea
                          id="experience"
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          placeholder="Describe your background in React or related technologies..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expectations">What do you expect to learn?</Label>
                        <Textarea
                          id="expectations"
                          value={formData.expectations}
                          onChange={(e) => setFormData({...formData, expectations: e.target.value})}
                          placeholder="What specific skills or knowledge are you hoping to gain..."
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#7C3AED] hover:from-[#6D28D9] hover:to-[#6D28D9] text-white py-3 text-lg font-semibold"
                  >
                    {isSubmitting 
                      ? "Processing..." 
                      : registrationMode === 'automated' 
                        ? "Complete Registration" 
                        : "Submit for Approval"
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Registration Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Registration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="font-medium">
                      {registrationMode === 'automated' ? 'Instant' : 'Manual Approval'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">
                      {workshop.isFree ? 'FREE' : `₹${workshop.price}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats Left:</span>
                    <span className="font-medium">
                      {workshop.seats - workshop.registeredSeats}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 space-y-2">
                    {registrationMode === 'automated' ? (
                      <>
                        <p>✓ Instant confirmation</p>
                        <p>✓ Immediate access to materials</p>
                        <p>✓ Calendar invite sent</p>
                      </>
                    ) : (
                      <>
                        <p>⏳ Admin review (24-48 hours)</p>
                        <p>📧 Email notification on approval</p>
                        <p>💬 Detailed application review</p>
                      </>
                    )}
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

export default WorkshopRegistration;
