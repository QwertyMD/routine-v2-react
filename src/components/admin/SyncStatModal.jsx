import {
  MinusIcon,
  CircleSlash,
  PlusIcon,
  CircleAlert,
  X,
  Calendar,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { formatDate, formatDateWithRelative } from "@/lib/dateUtils";

const SyncStatModal = ({ syncStats, onClose }) => {
  const { data } = syncStats;
  const [expandedDays, setExpandedDays] = useState(new Set());

  const toggleDayExpansion = (index) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDays(newExpanded);
  };

  const getStatusSummary = (daily) => {
    const parts = [];
    if (daily.added > 0) parts.push(`+${daily.added}`);
    if (daily.removed > 0) parts.push(`-${daily.removed}`);
    if (daily.errors?.length > 0) parts.push(`${daily.errors.length} errors`);
    return parts.length > 0 ? parts.join(', ') : `${daily.unchanged} unchanged`;
  };

  const hasChanges = (daily) => {
    return daily.added > 0 || daily.removed > 0 || (daily.errors?.length > 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Sync Statistics</h3>
            <p className="mt-1 text-sm text-gray-600">
              Completed {formatDateWithRelative(data.startDate)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-100px)] overflow-y-auto p-6">
          {/* Summary Stats */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.totalStats.added}
              </div>
              <div className="text-xs text-gray-600">Added</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {data.totalStats.removed}
              </div>
              <div className="text-xs text-gray-600">Removed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.totalStats.unchanged}
              </div>
              <div className="text-xs text-gray-600">Unchanged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {data.totalStats.errors}
              </div>
              <div className="text-xs text-gray-600">Errors</div>
            </div>
          </div>

          {/* Daily Results */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-gray-700">
              Daily Breakdown ({data.dailyResults?.length || 0} days)
            </h4>

            {data.dailyResults && data.dailyResults.length > 0 ? (
              <div className="space-y-2">
                {data.dailyResults.map((daily, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-white"
                  >
                    <button
                      onClick={() => toggleDayExpansion(index)}
                      className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        {hasChanges(daily) ? (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <div>
                          <div className="font-medium">
                            {formatDate(daily.date).split(',')[0]}
                          </div>
                          <div className="text-sm text-gray-600">
                            {getStatusSummary(daily)}
                          </div>
                        </div>
                      </div>
                      {expandedDays.has(index) ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </button>

                    {expandedDays.has(index) && (
                      <div className="border-t border-gray-100 p-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          {daily.added > 0 && (
                            <div className="flex items-center gap-2">
                              <PlusIcon className="h-3 w-3 text-green-600" />
                              <span>{daily.added} added</span>
                            </div>
                          )}
                          {daily.removed > 0 && (
                            <div className="flex items-center gap-2">
                              <MinusIcon className="h-3 w-3 text-red-600" />
                              <span>{daily.removed} removed</span>
                            </div>
                          )}
                          {daily.unchanged > 0 && (
                            <div className="flex items-center gap-2">
                              <CircleSlash className="h-3 w-3 text-blue-600" />
                              <span>{daily.unchanged} unchanged</span>
                            </div>
                          )}
                        </div>

                        {daily.errors && daily.errors.length > 0 && (
                          <div className="mt-3 rounded bg-red-50 p-3">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-red-800">
                              <CircleAlert className="h-3 w-3" />
                              {daily.errors.length} Error{daily.errors.length > 1 ? 's' : ''}
                            </div>
                            <div className="space-y-1">
                              {daily.errors.map((error, errorIndex) => (
                                <div key={errorIndex} className="text-sm text-red-700">
                                  • {error}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                <Calendar className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">No daily statistics available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {data.totalStats.errors > 0 ? (
                <span className="text-orange-600">Sync completed with issues</span>
              ) : (
                <span className="text-green-600">Sync completed successfully</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncStatModal;
