import React, { useState } from 'react';
import { Plus, FolderOpen, Users, X } from 'lucide-react';

export function ContactGroups({ groups, selectedGroup, onSelectGroup, contacts, onCreateGroup }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedContacts.length === 0) return;
    
    await onCreateGroup(groupName, selectedContacts);
    setShowCreateForm(false);
    setGroupName('');
    setSelectedContacts([]);
  };

  const toggleContactSelection = (contact) => {
    setSelectedContacts(prev => 
      prev.find(c => c.contactId === contact.contactId)
        ? prev.filter(c => c.contactId !== contact.contactId)
        : [...prev, contact]
    );
  };

  return (
    <div className="bg-surface rounded-lg shadow-card border border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-textPrimary">Contact Groups</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="p-2 text-textSecondary hover:text-textPrimary hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* All Contacts */}
      <div className="p-2">
        <button
          onClick={() => onSelectGroup(null)}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            !selectedGroup ? 'bg-primary text-white' : 'text-textSecondary hover:bg-gray-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="font-medium">All Contacts</span>
          <span className="ml-auto text-sm">({contacts.length})</span>
        </button>
      </div>

      {/* Groups List */}
      <div className="divide-y divide-gray-800">
        {groups.map((group) => (
          <div key={group.groupId} className="p-2">
            <button
              onClick={() => onSelectGroup(group)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                selectedGroup?.groupId === group.groupId 
                  ? 'bg-primary text-white' 
                  : 'text-textSecondary hover:bg-gray-800'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span className="font-medium truncate">{group.name}</span>
              <span className="ml-auto text-sm">({group.contacts.length})</span>
            </button>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-textPrimary">Create Group ($0.05)</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-textSecondary hover:text-textPrimary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full px-3 py-2 bg-bg border border-gray-700 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Select Contacts ({selectedContacts.length})
                </label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {contacts.map((contact) => (
                    <label key={contact.contactId} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedContacts.some(c => c.contactId === contact.contactId)}
                        onChange={() => toggleContactSelection(contact)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-textPrimary text-sm">{contact.displayName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-textPrimary rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim() || selectedContacts.length === 0}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}