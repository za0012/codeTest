import type { FC } from "react";

interface TooltipPropType {
  message: string;
  position: "top" | "bottom" | "left" | "right";
}

const Tooltip: FC<TooltipPropType> = ({ message, position }) => {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };
  return (
    <div
      className={`
        absolute z-150 whitespace-nowrap bg-[#1A1F27] text-white text-[13px] font-medium px-3 py-2 rounded-xl
        shadow-[0_4px_12px_rgba(0,0,0,0.16)] animate-fade-in transition-all duration-150
        ${positionClasses[position]}
      `}
    >
      {message}
    </div>
  );
};

export default Tooltip;
