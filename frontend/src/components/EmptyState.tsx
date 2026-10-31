import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border-2 border-[#0A0A0A] shadow-brutal">
      {Icon && (
        <div className="w-12 h-12 border-2 border-[#0A0A0A] bg-[#F4F1EA] shadow-brutal-sm flex items-center justify-center text-[#0A0A0A] mb-4">
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
      )}
      <h3 className="text-lg font-bold font-display text-[#0A0A0A] uppercase tracking-wide mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-[#5A5A52] text-xs font-mono max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary text-xs py-2.5 px-5">
          {actionText}
        </button>
      )}
    </div>
  );
}
