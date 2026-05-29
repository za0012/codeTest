import type { TooltipContentProps } from "recharts";

export function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  const firstPayload = payload?.[0];
  const isVisible = active && firstPayload != null;

  if (!isVisible) return null; // 불필요한 렌더링 방지를 위해 null 반환 처리

  return (
    <div
      className="bg-white rounded-2xl px-4 py-3 border-0"
      style={{
        boxShadow:
          "0px 8px 24px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-medium text-[#8B95A1] tracking-tight">
          {label}
        </p>
        <p className="text-[14px] font-bold text-[#191F28] tracking-tight">
          <span className="text-[#1B64FA] mr-0.5">{firstPayload.value}</span>
          문제 풀이
        </p>
      </div>
    </div>
  );
}
