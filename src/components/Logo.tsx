import { Package } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
        <Package className="w-5.5 h-5.5 text-white" strokeWidth={1.5} />
      </div>
      <span
        className="text-xl font-bold tracking-tight"
        style={{ letterSpacing: "-0.03em" }}
      >
        잡동<span className="text-blue-500">사니</span>
      </span>
    </div>
  );
};

export default Logo;
