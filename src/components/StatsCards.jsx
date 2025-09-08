import React from 'react';
import { Users, FolderOpen, Zap, TrendingUp } from 'lucide-react';

export function StatsCards({ totalContacts, totalGroups, hasPaidForPrioritization }) {
  const stats = [
    {
      title: 'Total Contacts',
      value: totalContacts,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      title: 'Contact Groups',
      value: totalGroups,
      icon: FolderOpen,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      title: 'AI Prioritized',
      value: hasPaidForPrioritization ? 'Active' : 'Inactive',
      icon: Zap,
      color: hasPaidForPrioritization ? 'text-yellow-400' : 'text-gray-400',
      bgColor: hasPaidForPrioritization ? 'bg-yellow-400/10' : 'bg-gray-400/10'
    },
    {
      title: 'Engagement',
      value: '89%',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-surface rounded-lg p-6 shadow-card border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-textSecondary text-sm font-medium">{stat.title}</p>
                <p className="text-textPrimary text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}