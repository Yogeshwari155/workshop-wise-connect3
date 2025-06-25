
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, MapPin, IndianRupee, Users, Clock, Star, Search, Filter } from 'lucide-react';

const Workshops = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');

  const workshops = [
    {
      id: 1,
      title: "Advanced React Development",
      company: "TechCorp Solutions",
      price: 2500,
      originalPrice: 3500,
      mode: "Online",
      duration: "3 days",
      seats: 25,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
      tags: ["React", "JavaScript", "Frontend"],
      isFree: false,
      date: "15 Jan 2025"
    },
    {
      id: 2,
      title: "Digital Marketing Masterclass",
      company: "Growth Academy",
      price: 0,
      mode: "Hybrid",
      duration: "2 days",
      seats: 50,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
      tags: ["Marketing", "Strategy", "Business"],
      isFree: true,
      date: "20 Jan 2025"
    },
    {
      id: 3,
      title: "Data Science with Python",
      company: "DataMinds Inc",
      price: 1800,
      mode: "Offline",
      location: "Bangalore",
      duration: "5 days",
      seats: 30,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
      tags: ["Python", "Data Science", "Analytics"],
      isFree: false,
      date: "25 Jan 2025"
    },
    {
      id: 4,
      title: "UI/UX Design Bootcamp",
      company: "Design Studio",
      price: 3200,
      mode: "Online",
      duration: "4 days",
      seats: 40,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop",
      tags: ["Design", "UI/UX", "Figma"],
      isFree: false,
      date: "30 Jan 2025"
    }
  ];

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && workshop.isFree) ||
                        (priceFilter === 'paid' && !workshop.isFree);
    
    const matchesMode = modeFilter === 'all' || workshop.mode.toLowerCase() === modeFilter;
    
    return matchesSearch && matchesPrice && matchesMode;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900">
            Discover Amazing Workshops
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn new skills from industry experts and advance your career
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search workshops, companies, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredWorkshops.length} of {workshops.length} workshops
          </p>
        </div>

        {/* Workshop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkshops.map((workshop) => (
            <Card key={workshop.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-xl overflow-hidden">
              <div className="relative overflow-hidden">
                <img 
                  src={workshop.image} 
                  alt={workshop.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {workshop.isFree ? (
                    <Badge className="bg-green-500 text-white border-0">FREE</Badge>
                  ) : (
                    <Badge className="bg-primary-500 text-white border-0">PAID</Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    {workshop.mode}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{workshop.rating}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {workshop.title}
                  </h3>
                  <p className="text-gray-600 font-medium">{workshop.company}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {workshop.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{workshop.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{workshop.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{workshop.seats} seats</span>
                  </div>
                  {workshop.mode === "Offline" && workshop.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{workshop.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    {workshop.isFree ? (
                      <span className="text-2xl font-bold text-green-600">FREE</span>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <IndianRupee className="h-5 w-5 text-gray-900" />
                        <span className="text-2xl font-bold text-gray-900">{workshop.price}</span>
                        {workshop.originalPrice && (
                          <span className="text-lg text-gray-500 line-through ml-2">₹{workshop.originalPrice}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <Link to={`/workshop/${workshop.id}`}>
                    <Button size="sm" className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWorkshops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No workshops found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Workshops;
