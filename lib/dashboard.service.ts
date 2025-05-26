import prisma from "@/lib/prisma";
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

interface Post {
  id: number;
  scheduledAt: Date;
  postedAt: Date | null;
  isCarousel: boolean;
  series: {
    name: string;
  } | null;
  photos: Array<{
    order: number;
    photo: {
      url: string;
    };
  }>;
}

export interface DashboardStats {
  totalImages: number;
  seriesCount: number;
  scheduledPosts: number;
  postedCount: number;
  lastWeekImages: number;
  lastMonthSeries: number;
  nextPostDate: Date | null;
  thisWeekPosts: number;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const now = new Date();
  const lastWeekStart = startOfWeek(addDays(now, -7));
  const lastWeekEnd = endOfWeek(addDays(now, -7));
  const thisWeekStart = startOfWeek(now);
  const lastMonthStart = startOfMonth(addDays(now, -30));
  const lastMonthEnd = endOfMonth(addDays(now, -30));

  // Get total images
  const totalImages = await prisma.photo.count({
    where: { userId }
  });
  const lastWeekImages = await prisma.photo.count({
    where: {
      userId,
      createdAt: {
        gte: lastWeekStart,
        lte: lastWeekEnd,
      },
    },
  });

  // Get series stats
  const seriesCount = await prisma.series.count({
    where: { userId }
  });
  const lastMonthSeries = await prisma.series.count({
    where: {
      userId,
      createdAt: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
    },
  });

  // Get scheduled posts
  const scheduledPosts = await prisma.post.count({
    where: {
      userId,
      status: "pending",
    },
  });

  const nextPost = await prisma.post.findFirst({
    where: {
      userId,
      status: "pending",
    },
    orderBy: {
      scheduledAt: "asc",
    },
  });

  // Get posted stats
  const postedCount = await prisma.post.count({
    where: {
      userId,
      status: "posted",
    },
  });

  const thisWeekPosts = await prisma.post.count({
    where: {
      userId,
      status: "posted",
      postedAt: {
        gte: thisWeekStart,
      },
    },
  });

  return {
    totalImages,
    seriesCount,
    scheduledPosts,
    postedCount,
    lastWeekImages,
    lastMonthSeries,
    nextPostDate: nextPost?.scheduledAt || null,
    thisWeekPosts,
  };
}

export async function getUpcomingPosts(userId: string): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: {
      userId,
      status: "pending",
    },
    orderBy: {
      scheduledAt: "asc",
    },
    take: 3,
    include: {
      series: {
        select: {
          name: true,
        },
      },
      photos: {
        orderBy: {
          order: "asc",
        },
        take: 1,
        include: {
          photo: {
            select: {
              url: true,
            },
          },
        },
      },
    },
  });

  return posts;
}

export async function getRecentPosts(userId: string): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: {
      userId,
      status: "posted",
    },
    orderBy: {
      postedAt: "desc",
    },
    take: 3,
    include: {
      series: {
        select: {
          name: true,
        },
      },
      photos: {
        orderBy: {
          order: "asc",
        },
        take: 1,
        include: {
          photo: {
            select: {
              url: true,
            },
          },
        },
      },
    },
  });

  return posts;
} 