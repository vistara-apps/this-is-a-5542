import React from 'react';
import { Search, Zap, Users, MessageCircle } from 'lucide-react';
import { ContactRow } from './ContactRow';

export function ContactList({ 
  contacts, 
  searchTerm, 
  onSearchChange, 
  onPrioritizeContacts, 
  hasPaidForPrioritization,
  selectedGroup 
}) {
  return (
    <div className="bg-surface rounded-lg shadow-card border border-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-textPrimary">
              {selectedGroup ? `${selectedGroup.name} Contacts` : 'All Contacts'}
            </h2>
            <p className="text-textSecondary text-sm mt-1">
              {contacts.length} contacts {selectedGroup ? 'in group' : 'available'}
            </p>
          </div>
          
          <button
            onClick={onPrioritizeContacts}
            disabled={hasPaidForPrioritization}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              hasPaidForPrioritization
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-primary hover:bg-blue-600 text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{hasPaidForPrioritization ? 'AI Prioritized' : 'AI Prioritize ($0.10)'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg border border-gray-700 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="divide-y divide-gray-800">
        {contacts.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-textSecondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-textPrimary mb-2">No contacts found</h3>
            <p className="text-textSecondary">
              {searchTerm ? 'Try adjusting your search terms' : 'Connect your wallet to load contacts'}
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactRow 
              key={contact.contactId} 
              contact={contact} 
              isPrioritized={hasPaidForPrioritization}
            />
          ))
        )}
      </div>
    </div>
  );
}