
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { Calendar, Clock, MapPin, Users, Upload, X, CreditCard } from 'lucide-react';

interface Workshop {
  id: number;
  title: string;
  company: string;
  date: string;
  mode: string;
  price: number;
  seats: number;
  registeredSeats: number;
  registrationMode: string;
  image?: string;
  location?: string;
}

interface WorkshopRegistrationModalProps {
  workshop: Workshop | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (workshopId: number, registrationData: any) => void;
}

const WorkshopRegistrationModal = ({ workshop, isOpen, onClose, onRegister }: WorkshopRegistrationModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [reason, setReason] = useState('');

  if (!workshop) return null;

  const availableSeats = workshop.seats - workshop.registeredSeats;
  const isPaid = workshop.price > 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
        });
        return;
      }
      setPaymentScreenshot(file);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    
    try {
      // Validate required fields
      if (workshop.registrationMode === 'manual' && !reason.trim()) {
        toast({
          variant: "destructive",
          title: "Reason Required",
          description: "Please provide a reason for registration.",
        });
        setLoading(false);
        return;
      }

      if (isPaid && !paymentScreenshot) {
        toast({
          variant: "destructive",
          title: "Payment Proof Required",
          description: "Please upload payment screenshot.",
        });
        setLoading(false);
        return;
      }
      
      const registrationData = {
        reason: workshop.registrationMode === 'manual' ? reason : '',
        paymentScreenshot: paymentScreenshot
      };

      await onRegister(workshop.id, registrationData);
      
      // Reset form
      setReason('');
      setPaymentScreenshot(null);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Register for Workshop</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workshop Details */}
          <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#7C3AED]/10 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{workshop.title}</h3>
            <p className="text-gray-600 mb-3">{workshop.company}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-[#7C3AED]" />
                <span>{workshop.date ? formatDate(workshop.date) : 'Date TBD'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-[#7C3AED]" />
                <span>{workshop.date ? formatTime(workshop.date) : 'Time TBD'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#7C3AED]" />
                <span>{workshop.mode} {workshop.location && `- ${workshop.location}`}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-[#7C3AED]" />
                <span>{availableSeats} seats available</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Badge variant={workshop.registrationMode === 'automated' ? 'default' : 'secondary'}>
                  {workshop.registrationMode === 'automated' ? 'Instant Approval' : 'Manual Approval'}
                </Badge>
                {workshop.price === 0 ? (
                  <Badge className="bg-green-500 text-white">FREE</Badge>
                ) : (
                  <Badge variant="outline">₹{workshop.price}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="space-y-4">
            {/* Manual registration reason */}
            {workshop.registrationMode === 'manual' && (
              <div className="space-y-2">
                <Label htmlFor="reason">
                  Why do you want to attend this workshop? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please explain your motivation and how this workshop will benefit you..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  This information will be reviewed by the workshop organizer
                </p>
              </div>
            )}

            {/* Payment upload for paid workshops */}
            {isPaid && (
              <div className="space-y-2">
                <Label htmlFor="payment">
                  Payment Screenshot <span className="text-red-500">*</span>
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {paymentScreenshot ? (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{paymentScreenshot.name}</span>
                        <Badge className="bg-green-500 text-white text-xs">Uploaded</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPaymentScreenshot(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload payment screenshot
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="payment-upload"
                      />
                      <Label htmlFor="payment-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Please upload a screenshot of your payment confirmation (Max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Registration Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Registration Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Workshop:</span>
                <span className="font-medium">{workshop.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-medium">
                  {workshop.price === 0 ? 'FREE' : `₹${workshop.price}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Approval:</span>
                <span className="font-medium">
                  {workshop.registrationMode === 'automated' ? 'Instant' : 'Manual Review'}
                </span>
              </div>
              {workshop.registrationMode === 'automated' && (
                <div className="pt-2 border-t text-xs text-green-600">
                  ✓ You will be automatically registered upon submission
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleRegister}
              disabled={loading || availableSeats <= 0}
              className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkshopRegistrationModal;
