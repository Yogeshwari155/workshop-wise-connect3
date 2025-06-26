import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  IndianRupee, 
  Users, 
  Star, 
  Heart,
  BookOpen,
  Globe,
  Video
} from 'lucide-react';

interface Workshop {
  id: number;
  title: string;
  enterprise?: {
    companyName: string;
  };
  date: string;
  time: string;
  mode: string;
  location?: string;
  price: number;
  seats: number;
  registeredSeats: number;
  registrationMode: 'automated' | 'manual';
  image?: string;
  isFree: boolean;
  description?: string;
  tags?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
}

interface ModernWorkshopCardProps {
  workshop: Workshop;
  showFavorite?: boolean;
  isCompact?: boolean;
}

const ModernWorkshopCard: React.FC<ModernWorkshopCardProps> = ({ 
  workshop, 
  showFavorite = false,
  isCompact = false 
}) => {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'online': return <Globe className="h-4 w-4" />;
      case 'offline': return <MapPin className="h-4 w-4" />;
      case 'hybrid': return <Video className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const availableSeats = workshop.seats - workshop.registeredSeats;
  const isAlmostFull = availableSeats <= 5;
  const isFull = availableSeats <= 0;

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-xl overflow-hidden relative">
      {/* Favorite button */}
      {showFavorite && (
        <button className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      )}

      {/* Image */}
      <div className="relative overflow-hidden">
        <img 
          src={workshop.image || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'} 
          alt={workshop.title}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            isCompact ? 'h-32' : 'h-48'
          }`}
        />
        
        {/* Overlay badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className={workshop.isFree ? "bg-green-500 text-white border-0" : "bg-[#8B5CF6] text-white border-0"}>
            {workshop.isFree ? 'FREE' : 'PAID'}
          </Badge>
          {workshop.difficulty && (
            <Badge className={`${getDifficultyColor(workshop.difficulty)} border-0`}>
              {workshop.difficulty}
            </Badge>
          )}
        </div>

        {/* Mode indicator */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-700 border-0">
            <span className="flex items-center space-x-1">
              {getModeIcon(workshop.mode)}
              <span className="capitalize">{workshop.mode}</span>
            </span>
          </Badge>
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold">4.9</span>
          </div>
        </div>

        {/* Availability warning */}
        {(isAlmostFull || isFull) && (
          <div className="absolute bottom-4 right-4">
            <Badge className={isFull ? "bg-red-500 text-white" : "bg-orange-500 text-white"}>
              {isFull ? 'Full' : `${availableSeats} left`}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className={`space-y-4 ${isCompact ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="space-y-2">
          <h3 className={`font-bold text-gray-900 line-clamp-2 ${isCompact ? 'text-lg' : 'text-xl'}`}>
            {workshop.title}
          </h3>
          <p className="text-gray-600 font-medium text-sm">
            {workshop.enterprise?.companyName || 'Expert Instructor'}
          </p>
          {!isCompact && workshop.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{workshop.description}</p>
          )}
        </div>

        {/* Tags */}
        {!isCompact && workshop.tags && (
          <div className="flex flex-wrap gap-1">
            {workshop.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Workshop details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(workshop.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{workshop.time} {workshop.duration && `• ${workshop.duration}`}</span>
          </div>
          {workshop.mode === 'offline' && workshop.location && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{workshop.location}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>{workshop.registeredSeats}/{workshop.seats} enrolled</span>
            </div>
            <div className="flex items-center space-x-2">
              <IndianRupee className="h-4 w-4 text-gray-600" />
              <span className={`font-bold ${isCompact ? 'text-lg' : 'text-xl'} text-[#8B5CF6]`}>
                {workshop.isFree ? 'Free' : `₹${workshop.price?.toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar for enrollment */}
        {!isCompact && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Enrollment Progress</span>
              <span>{Math.round((workshop.registeredSeats / workshop.seats) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((workshop.registeredSeats / workshop.seats) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Action button */}
        <Link to={`/workshop/${workshop.id}`}>
          <Button 
            className={`w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-purple-600 hover:to-purple-700 text-white transition-all duration-300 ${
              isFull ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
            disabled={isFull}
          >
            {isFull ? 'Workshop Full' : 'View Details & Register'}
          </Button>
        </Link>

        {/* Registration mode indicator */}
        {!isCompact && (
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              {workshop.registrationMode === 'automated' ? 'Instant Confirmation' : 'Manual Approval'}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModernWorkshopCard;