
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { Upload, Calendar, Clock, MapPin, Users, IndianRupee } from 'lucide-react';

interface Workshop {
  id: number;
  title: string;
  company: string;
  date: string;
  time: string;
  mode: string;
  location?: string;
  price: number;
  seats: number;
  registeredSeats: number;
  registrationMode: 'automated' | 'manual';
  image: string;
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

  const generateMeetLink = () => {
    const randomString = (length: number) => Math.random().toString(36).substring(2, 2 + length);
    return `https://meet.google.com/${randomString(3)}-${randomString(4)}-${randomString(3)}`;
  };

  const handleRegister = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const registrationData = {
        reason: workshop.registrationMode === 'manual' ? reason : '',
        paymentScreenshot: paymentScreenshot,
        meetLink: workshop.mode === 'Online' && workshop.registrationMode === 'automated' ? generateMeetLink() : null
      };

      onRegister(workshop.id, registrationData);
      
      if (workshop.registrationMode === 'automated') {
        toast({
          title: "Registration Successful! 🎉",
          description: workshop.mode === 'Online' 
            ? "Check your dashboard for the Google Meet link!" 
            : "You're all set for the workshop!",
        });
      } else {
        toast({
          title: "Request Submitted! 📋",
          description: "Your registration request has been sent for approval.",
        });
      }
      
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Register for Workshop</span>
            <Badge variant={workshop.registrationMode === 'automated' ? 'default' : 'secondary'}>
              {workshop.registrationMode === 'automated' ? 'Instant' : 'Manual Approval'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workshop Details */}
          <div className="flex space-x-4">
            <img 
              src={workshop.image} 
              alt={workshop.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{workshop.title}</h3>
              <p className="text-gray-600">{workshop.company}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{workshop.time}</span>
                </div>
                {workshop.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{workshop.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Availability & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span className="font-medium">Available Seats</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{availableSeats}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Price</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {workshop.price === 0 ? 'FREE' : `₹${workshop.price}`}
              </p>
            </div>
          </div>

          {/* Manual Registration Reason */}
          {workshop.registrationMode === 'manual' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Why do you want to join this workshop? *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us about your interest and goals..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>
          )}

          {/* Payment Upload for Paid Workshops */}
          {isPaid && workshop.registrationMode === 'automated' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload Payment Screenshot (UPI) *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                  className="hidden"
                  id="payment-upload"
                />
                <label htmlFor="payment-upload" className="cursor-pointer">
                  <span className="text-primary-600 font-medium">Click to upload</span>
                  <span className="text-gray-500"> or drag and drop</span>
                </label>
                {paymentScreenshot && (
                  <p className="text-green-600 mt-2">✓ {paymentScreenshot.name}</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleRegister}
              disabled={loading || availableSeats === 0 || 
                (workshop.registrationMode === 'manual' && !reason.trim()) ||
                (isPaid && workshop.registrationMode === 'automated' && !paymentScreenshot)}
              className="flex-1"
            >
              {loading ? 'Registering...' : 
               workshop.registrationMode === 'automated' ? 'Confirm Registration' : 'Submit Request'}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>

          {availableSeats === 0 && (
            <p className="text-red-600 text-center font-medium">
              This workshop is fully booked
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkshopRegistrationModal;
