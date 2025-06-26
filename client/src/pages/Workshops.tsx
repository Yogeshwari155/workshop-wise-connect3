import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ModernWorkshopCard from '../components/ModernWorkshopCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useWorkshops } from '../hooks/useWorkshops';

const Workshops = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Fetch workshops from API - only approved ones
  const { data: workshops = [], isLoading, error } = useWorkshops();

  // Filter workshops - only show approved workshops to users
  const filteredWorkshops = useMemo(() => {
    return workshops
      .filter((workshop: any) => {
        // Only show approved workshops
        if (workshop.status !== 'approved') return false;
        
        // Search filter
        if (searchTerm && !workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !workshop.enterprise?.companyName.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // Price filter
        if (priceFilter === 'free' && !workshop.isFree) return false;
        if (priceFilter === 'paid' && workshop.isFree) return false;
        
        // Mode filter
        if (modeFilter !== 'all' && workshop.mode !== modeFilter) return false;
        
        // Difficulty filter
        if (difficultyFilter !== 'all' && workshop.difficulty !== difficultyFilter) return false;
        
        return true;
      })
      .sort((a: any, b: any) => {
        switch (sortBy) {
          case 'price':
            return (a.price || 0) - (b.price || 0);
          case 'date':
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case 'popularity':
            return b.registeredSeats - a.registeredSeats;
          default:
            return 0;
        }
      });
  }, [workshops, searchTerm, priceFilter, modeFilter, difficultyFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8B5CF6]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Workshops</h2>
            <p className="text-gray-600">Please try again later</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Discover Amazing Workshops
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Learn from industry experts and advance your skills with hands-on workshops
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={modeFilter} onValueChange={setModeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredWorkshops.length} workshop{filteredWorkshops.length !== 1 ? 's' : ''}
            </p>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {filteredWorkshops.filter((w: any) => w.isFree).length} Free Workshops Available
            </Badge>
          </div>
        </div>
      </section>

      {/* Workshop Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* No Workshops Message */}
          {filteredWorkshops.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No workshops found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            </div>
          )}

          {/* Workshop Grid/List */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-6"
          }>
            {filteredWorkshops.map((workshop: any) => (
              <ModernWorkshopCard 
                key={workshop.id} 
                workshop={workshop} 
                showFavorite={true}
                isCompact={viewMode === 'list'}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Workshops;