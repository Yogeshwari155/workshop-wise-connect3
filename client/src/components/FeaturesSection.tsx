import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  Calendar, 
  Shield, 
  Award, 
  Globe, 
  Clock, 
  BookOpen, 
  Zap,
  CheckCircle2
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from industry professionals working at top companies",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Choose from live sessions or self-paced learning options",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security with encrypted data protection",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Get verified certificates upon successful completion",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with learners and professionals worldwide",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Clock,
      title: "Lifetime Access",
      description: "Access workshop materials and recordings anytime",
      gradient: "from-teal-500 to-blue-500"
    }
  ];

  const benefits = [
    "Join live interactive sessions with Q&A",
    "Access to exclusive community forums",
    "1-on-1 mentorship opportunities",
    "Project-based learning approach",
    "Career guidance and job placement support",
    "Regular skill assessments and feedback"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-purple-100 text-purple-800 border-0 px-4 py-2">
            Why Choose WorkshopWise
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] bg-clip-text text-transparent">
              accelerate your career
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides comprehensive learning experiences designed by industry experts 
            to help you master in-demand skills and advance your professional journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-white">
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} p-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Transform your skills with our comprehensive learning platform
            </h3>
            <p className="text-lg text-gray-600">
              Join thousands of professionals who have successfully upgraded their skills 
              and advanced their careers through our expert-led workshops.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Learning Path Visualization */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Your Learning Journey</h4>
                  <p className="text-sm text-gray-600">From beginner to expert in 4 simple steps</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { step: 1, title: "Choose Workshop", icon: BookOpen },
                    { step: 2, title: "Join Live Session", icon: Users },
                    { step: 3, title: "Practice Projects", icon: Zap },
                    { step: 4, title: "Get Certified", icon: Award }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{item.title}</span>
                      </div>
                      <item.icon className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;