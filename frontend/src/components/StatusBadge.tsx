interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status ? status.toUpperCase() : 'PENDING';
  
  const statusConfig: Record<string, string> = {
    APPLIED: 'badge-blue',
    SHORTLISTED: 'badge-yellow',
    REJECTED: 'badge-red',
    SELECTED: 'badge-green',
    ON_HOLD: 'badge-gray',
    OPEN: 'badge-green',
    CLOSED: 'badge-red',
    DRAFT: 'badge-gray',
    PLACED: 'badge-green',
    NOT_PLACED: 'badge-gray',
    PENDING: 'badge-yellow',
    PASSED: 'badge-green',
    FAILED: 'badge-red',
    ACTIVE: 'badge-green',
    UPCOMING: 'badge-blue',
    COMPLETED: 'badge-gray',
    SCHEDULED: 'badge-blue',
    APPROVED: 'badge-green',
  };

  const labels: Record<string, string> = {
    APPLIED: 'APPLIED',
    SHORTLISTED: 'SHORTLISTED',
    REJECTED: 'REJECTED',
    SELECTED: 'SELECTED',
    ON_HOLD: 'ON HOLD',
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
    DRAFT: 'DRAFT',
    PLACED: 'PLACED',
    NOT_PLACED: 'UNPLACED',
    PENDING: 'PENDING',
    PASSED: 'PASSED',
    FAILED: 'FAILED',
    ACTIVE: 'ACTIVE',
    UPCOMING: 'UPCOMING',
    COMPLETED: 'COMPLETED',
    SCHEDULED: 'SCHEDULED',
    APPROVED: 'APPROVED',
  };

  return (
    <span className={statusConfig[normalized] || 'badge-gray'}>
      {labels[normalized] || status}
    </span>
  );
}
