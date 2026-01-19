import React, { useState } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
// import type { User } from '../../types/api';

// Mock data for mentors
const MENTORS = [
  {
    id: '1',
    name: 'Sarah Drasner',
    role: 'Senior Engineering Manager',
    company: 'Google',
    tags: ['Frontend', 'Vue', 'React', 'Management'],
    available: true,
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: '2',
    name: 'Kent C. Dodds',
    role: 'Full Stack Engineer',
    company: 'Remix',
    tags: ['React', 'Testing', 'JavaScript', 'Node.js'],
    available: false,
    avatar: 'https://i.pravatar.cc/150?u=kent'
  },
  {
    id: '3',
    name: 'Dan Abramov',
    role: 'Core Team',
    company: 'Meta',
    tags: ['React', 'Redux', 'System Design'],
    available: true,
    avatar: 'https://i.pravatar.cc/150?u=dan'
  }
];

const Mentor: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filter, setFilter] = useState('');

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">Find Your Mentor</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with world-class developers to accelerate your learning and career growth.
          </p>
        </div>

        {/* Filters - Simple implementation for now */}
        <div className="flex justify-center pb-8">
            <input 
                type="text" 
                placeholder="Search mentors by name or skill..." 
                className="w-full max-w-md px-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENTORS.filter(m => 
            m.name.toLowerCase().includes(filter.toLowerCase()) || 
            m.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
          ).map((mentor) => (
            <Card key={mentor.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="p-4 flex flex-col items-center text-center flex-grow">
                <img 
                    src={mentor.avatar} 
                    alt={mentor.name} 
                    className="w-24 h-24 rounded-full mb-4 border-4 border-gray-50 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
                <p className="text-indigo-600 font-medium">{mentor.role}</p>
                <p className="text-gray-500 text-sm mb-4">at {mentor.company}</p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {mentor.tags.map(tag => (
                    <Badge key={tag} variant="default" className="bg-gray-100 text-gray-600 border-none">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-100 p-4 bg-gray-50/50 mt-auto">
                <Button 
                    variant={mentor.available ? 'primary' : 'secondary'} 
                    className="w-full"
                    disabled={!mentor.available}
                >
                    {mentor.available ? 'Book Session' : 'Currently Unavailable'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Mentor;
