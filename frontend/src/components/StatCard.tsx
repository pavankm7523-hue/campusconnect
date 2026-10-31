import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  subtitle?: string;
  trend?: string;
  index?: string | number;
  color?: string; // Kept for backward compatibility
}

export default function StatCard({ title, value, icon: Icon, subtitle, trend, index }: StatCardProps) {
  return (
    <div className="bg-white border-2 border-[#0A0A0A] shadow-brutal p-5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal-lg transition-all duration-100">
      <div className="flex items-center justify-between text-[#5A5A52] pb-2 border-b-2 border-[#0A0A0A]">
        <div className="flex items-center space-x-2">
          {index !== undefined && (
            <span className="font-mono text-[11px] font-bold text-white bg-[#0A0A0A] px-1.5 py-0.5">
              {String(index).padStart(2, '0')}
            </span>
          )}
          <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#0A0A0A]">
            {title}
          </span>
        </div>
        {Icon && <Icon className="h-4 w-4 text-[#0A0A0A]" strokeWidth={2} />}
      </div>
      
      <div className="mt-4">
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A] font-display">
          {value}
        </div>
        
        {(subtitle || trend) && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D4D0C5] text-xs font-mono text-[#5A5A52]">
            {subtitle && <span>{subtitle}</span>}
            {trend && <span className="text-[#22C55E] font-bold bg-black px-1.5 py-0.2 text-[10px]">{trend}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
