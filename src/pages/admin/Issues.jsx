import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Users, 
  Calendar,
  MapPin,
  UserX,
  Search,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  getIssues, 
  getIssueStats, 
  updateIssueStatus, 
  deleteIssue 
} from '../../services/issueServices';
import IssueDetailModal from '../../components/admin/IssueDetailModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { formatDate } from '@/lib/dateUtils';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Fetch issues and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchIssues(), fetchStats()]);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await getIssues();
      // Handle API response structure: { success: true, data: [...] }
      const issuesData = response?.data || [];
      setIssues(Array.isArray(issuesData) ? issuesData : []);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      toast.error('Failed to load issues');
      setIssues([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getIssueStats();
      // Handle API response structure: { success: true, data: {...} }
      setStats(response?.data || null);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats(null);
    }
  };

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

  // Filter and sort issues
  const getFilteredIssues = () => {
    if (!Array.isArray(issues)) return [];
    
    let filtered = issues.filter(issue => {
      const matchesSearch = !searchTerm || 
        issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.group?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
      const matchesType = typeFilter === 'all' || issue.issueType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort issues
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  // Handle status update
  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      await updateIssueStatus(issueId, newStatus);
      
      setIssues(prev => prev.map(issue => 
        issue.id === issueId 
          ? { ...issue, status: newStatus, updatedAt: new Date().toISOString() }
          : issue
      ));
      
      toast.success('Issue status updated successfully');
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update issue status');
    }
  };

  // Handle delete issue
  const handleDeleteIssue = async (issueId) => {
    try {
      await deleteIssue(issueId);
      
      setIssues(prev => prev.filter(issue => issue.id !== issueId));
      setShowDeleteModal(null);
      toast.success('Issue deleted successfully');
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Failed to delete issue:', error);
      toast.error('Failed to delete issue');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Issue Management
            </h1>
            <p className="mt-2 text-gray-600">
              Track and resolve routine-related issues reported by users
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setLoading(true);
                Promise.all([fetchIssues(), fetchStats()]).finally(() => setLoading(false));
              }}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Open</p>
                  <p className="text-2xl font-bold text-red-800">{stats.byStatus?.open || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-800">{stats.byStatus?.inProgress || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-800">{stats.byStatus?.resolved || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Closed</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.byStatus?.closed || 0}</p>
                </div>
                <XCircle className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search by description, user, or group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="MISSING_ROUTINE">Missing Routine</option>
            <option value="MISSING_TEACHER">Missing Teacher</option>
            <option value="INCORRECT_TIME">Incorrect Time</option>
            <option value="INCORRECT_ROOM">Incorrect Room</option>
            <option value="INCORRECT_TEACHER">Incorrect Teacher</option>
            <option value="OTHERS">Others</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="updatedAt-desc">Recently Updated</option>
            <option value="status-asc">Status A-Z</option>
          </select>
        </div>

        {/* Issues Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Issue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Reporter
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Group
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="h-4 animate-pulse rounded bg-gray-200"></div></td>
                      <td className="px-6 py-4"><div className="h-4 animate-pulse rounded bg-gray-200"></div></td>
                      <td className="px-6 py-4"><div className="h-4 animate-pulse rounded bg-gray-200"></div></td>
                      <td className="px-6 py-4"><div className="h-4 animate-pulse rounded bg-gray-200"></div></td>
                      <td className="px-6 py-4"><div className="h-4 animate-pulse rounded bg-gray-200"></div></td>
                      <td className="px-6 py-4"><div className="h-4 animate-pulse rounded bg-gray-200"></div></td>
                    </tr>
                  ))
                ) : getFilteredIssues().length > 0 ? (
                  getFilteredIssues().map((issue) => {
                    const typeConfig = getIssueTypeConfig(issue.issueType);
                    const statusConfig = getStatusConfig(issue.status);
                    const TypeIcon = typeConfig.icon;
                    
                    return (
                      <tr key={issue.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className={`rounded-lg border p-2 ${typeConfig.color}`}>
                              <TypeIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {typeConfig.label}
                              </div>
                              <div className="text-sm text-gray-500 mt-1 max-w-xs">
                                {issue.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {issue.user?.name || 'Anonymous'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {issue.user?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {issue.group?.name || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={issue.status}
                            onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold border-0 ${statusConfig.color} focus:ring-2 focus:ring-indigo-500`}
                          >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(issue.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedIssue(issue);
                                setShowDetailModal(true);
                              }}
                              className="text-indigo-600 transition-colors hover:text-indigo-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteModal(issue)}
                              className="text-red-600 transition-colors hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <h3 className="mb-2 text-lg font-medium text-gray-900">
                        No Issues Found
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                          ? 'No issues match your current filters.'
                          : 'No issues have been reported yet.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setShowDetailModal(false)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={(issue) => {
            setShowDeleteModal(issue);
            setShowDetailModal(false);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Issue"
          message="Are you sure you want to delete this issue? This action cannot be undone."
          onConfirm={() => handleDeleteIssue(showDeleteModal.id)}
          onCancel={() => setShowDeleteModal(null)}
        />
      )}
    </div>
  );
};

export default Issues;