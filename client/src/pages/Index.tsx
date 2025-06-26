import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, IndianRupee, Users, Award, Clock, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { useWorkshops } from '../hooks/useWorkshops';

const Index = () => {
  const { data: allWorkshops = [] } = useWorkshops();
  const featuredWorkshops = allWorkshops.slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Featured Workshops */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 border-0 px-4 py-2 mb-4">
              Popular Workshops
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Learning Experiences
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular workshops designed by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWorkshops.map((workshop: any) => (
              <Card key={workshop.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-xl overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={workshop.image || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'} 
                    alt={workshop.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={workshop.isFree ? "bg-green-500 text-white" : "bg-[#8B5CF6] text-white"}>
                      {workshop.isFree ? 'FREE' : 'PAID'}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">4.9</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">{workshop.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 font-medium">{workshop.enterprise?.companyName || 'Expert Instructor'}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(workshop.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{workshop.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{workshop.registeredSeats}/{workshop.seats} registered</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <IndianRupee className="h-4 w-4" />
                      <span>{workshop.isFree ? 'Free' : `₹${workshop.price?.toLocaleString()}`}</span>
                    </div>
                  </div>

                  <Link to={`/workshop/${workshop.id}`}>
                    <Button className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-purple-600 hover:to-purple-700">
                      View Details & Register
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/workshops">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-purple-50">
                View All Workshops
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already advanced their careers through our expert-led workshops.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/workshops">
              <Button size="lg" className="bg-white text-[#8B5CF6] hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl">
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#8B5CF6] px-8 py-4 text-lg font-semibold rounded-xl">
                Become an Instructor
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;