import { LinkIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import SelectDemo from "@/components/SelectCustom";
import Input from "@/components/ui/Input";
import { PLATFORM_TAGS } from "@/constants/problem";
import TagSection from "./TagSection";

function PlatformTitle() {
  const { register, control, setValue } = useFormContext();
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#3182f6] mb-2 uppercase tracking-tight">
            Platform
          </p>
          <Controller
            control={control}
            name="platform"
            rules={{ required: true }}
            render={({ field }) => (
              <SelectDemo
                size={"md"}
                selectArray={Object.keys(PLATFORM_TAGS)}
                selectChange={field.onChange}
                placeholder="플랫폼"
              />
            )}
          />
        </div>
        <div className="col-span-2">
          <Input
            {...register("title", { required: "제목을 입력해주세요." })}
            placeholder="문제 제목을 입력하세요"
            variant="beige"
            size="sm"
            label="Title"
          />
        </div>
      </div>
      {/* 문제 URL */}
      <div>
        <div className="relative group">
          <LinkIcon
            size={16}
            className="absolute left-4 top-2/3 -translate-y-1/2 text-gray-300 group-focus-within:text-[#3182f6] transition-colors"
          />
          <Input
            {...register("url")}
            type="url"
            placeholder="https://..."
            variant="beige"
            size="sm"
            label="Problem URL"
            className="pl-11"
          />
        </div>
      </div>
      {/* <Controller
              control={control}
              name="platform"
              rules={{ required: true }}
              render={({ field }) => }
            /> */}
    </section>
  );
}

export default PlatformTitle;
