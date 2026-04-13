import type { PropsWithChildren } from "react";

interface labelProps {
  title: string;
  // children: React.ReactNode;
  // PropsWithChildren 도 넣을 수 잇을 것 같은데...
}

function WrapWithLabel({ title, children }: PropsWithChildren<labelProps>) {
  return (
    <div className="w-full">
      <label className="text-xs block mb-2">{title}</label>
      <div className="flex gap-2 flex-wrap">{children}</div>
    </div>
  );
}

export default WrapWithLabel;
