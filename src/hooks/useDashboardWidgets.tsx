import { useState, useEffect, useCallback } from 'react';

export interface WidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  position: number;
}

const STORAGE_KEY = 'tenant_dashboard_widgets';

const defaultWidgets: WidgetConfig[] = [
  { id: 'today-highlights', title: 'Today\'s Highlights', visible: true, position: 0 },
  { id: 'attendance-summary', title: 'Attendance Summary', visible: true, position: 1 },
  { id: 'performance-chart', title: 'Performance Trend', visible: true, position: 2 },
  { id: 'exam-distribution', title: 'Exam Types', visible: true, position: 3 },
  { id: 'weekly-attendance', title: 'Weekly Attendance', visible: true, position: 4 },
  { id: 'quick-stats', title: 'Quick Stats', visible: true, position: 5 },
  { id: 'upcoming-exams', title: 'Upcoming Exams', visible: true, position: 6 },
  { id: 'announcements', title: 'Announcements', visible: true, position: 7 },
  { id: 'recent-activity', title: 'Recent Activity', visible: true, position: 8 },
];

export const useDashboardWidgets = () => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new widgets
        const mergedWidgets = defaultWidgets.map((defaultWidget) => {
          const storedWidget = parsed.find((w: WidgetConfig) => w.id === defaultWidget.id);
          return storedWidget || defaultWidget;
        });
        return mergedWidgets.sort((a, b) => a.position - b.position);
      }
    } catch {
      // Fall back to defaults
    }
    return defaultWidgets;
  });

  const [isCustomizing, setIsCustomizing] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, visible: !w.visible } : w))
    );
  }, []);

  const reorderWidgets = useCallback((fromIndex: number, toIndex: number) => {
    setWidgets((prev) => {
      const newWidgets = [...prev];
      const [moved] = newWidgets.splice(fromIndex, 1);
      newWidgets.splice(toIndex, 0, moved);
      // Update positions
      return newWidgets.map((w, i) => ({ ...w, position: i }));
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setWidgets(defaultWidgets);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isVisible = useCallback(
    (widgetId: string) => widgets.find((w) => w.id === widgetId)?.visible ?? true,
    [widgets]
  );

  const getVisibleWidgets = useCallback(
    () => widgets.filter((w) => w.visible).sort((a, b) => a.position - b.position),
    [widgets]
  );

  return {
    widgets,
    isCustomizing,
    setIsCustomizing,
    toggleWidgetVisibility,
    reorderWidgets,
    resetToDefaults,
    isVisible,
    getVisibleWidgets,
  };
};

export default useDashboardWidgets;
