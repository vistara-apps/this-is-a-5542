import React from 'react';
import { MessageCircle, Star, User } from 'lucide-react';

export function ContactRow({ contact, isPrioritized }) {
  const priorityColor = contact.priorityScore > 80 ? 'text-green-400' : 
                       contact.priorityScore > 60 ? 'text-yellow-400' : 'text-gray-400';

  return (
    <div className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-white" />
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
          <p className="text-textSecondary text-sm">@{contact.farcasterUserId}</p>
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
          <button className="p-2 text-textSecondary hover:text-textPrimary hover:bg-gray-700 rounded-lg transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}