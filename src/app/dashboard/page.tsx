import LazyWidget from "@/components/LazyWidget";
import DiscussionsWidget from "@/components/DiscussionsWidget";
import CommunityMetrics from "@/components/CommunityMetrics";
import GoalTracker from "@/components/GoalTracker";
import TodayFocusHero from "@/components/TodayFocusHero";
import DashboardHeader from "@/components/DashboardHeader";
import StreakTracker from "@/components/StreakTracker";
import TopRepos from "@/components/TopRepos";
import PinnedReposWidget from "@/components/PinnedReposWidget";
import InactiveRepositoriesCard from "@/components/InactiveRepositoriesCard";
import LanguageBreakdown from "@/components/LanguageBreakdown";
import CIAnalytics from "@/components/CIAnalytics";
import IssueMetrics from "@/components/IssueMetrics";
import StreakAtRiskBanner from "@/components/StreakAtRiskBanner";
import RepoAnalyticsExplorer from "@/components/repo-analytics/RepoAnalyticsExplorer";
import dynamic from "next/dynamic";
import WeeklySummaryCard from "@/components/WeeklySummaryCard";
import { AIMentorWidget } from "@/components/AIMentorWidget";
import ExportButton from "@/components/ExportButton";
import Link from "next/link";
import PersonalRecords from "@/components/PersonalRecords";
import LocalCodingTime from "@/components/LocalCodingTime";
import CodingTimeWidget from "@/components/CodingTimeWidget";
import RecentActivity from "@/components/RecentActivity";
import FriendComparison from "@/components/FriendComparison";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardSSEProvider from "@/components/DashboardSSEProvider";

const SkeletonCard = () => (
  <div
    role="status"
    aria-busy="true"
    aria-live="polite"
    className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
  >
    <div className="h-6 w-48 bg-[var(--card-muted)] rounded mb-4 animate-pulse" />
    <div className="h-40 bg-[var(--card-muted)] rounded animate-pulse" />
  </div>
);

const ContributionGraphSkeleton = () => (
  <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
    <h2 className="text-lg font-semibold text-[var(--foreground)]">Your Commits</h2>
    <div className="mt-3 h-40 rounded bg-[var(--card-muted)] animate-pulse" />
  </div>
);

const PRMetricsSkeleton = () => (
  <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
    <h2 className="text-lg font-semibold text-[var(--card-foreground)]">PR Analytics</h2>
    <div className="mt-3 h-40 rounded bg-[var(--card-muted)] animate-pulse" />
  </div>
);

const CodingActivityInsightsCard = dynamic(
  () => import("@/components/CodingActivityInsightsCard"),
  { ssr: false, loading: () => <SkeletonCard /> },
);

const ActivityRingChart = dynamic(
  () => import("@/components/ActivityRingChart"),
  { ssr: false, loading: () => <SkeletonCard /> },
);

const ContributionGraph = dynamic(
  () => import("@/components/ContributionGraph"),
  { ssr: false, loading: () => <ContributionGraphSkeleton /> },
);

const ContributionHeatmap = dynamic(
  () => import("@/components/ContributionHeatmap"),
  { ssr: false, loading: () => <SkeletonCard /> },
);

const PRMetrics = dynamic(() => import("@/components/PRMetrics"), {
  ssr: false,
  loading: () => <PRMetricsSkeleton />,
});

const PRBreakdownChart = dynamic(
  () => import("@/components/PRBreakdownChart"),
  { ssr: false, loading: () => <SkeletonCard /> },
);

const CommitTimeChart = dynamic(
  () => import("@/components/CommitTimeChart"),
  { ssr: false, loading: () => <SkeletonCard /> },
);

const PRReviewTrendChart = dynamic(
  () => import("@/components/PRReviewTrendChart"),
  { ssr: false, loading: () => <SkeletonCard /> },
);

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <DashboardSSEProvider>
      <div className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] transition-colors sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        <DashboardHeader />

        {/* Quick actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/wrapped"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent)] transition-opacity hover:opacity-90"
          >
            ✨ Year in Code
          </Link>
          <Link
            href="/friend-compare"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent)] transition-opacity hover:opacity-90"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Compare Friends
          </Link>
          <Link
            href="/dashboard/settings"
            className="secondary-button inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium"
          >
            Settings
          </Link>
          <div className="sm:ml-auto">
            <ExportButton />
          </div>
        </div>

        <div className="space-y-4">
          <StreakAtRiskBanner />
        </div>

        {/* Hero Section */}
        <section className="mt-8">
          <TodayFocusHero userName={session.user?.name ?? null} />
        </section>

        {/* 1. OVERVIEW SECTION */}
        <section className="mt-14 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="h-8 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]"></div>
            <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 w-full">
            <WeeklySummaryCard />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
            <div className="flex flex-col gap-6 w-full overflow-hidden">
              <PersonalRecords />
            </div>
            <div className="flex flex-col gap-6 w-full h-full">
              <AIMentorWidget />
            </div>
          </div>
        </section>

        {/* 2. ACTIVITY & CODING TIME */}
        <section id="streaks" className="mt-14 space-y-6 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="h-8 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            <h2 className="text-2xl font-bold tracking-tight">Activity & Coding</h2>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
            <div className="xl:col-span-2 flex flex-col gap-6 w-full overflow-hidden">
              <div className="w-full overflow-x-auto pb-2">
                <ContributionGraph />
              </div>
              <div className="w-full overflow-x-auto pb-2">
                <ContributionHeatmap />
              </div>
              <LazyWidget fallback={<SkeletonCard />}>
                <ActivityRingChart />
              </LazyWidget>
              <LazyWidget fallback={<SkeletonCard />}>
                <CodingActivityInsightsCard />
              </LazyWidget>
            </div>
            <div className="flex flex-col gap-6 w-full overflow-hidden">
              <StreakTracker />
              <LocalCodingTime />
              <CodingTimeWidget />
              <LazyWidget fallback={<SkeletonCard />}>
                <CommitTimeChart />
              </LazyWidget>
            </div>
          </div>
        </section>

        {/* 3. ANALYTICS & REPOSITORIES */}
        <section id="pull-requests" className="mt-14 space-y-6 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="h-8 w-1.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
            <h2 className="text-2xl font-bold tracking-tight">Analytics & Repositories</h2>
          </div>

          {/* Right: streak + coding time */}
          <div className="flex flex-col gap-6">
            <StreakTracker />
            <LocalCodingTime />
            <CodingTimeWidget />
          </div>

        {/* Repo analytics explorer — full width */}
        <div className="mt-6">
          <LazyWidget fallback={<SkeletonCard />}>
            <RepoAnalyticsExplorer />
          </LazyWidget>
        </div>

        {/* -- Row 2: PR metrics + Community metrics -- */}
        <div id="pull-requests" className="mt-6 grid grid-cols-1 gap-6 scroll-mt-24 md:grid-cols-2">
          <PRMetrics />
          <CommunityMetrics />
        </div>

        {/* PR breakdown + commit time — 2-col so charts have room */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <LazyWidget fallback={<SkeletonCard />}>
            <PRBreakdownChart />
          </LazyWidget>
          <LazyWidget fallback={<SkeletonCard />}>
            <CommitTimeChart />
          </LazyWidget>
        </div>

        {/* Activity ring — full width */}
        <div className="mt-6">
          <LazyWidget fallback={<SkeletonCard />}>
            <ActivityRingChart />
          </LazyWidget>
        </div>

        {/* Coding activity insights — full width */}
        <div className="mt-6">
          <LazyWidget fallback={<SkeletonCard />}>
            <CodingActivityInsightsCard />
          </LazyWidget>
        </div>

        {/* PR review trend — full width */}
        <div className="mt-6">
          <LazyWidget fallback={<SkeletonCard />}>
            <PRReviewTrendChart />
          </LazyWidget>
        </div>

        {/* -- Row 3: Issues (2/3) + CI analytics (1/3) -- */}
        <div id="goals" className="mt-6 grid grid-cols-1 gap-6 scroll-mt-24 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LazyWidget fallback={<SkeletonCard />}>
              <RepoAnalyticsExplorer />
            </LazyWidget>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="flex flex-col gap-6 w-full overflow-hidden">
              <PRMetrics />
              <LazyWidget fallback={<SkeletonCard />}>
                <PRBreakdownChart />
              </LazyWidget>
              <LazyWidget fallback={<SkeletonCard />}>
                <PRReviewTrendChart />
              </LazyWidget>
              <LazyWidget fallback={<SkeletonCard />}>
                <DiscussionsWidget />
              </LazyWidget>
            </div>
            <div className="flex flex-col gap-6 w-full overflow-hidden">
              <CommunityMetrics />
              <LazyWidget fallback={<SkeletonCard />}>
                <PinnedReposWidget />
              </LazyWidget>
              <LazyWidget fallback={<SkeletonCard />}>
                <TopRepos />
              </LazyWidget>
              <LazyWidget fallback={<SkeletonCard />}>
                <InactiveRepositoriesCard />
              </LazyWidget>
            </div>
          </div>
        </div>
        </section>

        {/* 4. GOALS & INSIGHTS */}
        <section id="goals" className="mt-14 space-y-6 scroll-mt-28 mb-12">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="h-8 w-1.5 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
            <h2 className="text-2xl font-bold tracking-tight">Goals & Insights</h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
            <div className="xl:col-span-2 flex flex-col gap-6 w-full overflow-hidden">
              <LazyWidget fallback={<SkeletonCard />}>
                <IssueMetrics />
              </LazyWidget>
              <GoalTracker />
              <LazyWidget fallback={<SkeletonCard />}>
                <RecentActivity />
              </LazyWidget>
            </div>
            <div className="flex flex-col gap-6 w-full overflow-hidden">
              <LazyWidget fallback={<SkeletonCard />}>
                <CIAnalytics />
              </LazyWidget>
              <LazyWidget fallback={<SkeletonCard />}>
                <LanguageBreakdown />
              </LazyWidget>
              <LazyWidget fallback={<SkeletonCard />}>
                <FriendComparison />
              </LazyWidget>
            </div>
          </div>
        </section>
      </div>
    </DashboardSSEProvider>
  );
}
