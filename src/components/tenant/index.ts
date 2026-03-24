// Tenant dashboard component exports

export { default as BulkActionsBar, commonBulkActions } from './BulkActionsBar';
export type { BulkAction } from './BulkActionsBar';
export { default as StatsComparisonCard } from './StatsComparisonCard';
export { default as EmptyState } from './EmptyState';
export { default as NotificationCenter } from './NotificationCenter';
export { default as QuickActionsFab } from './QuickActionsFab';
export {
  TodayHighlightsWidget,
  AttendanceSummaryWidget,
  UpcomingEventsWidget,
  QuickMetricsWidget,
} from './DashboardWidgets';

// Communication exports
export { default as NotificationSender } from './communication/NotificationSender';
export { default as AnnouncementScheduler } from './communication/AnnouncementScheduler';
export { default as MessageTemplateCard } from './communication/MessageTemplateCard';
export { default as MessageTemplateList } from './communication/MessageTemplateList';
