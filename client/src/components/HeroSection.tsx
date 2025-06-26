import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, CheckCircle, Star, Users, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  const stats = [
    { value: "10,000+", label: "Happy Learners" },
    { value: "500+", label: "Expert Workshops" },
    { value: "200+", label: "Partner Companies" },
    { value: "95%", label: "Success Rate" }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white border-0 px-4 py-2 text-sm font-medium">
                Transform Your Career Today
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Learn from the{' '}
                <span className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] bg-clip-text text-transparent">
                  Best Minds
                </span>{' '}
                in Industry
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Join thousands of professionals mastering new skills through hands-on workshops 
                led by industry experts from top companies like Google, Meta, and Amazon.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/workshops">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto"
                >
                  Explore Workshops
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-purple-50 w-full sm:w-auto"
                >
                  Host a Workshop
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
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
                <span>Certificate Included</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
              {/* Mock Workshop Card */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">LIVE</Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                </div>
                
                <div className="w-full h-32 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-semibold">React Masterclass</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Advanced React Development</h3>
                  <p className="text-sm text-gray-600">Build production-ready apps with React 18</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>124 enrolled</span>
                    </div>
                    <div className="text-lg font-bold text-[#8B5CF6]">₹2,999</div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-purple-600 hover:to-purple-700 text-white">
                    Register Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 bg-white rounded-full p-3 shadow-lg">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-3 shadow-lg">
              <Star className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;