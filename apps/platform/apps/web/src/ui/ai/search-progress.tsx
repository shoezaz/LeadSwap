'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextShimmer } from './text-shimmer';
import { CheckCircle2, Loader2, XCircle, Search } from 'lucide-react';
import { cn } from '@leadswap/utils';

interface QueryStatus {
  query: string;
  index: number;
  total: number;
  status: 'pending' | 'started' | 'completed' | 'error';
  resultsCount: number;
  imagesCount?: number;
}

interface SearchProgressProps {
  eventSource?: EventSource;
  onProgress?: (queries: QueryStatus[]) => void;
  className?: string;
}

function StatusIcon({ status }: { status: QueryStatus['status'] }) {
  switch (status) {
    case 'pending':
      return <Search className="h-4 w-4 text-neutral-400" />;
    case 'started':
      return <Loader2 className="h-4 w-4 animate-spin text-violet-500" />;
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
}

export function SearchProgress({ eventSource, onProgress, className }: SearchProgressProps) {
  const [queries, setQueries] = useState<QueryStatus[]>([]);

  useEffect(() => {
    if (!eventSource) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'data-query_completion') {
          setQueries((prev) => {
            const updated = [...prev];
            const queryData = data.data as QueryStatus;

            // Initialize pending queries if this is the first update
            if (updated.length === 0 && queryData.total > 0) {
              for (let i = 0; i < queryData.total; i++) {
                updated.push({
                  query: '',
                  index: i,
                  total: queryData.total,
                  status: 'pending',
                  resultsCount: 0,
                });
              }
            }

            // Update the specific query
            updated[queryData.index] = {
              query: queryData.query,
              index: queryData.index,
              total: queryData.total,
              status: queryData.status,
              resultsCount: queryData.resultsCount,
              imagesCount: queryData.imagesCount,
            };

            onProgress?.(updated);
            return updated;
          });
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onmessage = handleMessage;

    return () => {
      eventSource.close();
    };
  }, [eventSource, onProgress]);

  if (queries.length === 0) {
    return null;
  }

  const completedCount = queries.filter((q) => q.status === 'completed').length;
  const totalResults = queries.reduce((sum, q) => sum + q.resultsCount, 0);

  return (
    <div className={cn('space-y-3 rounded-xl bg-neutral-50 p-4', className)}>
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700">
          Searching {completedCount}/{queries.length} queries
        </span>
        {completedCount > 0 && (
          <span className="text-xs text-neutral-500">{totalResults} results found</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / queries.length) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Query list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {queries.map((q) => (
            <motion.div
              key={q.index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'flex items-center gap-3 rounded-lg p-2 transition-colors',
                q.status === 'started' && 'bg-violet-50',
                q.status === 'completed' && 'bg-green-50',
                q.status === 'error' && 'bg-red-50'
              )}
            >
              <StatusIcon status={q.status} />
              <span className="flex-1 truncate text-sm">
                {q.status === 'started' ? (
                  <TextShimmer className="font-medium">{q.query || 'Searching...'}</TextShimmer>
                ) : (
                  <span
                    className={cn(
                      q.status === 'completed' && 'text-green-700',
                      q.status === 'error' && 'text-red-700',
                      q.status === 'pending' && 'text-neutral-400'
                    )}
                  >
                    {q.query || 'Pending...'}
                  </span>
                )}
              </span>
              {q.status === 'completed' && (
                <span className="text-xs font-medium text-green-600">
                  {q.resultsCount} found
                </span>
              )}
              {q.status === 'error' && (
                <span className="text-xs font-medium text-red-600">Failed</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Hook for managing search progress state
export function useSearchProgress() {
  const [queries, setQueries] = useState<QueryStatus[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleProgress = (updatedQueries: QueryStatus[]) => {
    setQueries(updatedQueries);
    const allDone = updatedQueries.every((q) => q.status === 'completed' || q.status === 'error');
    if (allDone && updatedQueries.length > 0) {
      setIsSearching(false);
    }
  };

  const startSearch = () => {
    setQueries([]);
    setIsSearching(true);
  };

  const reset = () => {
    setQueries([]);
    setIsSearching(false);
  };

  return {
    queries,
    isSearching,
    handleProgress,
    startSearch,
    reset,
    totalResults: queries.reduce((sum, q) => sum + q.resultsCount, 0),
    completedCount: queries.filter((q) => q.status === 'completed').length,
  };
}

