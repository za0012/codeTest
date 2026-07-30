import { Controller, useFormContext, useWatch } from "react-hook-form";
import SelectDemo from "@/components/SelectCustom";
import { DatePickerDemo } from "@/components/ui/DatePicker";
import Input from "@/components/ui/Input";
import { DIFFICULT_TAGS, type PlatformType } from "@/constants/problem";

function TimeDateDiff() {
  const { register, control, watch } = useFormContext();
  const platform = useWatch({ control, name: "platform" });
  // console.log(platform);
  return (
    <section className="grid grid-cols-3 gap-4 bg-[#f9fafb] rounded-2xl p-5 border border-gray-50">
      <div>
        <p className="text-[11px] font-bold text-gray-400 mb-2 block uppercase tracking-tight">
          Difficulty
        </p>
        <Controller
          control={control}
          name="difficulty"
          rules={{ required: true }}
          render={({ field }) => (
            <SelectDemo
              size={"md"}
              variant={"tossWhite"}
              selectArray={
                platform && DIFFICULT_TAGS[platform as PlatformType]
                  ? Object.values(DIFFICULT_TAGS[platform as PlatformType])
                  : Object.values(DIFFICULT_TAGS).flat()
              }
              selectChange={field.onChange}
            />
          )}
        />
      </div>
      <div className="relative">
        <Input
          {...register("time")}
          type="number"
          placeholder="40"
          label="Time"
          size="sm"
          variant="white"
        />
        <span className="absolute right-3 top-[63%] -translate-y-1/2 text-[10px] font-bold text-gray-300">
          min
        </span>
      </div>
      <div>
        <p className="block text-[10px] font-bold text-[#8b95a1] mb-2.5 uppercase">
          Date
        </p>
        <Controller
          control={control}
          name="date"
          rules={{ required: true }}
          render={({ field }) => <DatePickerDemo onChange={field.onChange} />}
        />
      </div>
    </section>
  );
}

export default TimeDateDiff;
