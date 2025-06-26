
import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, Target, Award, Zap, Heart, Globe } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Arjun Patel",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Former tech lead at major startup, passionate about education and skill development."
    },
    {
      name: "Sneha Reddy",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b8ab?w=300&h=300&fit=crop&crop=face",
      bio: "Expert in scaling educational platforms with 8+ years in EdTech industry."
    },
    {
      name: "Vikram Singh",
      role: "Head of Technology",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Full-stack engineer focused on creating seamless learning experiences."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Learning",
      description: "We believe everyone deserves access to quality education and skill development opportunities."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building strong connections between learners, instructors, and industry professionals."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly evolving our platform to meet the changing needs of the modern workforce."
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making professional development accessible to everyone, regardless of background or location."
    }
  ];

  const stats = [
    { value: "10,000+", label: "Active Learners" },
    { value: "500+", label: "Workshops Hosted" },
    { value: "200+", label: "Partner Companies" },
    { value: "50+", label: "Cities Covered" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge className="bg-gradient-to-r from-[#7C3AED] to-[#7C3AED] text-white border-0 px-6 py-3 text-lg">
              About WorkshopWise
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 leading-tight">
              Empowering Careers Through{' '}
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#7C3AED] bg-clip-text text-transparent">
                Expert Learning
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              WorkshopWise is India's premier platform connecting professionals with industry-led workshops. 
              We bridge the gap between theoretical knowledge and practical skills needed in today's fast-evolving workplace.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-[#7C3AED]" />
                <h2 className="text-3xl font-display font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To democratize professional learning by connecting ambitious individuals with industry experts, 
                creating a ecosystem where knowledge flows freely and careers flourish.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We envision a world where geographical boundaries don't limit learning opportunities, 
                and where every professional has access to cutting-edge skills and industry insights.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                alt="Team collaboration" 
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-[#7C3AED]" />
                  <div>
                    <div className="font-bold text-gray-900">95%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at WorkshopWise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="bg-gradient-to-r from-[#7C3AED] to-[#7C3AED] w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals working to revolutionize professional learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardContent className="p-8 space-y-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                  <div>
                    <h3 className="text-xl font-display font-semibold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-[#7C3AED] font-medium">{member.role}</p>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed text-left">
              <p>
                WorkshopWise was born from a simple observation: while India's tech and business landscape 
                was rapidly evolving, traditional education wasn't keeping pace with industry needs. 
                Professionals were struggling to find practical, hands-on learning opportunities 
                led by actual industry practitioners.
              </p>
              <p>
                Founded in 2024 by a team of educators and technologists, WorkshopWise started as a 
                weekend project to connect a few software developers with React experts. The response 
                was overwhelming – within months, we had hundreds of professionals seeking similar 
                learning opportunities across various domains.
              </p>
              <p>
                Today, WorkshopWise has grown into India's largest platform for professional workshops, 
                partnering with 200+ companies and serving over 10,000 learners. But our mission 
                remains the same: to make high-quality, practical learning accessible to every 
                professional, regardless of their background or location.
              </p>
              <p>
                We're just getting started. As we expand across new cities and domains, we remain 
                committed to our core belief: that the best learning happens when industry experts 
                share their real-world knowledge with passionate learners.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
