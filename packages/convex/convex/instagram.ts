import { v } from "convex/values";
import { action, query } from "./_generated/server";

/**
 * Interface para um post do Instagram
 */
export interface InstagramPost {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  timestamp: string;
  caption?: string;
  thumbnail_url?: string;
}

/**
 * Interface para dados do perfil do Instagram
 */
export interface InstagramProfile {
  username: string;
  account_type: string;
  media_count: number;
  followers_count: number;
  follows_count: number;
  profile_picture_url?: string;
}

/**
 * Obtém o access token do Instagram (long-lived)
 */
function getInstagramAccessToken(): string {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "Instagram access token not configured. Set INSTAGRAM_ACCESS_TOKEN in Convex Dashboard."
    );
  }
  return token;
}

/**
 * Obtém o Instagram Business Account ID
 */
function getInstagramAccountId(): string {
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  if (!accountId) {
    throw new Error(
      "Instagram account ID not configured. Set INSTAGRAM_ACCOUNT_ID in Convex Dashboard."
    );
  }
  return accountId;
}

/**
 * Action para buscar posts do Instagram
 */
export const getInstagramPosts = action({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const accessToken = getInstagramAccessToken();
      const accountId = getInstagramAccountId();
      const limit = args.limit || 6; // Default 6 posts

      // Buscar posts recentes
      const fields = "id,media_type,media_url,permalink,timestamp,caption,thumbnail_url";
      const url = `https://graph.instagram.com/${accountId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;

      console.log("[Instagram] Fetching posts from:", url.replace(accessToken, "***"));

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Instagram] Error fetching posts:", errorData);
        throw new Error(
          `Instagram API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ""}`
        );
      }

      const data = await response.json();
      const posts: InstagramPost[] = data.data || [];

      console.log(`[Instagram] Fetched ${posts.length} posts`);

      return posts;
    } catch (error: any) {
      console.error("[Instagram] Error in getInstagramPosts:", error);
      throw error;
    }
  },
});

/**
 * Action para buscar informações do perfil do Instagram
 */
export const getInstagramProfile = action({
  args: {},
  handler: async (ctx) => {
    try {
      const accessToken = getInstagramAccessToken();
      const accountId = getInstagramAccountId();

      // Buscar informações do perfil
      const fields = "username,account_type,media_count,followers_count,follows_count,profile_picture_url";
      const url = `https://graph.instagram.com/${accountId}?fields=${fields}&access_token=${accessToken}`;

      console.log("[Instagram] Fetching profile from:", url.replace(accessToken, "***"));

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Instagram] Error fetching profile:", errorData);
        throw new Error(
          `Instagram API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ""}`
        );
      }

      const profile: InstagramProfile = await response.json();

      console.log("[Instagram] Profile fetched:", profile.username);

      return profile;
    } catch (error: any) {
      console.error("[Instagram] Error in getInstagramProfile:", error);
      throw error;
    }
  },
});

// Import necessário para usar api.instagram
import { api } from "./_generated/api";

/**
 * Action combinada para buscar posts e perfil
 */
export const getInstagramData = action({
  args: {
    postsLimit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{
    posts: InstagramPost[];
    profile: InstagramProfile | null;
    error?: string;
  }> => {
    try {
      const [posts, profile] = await Promise.all([
        ctx.runAction(api.instagram.getInstagramPosts, { limit: args.postsLimit }),
        ctx.runAction(api.instagram.getInstagramProfile, {}),
      ]);

      return {
        posts,
        profile,
      };
    } catch (error: any) {
      console.error("[Instagram] Error in getInstagramData:", error);
      // Retornar dados vazios em caso de erro para não quebrar o frontend
      return {
        posts: [],
        profile: null,
        error: error.message,
      };
    }
  },
});
