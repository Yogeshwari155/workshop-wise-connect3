
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, IndianRupee, Users, Award, Clock, Star, ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const featuredWorkshops = [
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
      isFree: false
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
      isFree: true
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
      isFree: false
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Developer",
      company: "Flipkart",
      content: "The React workshop transformed my development skills. The hands-on approach and expert guidance were exceptional!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8ab?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Rajesh Kumar",
      role: "Marketing Manager",
      company: "Zomato",
      content: "WorkshopWise connected me with industry leaders. The digital marketing masterclass boosted our campaign ROI by 300%!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Sneha Patel",
      role: "Data Analyst",
      company: "Swiggy",
      content: "The data science workshop was incredibly comprehensive. I landed my dream job within a month of completion!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Happy Learners", icon: Users },
    { value: "500+", label: "Expert Workshops", icon: Award },
    { value: "200+", label: "Partner Companies", icon: Calendar },
    { value: "95%", label: "Success Rate", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 px-4 py-2">
                  🚀 Transform Your Career Today
                </Badge>
                <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 leading-tight">
                  Learn from the{' '}
                  <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                    Best Minds
                  </span>{' '}
                  in Industry
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join thousands of professionals mastering new skills through hands-on workshops 
                  led by industry experts from top companies.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/workshops">
                  <Button size="lg" className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    Explore Workshops
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50">
                    Host a Workshop
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Join Instantly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Expert Instructors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Hands-on Learning</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 animate-bounce-gentle">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop" 
                  alt="Students learning in workshop" 
                  className="w-full h-64 object-cover rounded-xl"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-coral-500 to-accent-500 text-white p-3 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute top-8 -left-6 bg-primary-500 text-white p-4 rounded-xl shadow-lg z-20">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm opacity-90">Active Learners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-display font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Workshops */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 px-4 py-2">
              🔥 Trending Now
            </Badge>
            <h2 className="text-4xl font-display font-bold text-gray-900">
              Featured Workshops
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most popular workshops from industry-leading companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWorkshops.map((workshop) => (
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
                      <Clock className="h-4 w-4" />
                      <span>{workshop.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{workshop.seats} seats</span>
                    </div>
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

          <div className="text-center mt-12">
            <Link to="/workshops">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50">
                View All Workshops
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these three easy steps to begin your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900">
                Browse & Discover
              </h3>
              <p className="text-gray-600">
                Explore hundreds of workshops from top companies. Filter by skills, location, price, and more to find the perfect match.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-coral-500 to-accent-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900">
                Register Instantly
              </h3>
              <p className="text-gray-600">
                Sign up and register for workshops with just a few clicks. Secure your spot and get ready to learn from the best.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-accent-500 to-primary-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900">
                Learn & Grow
              </h3>
              <p className="text-gray-600">
                Attend engaging workshops, network with peers, and gain practical skills that advance your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900">
              What Our Learners Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers through our workshops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-xl rounded-xl p-6">
                <CardContent className="space-y-4 p-0">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-display font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who are already learning and growing with WorkshopWise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/workshops">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl">
                Start Learning Now
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold rounded-xl">
                Become a Host
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
