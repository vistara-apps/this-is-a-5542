import axios from 'axios';

const FARCASTER_HUB_URL = import.meta.env.VITE_FARCASTER_HUB_URL || 'https://hub.farcaster.xyz';
const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY;

// Farcaster Hub API client
const hubClient = axios.create({
  baseURL: FARCASTER_HUB_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Neynar API client (alternative for easier Farcaster integration)
const neynarClient = axios.create({
  baseURL: 'https://api.neynar.com/v2',
  headers: {
    'Content-Type': 'application/json',
    'api_key': NEYNAR_API_KEY,
  },
});

/**
 * Get user profile by FID (Farcaster ID)
 */
export const getUserProfile = async (fid) => {
  try {
    if (NEYNAR_API_KEY) {
      const response = await neynarClient.get(`/farcaster/user?fid=${fid}`);
      return response.data.result.user;
    } else {
      // Fallback to direct hub API
      const response = await hubClient.get(`/v1/userDataByFid?fid=${fid}`);
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Get user's following list
 */
export const getUserFollowing = async (fid, limit = 100) => {
  try {
    if (NEYNAR_API_KEY) {
      const response = await neynarClient.get(`/farcaster/following?fid=${fid}&limit=${limit}`);
      return response.data.result.users;
    } else {
      // Fallback to direct hub API
      const response = await hubClient.get(`/v1/linksByFid?fid=${fid}&link_type=follow`);
      return response.data.messages || [];
    }
  } catch (error) {
    console.error('Error fetching following list:', error);
    throw error;
  }
};

/**
 * Get user's followers list
 */
export const getUserFollowers = async (fid, limit = 100) => {
  try {
    if (NEYNAR_API_KEY) {
      const response = await neynarClient.get(`/farcaster/followers?fid=${fid}&limit=${limit}`);
      return response.data.result.users;
    } else {
      // Fallback to direct hub API
      const response = await hubClient.get(`/v1/linksByTargetFid?target_fid=${fid}&link_type=follow`);
      return response.data.messages || [];
    }
  } catch (error) {
    console.error('Error fetching followers list:', error);
    throw error;
  }
};

/**
 * Get user's casts (posts) for interaction analysis
 */
export const getUserCasts = async (fid, limit = 50) => {
  try {
    if (NEYNAR_API_KEY) {
      const response = await neynarClient.get(`/farcaster/casts?fid=${fid}&limit=${limit}`);
      return response.data.result.casts;
    } else {
      // Fallback to direct hub API
      const response = await hubClient.get(`/v1/castsByFid?fid=${fid}`);
      return response.data.messages || [];
    }
  } catch (error) {
    console.error('Error fetching user casts:', error);
    throw error;
  }
};

/**
 * Send a direct cast (message) to a user
 */
export const sendDirectCast = async (fromFid, toFid, message, signerUuid) => {
  try {
    if (!NEYNAR_API_KEY) {
      throw new Error('Neynar API key required for sending messages');
    }

    const response = await neynarClient.post('/farcaster/cast', {
      signer_uuid: signerUuid,
      text: message,
      parent: null, // Direct cast, no parent
      embeds: [],
      channel_id: null,
    });

    return response.data;
  } catch (error) {
    console.error('Error sending direct cast:', error);
    throw error;
  }
};

/**
 * Get interaction data between two users
 */
export const getInteractionData = async (fid1, fid2) => {
  try {
    // This would analyze casts, likes, recasts between users
    // For now, return mock interaction score
    const interactions = await Promise.all([
      getUserCasts(fid1, 20),
      getUserCasts(fid2, 20)
    ]);

    // Simple interaction scoring based on mutual engagement
    const score = Math.random() * 100; // Mock score for now
    
    return {
      interactionScore: score,
      mutualCasts: 0,
      mutualLikes: 0,
      recentInteraction: new Date(),
    };
  } catch (error) {
    console.error('Error analyzing interactions:', error);
    return {
      interactionScore: 0,
      mutualCasts: 0,
      mutualLikes: 0,
      recentInteraction: null,
    };
  }
};

/**
 * Search for users by username or display name
 */
export const searchUsers = async (query, limit = 20) => {
  try {
    if (NEYNAR_API_KEY) {
      const response = await neynarClient.get(`/farcaster/user/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data.result.users;
    } else {
      // Fallback search implementation
      throw new Error('Search requires Neynar API key');
    }
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

/**
 * Get user's network (following + followers) with interaction data
 */
export const getUserNetwork = async (fid) => {
  try {
    const [following, followers] = await Promise.all([
      getUserFollowing(fid),
      getUserFollowers(fid)
    ]);

    // Combine and deduplicate
    const networkMap = new Map();
    
    following.forEach(user => {
      networkMap.set(user.fid || user.data?.fid, {
        ...user,
        relationship: 'following',
        isFollowing: true,
        isFollower: false,
      });
    });

    followers.forEach(user => {
      const existingUser = networkMap.get(user.fid || user.data?.fid);
      if (existingUser) {
        existingUser.relationship = 'mutual';
        existingUser.isFollower = true;
      } else {
        networkMap.set(user.fid || user.data?.fid, {
          ...user,
          relationship: 'follower',
          isFollowing: false,
          isFollower: true,
        });
      }
    });

    return Array.from(networkMap.values());
  } catch (error) {
    console.error('Error fetching user network:', error);
    throw error;
  }
};

/**
 * Validate Farcaster signature for authentication
 */
export const validateFarcasterSignature = async (message, signature, fid) => {
  try {
    // This would validate the signature against the user's Farcaster keys
    // Implementation depends on the specific authentication flow
    return true; // Mock validation for now
  } catch (error) {
    console.error('Error validating signature:', error);
    return false;
  }
};
