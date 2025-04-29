import prisma from "@/lib/prisma";

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

export async function getDashboardStats(): Promise<DashboardStats> {
  // Get total images count
  const totalImages = await prisma.photo.count();

  // Get series count
  const seriesCount = await prisma.series.count();

  // Get scheduled posts count
  const scheduledPosts = await prisma.post.count({
    where: {
      status: 'pending',
    },
  });

  // Get posted count
  const postedCount = await prisma.post.count({
    where: {
      status: 'posted',
    },
  });

  // Get images from last week
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekImages = await prisma.photo.count({
    where: {
      createdAt: {
        gte: lastWeek,
      },
    },
  });

  // Get series from last month
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthSeries = await prisma.series.count({
    where: {
      createdAt: {
        gte: lastMonth,
      },
    },
  });

  // Get next scheduled post date
  const nextPost = await prisma.post.findFirst({
    where: {
      status: 'pending',
    },
    orderBy: {
      scheduledAt: 'asc',
    },
    select: {
      scheduledAt: true,
    },
  });

  // Get posts from this week
  const thisWeekPosts = await prisma.post.count({
    where: {
      status: 'posted',
      postedAt: {
        gte: lastWeek,
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