import React from 'react';
import { X, Users, Calendar, Clock, CheckCircle, AlertTriangle, XCircle, User, MapPin, UserX } from 'lucide-react';
import { formatDate } from '../../lib/dateUtils';

const IssueDetailModal = ({ issue, onClose, onStatusUpdate, onDelete }) => {
  // Get issue type configuration
  const getIssueTypeConfig = (type) => {
    const configs = {
      MISSING_ROUTINE: {
        label: 'Missing Routine',
        icon: Calendar,
        color: 'text-red-600 bg-red-50 border-red-200'
      },
      MISSING_TEACHER: {
        label: 'Missing Teacher',
        icon: UserX,
        color: 'text-orange-600 bg-orange-50 border-orange-200'
      },
      INCORRECT_TIME: {
        label: 'Incorrect Time',
        icon: Clock,
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      },
      INCORRECT_ROOM: {
        label: 'Incorrect Room',
        icon: MapPin,
        color: 'text-purple-600 bg-purple-50 border-purple-200'
      },
      INCORRECT_TEACHER: {
        label: 'Incorrect Teacher',
        icon: User,
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
      },
      OTHERS: {
        label: 'Others',
        icon: AlertTriangle,
        color: 'text-gray-600 bg-gray-50 border-gray-200'
      }
    };
    return configs[type] || configs.OTHERS;
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      OPEN: {
        label: 'Open',
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle
      },
      IN_PROGRESS: {
        label: 'In Progress',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      },
      RESOLVED: {
        label: 'Resolved',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      CLOSED: {
        label: 'Closed',
        color: 'bg-gray-100 text-gray-800',
        icon: XCircle
      }
    };
    return configs[status] || configs.OPEN;
  };

  const typeConfig = getIssueTypeConfig(issue.issueType);
  const statusConfig = getStatusConfig(issue.status);
  const TypeIcon = typeConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Issue Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Issue Type and Status */}
          <div className="flex items-center gap-4">
            <div className={`rounded-lg border p-3 ${typeConfig.color}`}>
              <TypeIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {typeConfig.label}
              </h3>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
              {issue.description}
            </p>
          </div>

          {/* Reporter Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Reporter</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{issue.user?.name || 'Anonymous'}</p>
                <p className="text-sm text-gray-600">{issue.user?.email || 'No email'}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Group</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{issue.group?.name || 'No group specified'}</p>
                {issue.group?.course?.name && (
                  <p className="text-sm text-gray-600">{issue.group.course.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Created At</h4>
              <p className="text-gray-900">{formatDate(issue.createdAt)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h4>
              <p className="text-gray-900">{formatDate(issue.updatedAt)}</p>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Update Status</h4>
            <select
              value={issue.status}
              onChange={(e) => onStatusUpdate(issue.id, e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onDelete(issue)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal;