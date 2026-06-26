import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { buildDriveBannerUrl } from '../../../constants/drive.constants.js';
import { fetchGroupBadges } from '../../../services/badges.api.js';
import { fetchGroupCurrencyConfig } from '../../../services/groupCurrency.api.js';
import { fetchGroupLivesConfig } from '../../../services/groupLives.api.js';
import { fetchGroupById } from '../../../services/groups.api.js';
import { fetchGroupRanks } from '../../../services/ranks.api.js';
import { fetchGroupShopItems } from '../../../services/shop.api.js';

/**
 * @typedef {import('../services/groupTemplates.api.js').GroupTemplateData} GroupTemplateData
 */

async function requestJson(path, options = {}) {
  const base = getApiBaseUrl();
  const browserid = getOrCreateBrowserId();
  const response = await fetch(`${base}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Browser-ID': browserid,
      ...options.headers,
    },
    ...options,
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!response.ok) {
    throw new Error(data?.message || `Błąd HTTP ${response.status}`);
  }
  return data;
}

async function fetchStagesWithActivities(groupId) {
  const stagesData = await requestJson('/stages', {
    method: 'POST',
    body: JSON.stringify({ method: 'retrieve', groupId: Number(groupId) }),
  });
  const stages = Array.isArray(stagesData?.stages) ? stagesData.stages : [];
  const withActivities = await Promise.all(
    stages.map(async (stage) => {
      try {
        const activityData = await requestJson('/activities', {
          method: 'POST',
          body: JSON.stringify({ method: 'retrieve', stageId: stage.id }),
        });
        const activities = Array.isArray(activityData?.activities) ? activityData.activities : [];
        return {
          id: stage.id,
          groupId: Number(groupId),
          name: stage.name ?? '',
          displayOrder: stage.displayOrder ?? null,
          activities: activities.map((activity) => ({
            name: activity.name ?? '',
            currency: activity.currency ?? 0,
            educationalDescription: activity.educationalDescription ?? '',
            storyDescription: activity.storyDescription ?? '',
          })),
        };
      } catch {
        return {
          id: stage.id,
          groupId: Number(groupId),
          name: stage.name ?? '',
          displayOrder: stage.displayOrder ?? null,
          activities: [],
        };
      }
    }),
  );
  return withActivities;
}

async function fetchGroupPosts(groupId) {
  try {
    const data = await requestJson(`/groups/${groupId}/post`, { method: 'GET' });
    const posts = Array.isArray(data?.posts) ? data.posts : [];
    return posts.map((post) => ({
      title: post.title ?? null,
      content: post.content ?? post.text ?? null,
    }));
  } catch {
    return [];
  }
}

/**
 * Buduje podgląd danych szablonu na podstawie istniejącej grupy (bez zapisu).
 * @param {string | number} groupId
 * @returns {Promise<GroupTemplateData | null>}
 */
export async function fetchGroupSnapshotForTemplate(groupId) {
  const [
    group,
    badges,
    ranks,
    shopResult,
    currencyResult,
    livesResult,
    stages,
    posts,
  ] = await Promise.all([
    fetchGroupById(String(groupId)),
    fetchGroupBadges(groupId).catch(() => []),
    fetchGroupRanks(groupId).catch(() => []),
    fetchGroupShopItems(groupId).catch(() => ({ ok: false, items: [] })),
    fetchGroupCurrencyConfig(groupId).catch(() => ({ ok: false })),
    fetchGroupLivesConfig(groupId).catch(() => ({ ok: false })),
    fetchStagesWithActivities(groupId).catch(() => []),
    fetchGroupPosts(groupId),
  ]);

  const shopItems = shopResult.ok ? shopResult.items : [];
  const currencyConfig = currencyResult.ok ? currencyResult.config : null;
  const livesConfig = livesResult.ok ? livesResult.config : null;

  if (!group) return null;

  const categoriesMap = new Map();
  const items = (shopItems ?? []).map((item) => {
    if (item.categoryId != null) {
      categoriesMap.set(item.categoryId, {
        id: item.categoryId,
        groupId: Number(groupId),
        name: `Kategoria ${item.categoryId}`,
        description: null,
        displayOrder: null,
      });
    }
    return {
      id: item.id,
      groupId: Number(groupId),
      categoryId: item.categoryId ?? null,
      imageRef: item.imageRef ?? null,
      name: item.name ?? '',
      educationalDescription: item.didacticDescription ?? item.storyDescription ?? null,
      listing: {
        basePrice: item.priceAmount ?? 0,
        stockQuantity: item.stockQuantity ?? null,
        perStudentLimit: item.perStudentLimit ?? null,
        rankPromotions: [],
        badgePromotions: [],
      },
    };
  });

  return {
    group: {
      name: group.storyName || '',
      subjectName: group.subject || null,
      imageRef: group.imageRef ?? null,
      description: group.description ?? null,
      currency: currencyConfig?.currency ?? null,
      currencyEmoji: currencyConfig?.currencyEmoji ?? null,
      lives: null,
      startingLives: null,
      livesIcon: livesConfig?.livesIcon ?? null,
    },
    badges: (badges ?? []).map((badge) => ({
      id: badge.id,
      groupId: Number(groupId),
      name: badge.name ?? '',
      educationalDescription: badge.educationalDescription ?? badge.didacticDescription ?? null,
      icon: badge.icon ?? null,
      storyDescription: badge.storyDescription ?? null,
      rewardAmount: badge.rewardAmount ?? null,
      rarity: badge.rarity ?? 'common',
      globalDiscountType: badge.globalDiscountType ?? null,
      globalDiscountValue: badge.globalDiscountValue ?? null,
    })),
    ranks: (ranks ?? []).map((rank) => {
      const percent = Number(rank.discount ?? 0);
      const fixed = Number(rank.storeDiscount ?? 0);
      let globalDiscountType = rank.globalDiscountType ?? null;
      let globalDiscountValue = rank.globalDiscountValue ?? null;

      if (globalDiscountType == null) {
        if (Number.isFinite(percent) && percent > 0) {
          globalDiscountType = 'percent';
          globalDiscountValue = Math.round(percent);
        } else if (Number.isFinite(fixed) && fixed > 0) {
          globalDiscountType = 'fixed';
          globalDiscountValue = Math.round(fixed);
        }
      }

      return {
        id: rank.id,
        groupId: Number(groupId),
        name: rank.name ?? '',
        requiredPoints: rank.requiredPoints ?? 0,
        icon: rank.icon ?? null,
        storyDescription: rank.storyDescription ?? null,
        uniqueStoreItems: rank.uniqueStoreItems ?? null,
        globalDiscountType,
        globalDiscountValue,
      };
    }),
    itemCategories: [...categoriesMap.values()],
    items,
    posts,
    stages,
  };
}

/**
 * @param {GroupTemplateData} data
 */
export function getTemplateBannerUrl(data) {
  const imageRef = data?.group?.imageRef;
  return imageRef ? buildDriveBannerUrl(imageRef) : null;
}

/**
 * @param {GroupTemplateData} data
 */
export function getTemplateSummaryStats(data) {
  const activityCount = (data?.stages ?? []).reduce(
    (sum, stage) => sum + (stage.activities?.length ?? 0),
    0,
  );
  return {
    badges: data?.badges?.length ?? 0,
    ranks: data?.ranks?.length ?? 0,
    items: data?.items?.length ?? 0,
    stages: data?.stages?.length ?? 0,
    activities: activityCount,
    posts: data?.posts?.length ?? 0,
  };
}
