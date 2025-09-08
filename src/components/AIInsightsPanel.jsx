import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, MessageSquare, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { analyzeContactPriority, suggestContactGroups } from '../services/aiService';

export const AIInsightsPanel = ({ contacts, onApplyPrioritization, onCreateSuggestedGroup }) => {
  const [insights, setInsights] = useState(null);
  const [groupSuggestions, setGroupSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('priority');

  useEffect(() => {
    if (contacts.length > 0) {
      loadInsights();
    }
  }, [contacts]);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const [priorityResult, groupResult] = await Promise.all([
        analyzeContactPriority(contacts),
        suggestContactGroups(contacts)
      ]);
      
      setInsights(priorityResult);
      setGroupSuggestions(groupResult.suggestedGroups || []);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPrioritization = () => {
    if (insights?.prioritizedContacts) {
      onApplyPrioritization(insights.prioritizedContacts);
    }
  };

  const handleCreateGroup = (suggestion) => {
    const selectedContacts = contacts.filter(contact => 
      suggestion.suggestedContacts.includes(contact.contactId)
    );
    onCreateSuggestedGroup(suggestion.name, selectedContacts, suggestion.description);
  };

  const getInsightStats = () => {
    if (!contacts.length) return null;
    
    const highPriorityCount = contacts.filter(c => (c.priorityScore || 0) > 70).length;
    const mutualConnections = contacts.filter(c => c.relationship === 'mutual').length;
    const recentInteractions = contacts.filter(c => {
      if (!c.lastInteraction) return false;
      const daysSince = (Date.now() - new Date(c.lastInteraction)) / (1000 * 60 * 60 * 24);
      return daysSince < 7;
    }).length;

    return {
      highPriorityCount,
      mutualConnections,
      recentInteractions,
      totalContacts: contacts.length
    };
  };

  const stats = getInsightStats();

  return (
    <div className="bg-surface rounded-lg border border-gray-700">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-textPrimary">AI Insights</h3>
            <p className="text-sm text-textSecondary">Smart contact analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isLoading && <Loader2 size={16} className="animate-spin text-accent" />}
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} className="text-accent" />
                <span className="text-sm text-textSecondary">High Priority</span>
              </div>
              <p className="text-lg font-semibold text-textPrimary">{stats.highPriorityCount}</p>
            </div>
            <div className="bg-bg rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-blue-400" />
                <span className="text-sm text-textSecondary">Mutual</span>
              </div>
              <p className="text-lg font-semibold text-textPrimary">{stats.mutualConnections}</p>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-700">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('priority')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'priority'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              Priority Analysis
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'groups'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              Group Suggestions
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'priority' && (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-accent" />
                  </div>
                ) : insights ? (
                  <>
                    <div className="space-y-3">
                      <h4 className="font-medium text-textPrimary">Analysis Summary</h4>
                      <p className="text-sm text-textSecondary">{insights.summary}</p>
                    </div>

                    {insights.prioritizedContacts?.slice(0, 5).length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-textPrimary">Top Priority Contacts</h4>
                        <div className="space-y-2">
                          {insights.prioritizedContacts.slice(0, 5).map((item, index) => {
                            const contact = contacts.find(c => c.contactId === item.contactId);
                            if (!contact) return null;
                            
                            return (
                              <div key={item.contactId} className="flex items-center justify-between p-2 bg-bg rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <span className="text-xs font-medium text-accent">#{index + 1}</span>
                                  <div>
                                    <p className="text-sm font-medium text-textPrimary">
                                      {contact.displayName}
                                    </p>
                                    <p className="text-xs text-textSecondary">
                                      Score: {item.priorityScore}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-accent rounded-full"
                                    style={{ width: `${item.priorityScore}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleApplyPrioritization}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      <Sparkles size={16} />
                      <span>Apply AI Prioritization</span>
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-textSecondary">No insights available yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'groups' && (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-accent" />
                  </div>
                ) : groupSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-textPrimary">Suggested Groups</h4>
                    <div className="space-y-3">
                      {groupSuggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 bg-bg rounded-lg border border-gray-700">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-textPrimary">{suggestion.name}</h5>
                              <p className="text-xs text-textSecondary capitalize">
                                {suggestion.groupType} group
                              </p>
                            </div>
                            <span className="text-xs text-accent">
                              {suggestion.suggestedContacts.length} contacts
                            </span>
                          </div>
                          <p className="text-sm text-textSecondary mb-3">
                            {suggestion.description}
                          </p>
                          <button
                            onClick={() => handleCreateGroup(suggestion)}
                            className="w-full px-3 py-1.5 bg-accent/20 text-accent rounded text-sm hover:bg-accent/30 transition-colors"
                          >
                            Create Group
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-textSecondary">No group suggestions available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
