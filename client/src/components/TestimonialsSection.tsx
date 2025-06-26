import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Developer",
      company: "Flipkart",
      content: "The React workshop transformed my development skills. The hands-on approach and expert guidance were exceptional! I was able to implement advanced patterns in my projects immediately.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8ab?w=80&h=80&fit=crop&crop=face",
      workshop: "Advanced React Development"
    },
    {
      name: "Rajesh Kumar",
      role: "Marketing Manager",
      company: "Zomato",
      content: "WorkshopWise connected me with industry leaders. The digital marketing masterclass boosted our campaign ROI by 300%! The practical strategies were game-changing.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      workshop: "Digital Marketing Masterclass"
    },
    {
      name: "Sneha Patel",
      role: "Data Analyst",
      company: "Swiggy",
      content: "The data science workshop was incredibly comprehensive. I landed my dream job within a month of completion! The instructor's real-world experience made all the difference.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      workshop: "Data Science with Python"
    },
    {
      name: "Arjun Singh",
      role: "Product Manager",
      company: "Paytm",
      content: "The product management workshop gave me frameworks I use daily. The case studies from real companies were invaluable for understanding the PM role better.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      workshop: "Product Management Fundamentals"
    },
    {
      name: "Kavya Reddy",
      role: "UX Designer",
      company: "Adobe",
      content: "Learning design thinking through WorkshopWise was transformative. The mentor feedback and peer collaboration elevated my design process significantly.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
      workshop: "UX Design Masterclass"
    },
    {
      name: "Vikram Gupta",
      role: "DevOps Engineer",
      company: "Microsoft",
      content: "The cloud architecture workshop was exactly what I needed to advance my career. Now I'm leading our company's migration to microservices architecture.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
      workshop: "Cloud Architecture & DevOps"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-blue-100 text-blue-800 border-0 px-4 py-2">
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Hear from our{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] bg-clip-text text-transparent">
              successful learners
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their careers through our workshops. 
            See how they're applying their new skills in top companies.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white relative overflow-hidden">
              {/* Quote decoration */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="h-8 w-8 text-purple-600" />
              </div>
              
              <CardContent className="p-6 space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                {/* Workshop Badge */}
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  {testimonial.workshop}
                </Badge>

                {/* Profile */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-purple-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "95%", label: "Success Rate", subtitle: "Learners achieve their goals" },
            { value: "4.9/5", label: "Average Rating", subtitle: "Based on 10,000+ reviews" },
            { value: "300+", label: "Career Transitions", subtitle: "People changed careers" },
            { value: "85%", label: "Salary Increase", subtitle: "Average after completion" }
          ].map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="font-semibold text-gray-900">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;