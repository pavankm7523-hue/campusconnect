export default function LoadingSpinner({ size = 'md', label }: { size?: 'sm' | 'md' | 'lg'; label?: string }) {
  const sizes = { sm: 'h-5 w-5 border-2', md: 'h-8 w-8 border-3', lg: 'h-12 w-12 border-4' };
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4">
      <div className={`animate-spin ${sizes[size]} border-[#D4D0C5] border-t-[#0038FF] border-r-[#0A0A0A] rounded-none`}></div>
      {label && (
        <span className="font-mono text-xs font-bold text-[#0A0A0A] uppercase tracking-widest bg-white border border-black px-2 py-0.5">
          {label}
        </span>
      )}
    </div>
  );
}
