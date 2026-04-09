import { X } from "lucide-react";
import {
  PLATFORM_CONFIG,
  DIFFICULTY_BY_PLATFORM,
  ALL_TAGS,
  type Platform,
  type FormData,
  MEMBERS,
} from "../../../data/mockData";
import { addProblem } from "../../../lib/api";
import { Button } from "../../../components/ui/button";
import { SelectC } from "../../../components/custom/SelectC";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";

interface modalProps {
  setShowAddModal: (show: boolean) => void;
}

interface ArrayDataProps {
  title: string;
  formName:
    | "tags"
    | "platform"
    | "title"
    | "difficulty"
    | "solverName"
    | "timeSpent"
    | "url"
    | "solution"
    | "memo"
    | `tags.${number}`;
  defaultValue: string;
  selectItem: string[];
}

function ModalCustomProb({ setShowAddModal }: modalProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isValid },
    watch,
    setValue,
  } = useForm<FormData>();

  const members = MEMBERS.map((m) => `${m.emoji} ${m.name}`);
  const selectedTags = watch("tags") || [];

  const currentFlatform = (watch("platform") as Platform) || "BOJ";

  const selectArray: ArrayDataProps[] = [
    {
      title: "풀이자",
      formName: "solverName",
      defaultValue: members[0],
      selectItem: members,
    },
    {
      title: "난이도",
      formName: "difficulty",
      defaultValue: DIFFICULTY_BY_PLATFORM[currentFlatform][0],
      selectItem: DIFFICULTY_BY_PLATFORM[currentFlatform],
    },
  ];

  const onSubmit = function (data: FormData) {
    console.log(data);
    addProblem(data);
    setShowAddModal(false);
    // API 호출 등의 로직
  };

  const toggleTag = function (tag: string) {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((t: string) => t !== tag)
      : [...selectedTags, tag]; // 없으면 추가

    setValue("tags", nextTags, { shouldValidate: true }); //실시간 유효성 검사
  };

  //마스터 계열로 신청
  return (
    <div
      className="fixed inset-0 bg-black/25 backdrop-blur-[2px] flex items-center justify-center z-50 p-6"
      // onClick={() => setShowAddModal(false)} 작성하다가 배경화면 눌러서 날라갈 바에야 없애는 게 낫다고 단
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        // onClick={(e) => e.stopPropagation()}
      >
        <div className="p-7">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-gray-900 text-xl font-extrabold">
                  새 문제 추가
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  풀었던 문제를 기록해보세요
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs block mb-2">플랫폼</label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(PLATFORM_CONFIG) as Platform[]).map(
                    (platform) => (
                      <div>
                        <Controller
                          control={control}
                          name="platform"
                          rules={{ required: true }}
                          defaultValue={Object.keys(PLATFORM_CONFIG)[0]}
                          render={({ field }) => (
                            <Button
                              key={platform}
                              type="button"
                              size="xs"
                              variant={"blueOut"}
                              className={`${currentFlatform === platform ? `${PLATFORM_CONFIG[platform].bg} ${PLATFORM_CONFIG[platform].text}` : `hover:${PLATFORM_CONFIG[platform].text}!`}`}
                              onClick={() => {
                                field.onChange(platform);
                                setValue(
                                  "difficulty",
                                  DIFFICULTY_BY_PLATFORM[platform][0],
                                );
                              }}
                            >
                              {PLATFORM_CONFIG[platform].label}
                            </Button>
                          )}
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-xs block mb-1.5">
                  제목 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="제목"
                  {...register("title", {
                    required: "제목을 작성해주세요",
                  })}
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {selectArray.map((form) => (
                  <div>
                    <label className="text-xs block mb-1.5">{form.title}</label>
                    <Controller
                      control={control}
                      name={form.formName}
                      rules={{ required: true }}
                      defaultValue={form.defaultValue}
                      render={({ field }) => (
                        <SelectC
                          {...field}
                          selectLabel={form.title}
                          selectItem={form.selectItem}
                          onSelect={field.onChange}
                        />
                      )}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs block mb-1.5">시간(분)</label>
                  <Input
                    placeholder="시간(분)"
                    type="number"
                    {...register("timeSpent")}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs block mb-2">태그</label>
                <div className="flex flex-wrap gap-1.5 p-3 border border-gray-100 rounded-2xl bg-gray-50/50">
                  {ALL_TAGS.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      size="xss"
                      variant={selectedTags.includes(tag) ? "blue" : "blueOut"}
                      onClick={() => toggleTag(tag)}
                      {...register("tags")}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs block mb-1.5">문제 링크</label>
                <Input
                  placeholder="https://..."
                  {...register("url", {
                    required: "URL을 입력해주세요",
                  })}
                />
              </div>
              <div>
                <label className="text-xs block mb-1.5">풀이 코드</label>
                <Textarea
                  placeholder="코드를 입력해주세요"
                  rows={16}
                  className="text-xs! field-sizing-fixed! font-mono py-3"
                  {...register("solution", {
                    required: "코드를 입력해주세요",
                  })}
                />
              </div>
              <div>
                <label className="text-xs block mb-1.5">메모</label>
                <Textarea
                  placeholder="풀이 접근법, 주의사항, 배운 점 등..."
                  rows={5}
                  className="field-sizing-fixed! py-3"
                  {...register("memo")}
                />
              </div>
              <div className="flex gap-2 justify-end pt-1 border-t border-gray-50">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <Button variant={"blue"} size={"md"} disabled={!isValid}>
                  추가하기
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalCustomProb;
