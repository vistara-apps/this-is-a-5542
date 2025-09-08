import React from 'react';
import { MessageCircle, Star, User, Clock, Users, MoreHorizontal } from 'lucide-react';

export function ContactRow({ contact, isPrioritized, onMessage, onToggleFavorite }) {
  const priorityColor = contact.priorityScore > 80 ? 'text-green-400' : 
                       contact.priorityScore > 60 ? 'text-yellow-400' : 'text-gray-400';

  const getRelationshipColor = (relationship) => {
    switch (relationship) {
      case 'mutual': return 'text-green-400';
      case 'following': return 'text-blue-400';
      case 'follower': return 'text-purple-400';
      default: return 'text-textSecondary';
    }
  };

  const formatLastInteraction = (lastInteraction) => {
    if (!lastInteraction) return null;
    const date = new Date(lastInteraction);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}m ago`;
  };

  return (
    <div className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          {isPrioritized && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
              <Star size={8} className="text-white fill-current" />
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-textPrimary font-medium truncate">{contact.displayName}</h3>
            {isPrioritized && (
              <div className="flex items-center space-x-1">
                <Star className={`w-4 h-4 ${priorityColor}`} />
                <span className={`text-xs ${priorityColor}`}>{contact.priorityScore}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 text-sm mt-1">
            <p className="text-textSecondary">@{contact.farcasterUserId}</p>
            <span className={`capitalize ${getRelationshipColor(contact.relationship)}`}>
              {contact.relationship || 'connection'}
            </span>
            
            {contact.lastInteraction && (
              <div className="flex items-center space-x-1">
                <Clock size={12} className="text-textSecondary" />
                <span className="text-textSecondary">
                  {formatLastInteraction(contact.lastInteraction)}
                </span>
              </div>
            )}
            
            {contact.mutualConnections > 0 && (
              <div className="flex items-center space-x-1">
                <Users size={12} className="text-textSecondary" />
                <span className="text-textSecondary">{contact.mutualConnections}</span>
              </div>
            )}
          </div>

          {contact.tags && contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {contact.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-textSecondary text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onMessage?.(contact)}
            className="p-2 text-textSecondary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
            title="Send message"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => onToggleFavorite?.(contact)}
            className="p-2 text-textSecondary hover:text-textPrimary hover:bg-gray-700 rounded-lg transition-colors"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
