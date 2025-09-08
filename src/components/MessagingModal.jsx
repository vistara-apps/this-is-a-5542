import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import { generateMessageSuggestions } from '../services/aiService';
import { sendDirectCast } from '../services/farcasterService';

export const MessagingModal = ({ contact, isOpen, onClose, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (isOpen && contact) {
      loadMessageSuggestions();
    }
  }, [isOpen, contact]);

  const loadMessageSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const result = await generateMessageSuggestions(contact, {
        context: 'direct_message',
        platform: 'farcaster'
      });
      setSuggestions(result.suggestions || []);
    } catch (error) {
      console.error('Error loading message suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      // In a real implementation, you would need the user's signer UUID
      // For now, we'll simulate the message sending
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onSendMessage?.(contact, message);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleUseSuggestion = (suggestion) => {
    setMessage(suggestion.message);
    setShowSuggestions(false);
  };

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {contact.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-textPrimary">
                Message {contact.displayName}
              </h3>
              <p className="text-sm text-textSecondary">
                {contact.relationship || 'Connection'} • Farcaster
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* AI Suggestions Toggle */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-textPrimary">Compose Message</h4>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="flex items-center space-x-2 text-sm text-accent hover:text-accent/80 transition-colors"
              disabled={isLoadingSuggestions}
            >
              {isLoadingSuggestions ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              <span>AI Suggestions</span>
            </button>
          </div>

          {/* AI Suggestions */}
          {showSuggestions && (
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-textSecondary">
                Suggested Messages:
              </h5>
              {isLoadingSuggestions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-accent" />
                </div>
              ) : (
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 bg-bg rounded-lg border border-gray-700 hover:border-accent/50 transition-colors cursor-pointer"
                      onClick={() => handleUseSuggestion(suggestion)}
                    >
                      <p className="text-sm text-textPrimary mb-1">
                        {suggestion.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-textSecondary capitalize">
                          {suggestion.tone} tone
                        </span>
                        <span className="text-xs text-accent">Click to use</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Message Input */}
          <div className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Write a message to ${contact.displayName}...`}
              className="w-full h-32 p-3 bg-bg border border-gray-700 rounded-lg text-textPrimary placeholder-textSecondary resize-none focus:outline-none focus:border-accent transition-colors"
              maxLength={280} // Farcaster character limit
            />
            <div className="flex items-center justify-between text-xs text-textSecondary">
              <span>{message.length}/280 characters</span>
              <span>Messages are sent via Farcaster</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-textSecondary hover:text-textPrimary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
              className="flex items-center space-x-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              <span>{isSending ? 'Sending...' : 'Send Message'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
