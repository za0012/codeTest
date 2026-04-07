import { X } from "lucide-react";
import {
  PLATFORM_CONFIG,
  DIFFICULTY_BY_PLATFORM,
  ALL_TAGS,
  type Platform,
  type Problem,
  MEMBERS,
} from "../../../data/mockData";
import { addProblem } from "../../../lib/api";
import { emptyForm } from "../Problems";
import { Button } from "../../../components/ui/button";

interface modalProps {
  setShowAddModal: (show: boolean) => void;
  form: Omit<Problem, "id">;
  setForm: (forms: Omit<Problem, "id">) => void;
}

function ModalCustomProb({ setShowAddModal, form, setForm }: modalProps) {
  const members = MEMBERS;

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addProblem(form);
    setShowAddModal(false);
    setForm(emptyForm());
  };

  return (
    <div
      className="fixed inset-0 bg-black/25 backdrop-blur-[2px] flex items-center justify-center z-50 p-6"
      onClick={() => setShowAddModal(false)}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-gray-900"
                style={{ fontSize: 18, fontWeight: 800 }}
              >
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
              <label
                className="text-xs text-gray-400 block mb-2"
                style={{ fontWeight: 600 }}
              >
                플랫폼
              </label>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        platform: p,
                        difficulty: DIFFICULTY_BY_PLATFORM[p][0],
                      }))
                    }
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                      form.platform === p
                        ? `${PLATFORM_CONFIG[p].bg} ${PLATFORM_CONFIG[p].text} border-transparent`
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                    style={{ fontWeight: form.platform === p ? 600 : 400 }}
                  >
                    {PLATFORM_CONFIG[p].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-2">
                <label
                  className="text-xs text-gray-400 block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  제목 *
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="제목"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-violet-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label
                  className="text-xs text-gray-400 block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  난이도
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, difficulty: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-violet-300"
                >
                  {DIFFICULTY_BY_PLATFORM[form.platform].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="text-xs text-gray-400 block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  풀이자
                </label>
                <select
                  value={form.memberId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      memberId: Number(e.target.value),
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-violet-300"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.emoji} {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="text-xs text-gray-400 block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  시간(분)
                </label>
                <input
                  type="number"
                  value={form.timeSpent}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      timeSpent: Number(e.target.value),
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-violet-300"
                />
              </div>
            </div>

            <div>
              <label
                className="text-xs text-gray-400 block mb-2"
                style={{ fontWeight: 600 }}
              >
                태그
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 border border-gray-100 rounded-2xl bg-gray-50/50">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        tags: f.tags.includes(tag)
                          ? f.tags.filter((t) => t !== tag)
                          : [...f.tags, tag],
                      }))
                    }
                    className={`text-[11px] px-2.5 py-1 rounded-full transition-colors ${
                      form.tags.includes(tag)
                        ? "bg-violet-600 text-white"
                        : "bg-white text-gray-500 border border-gray-200 hover:border-violet-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="text-xs text-gray-400 block mb-1.5"
                style={{ fontWeight: 600 }}
              >
                문제 링크
              </label>
              <input
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-violet-300"
              />
            </div>

            <div>
              <label
                className="text-xs text-gray-400 block mb-1.5"
                style={{ fontWeight: 600 }}
              >
                풀이 코드
              </label>
              <textarea
                value={form.solution}
                onChange={(e) =>
                  setForm((f) => ({ ...f, solution: e.target.value }))
                }
                rows={5}
                placeholder="# 코드를 입력해주세요"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-violet-300 resize-none bg-gray-950 text-gray-100"
                style={{
                  fontFamily: "'JetBrains Mono', Consolas, monospace",
                  lineHeight: 1.8,
                }}
              />
            </div>

            <div>
              <label
                className="text-xs text-gray-400 block mb-1.5"
                style={{ fontWeight: 600 }}
              >
                메모
              </label>
              <textarea
                value={form.memo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, memo: e.target.value }))
                }
                rows={2}
                placeholder="풀이 접근법, 주의사항, 배운 점 등..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-violet-300 resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-1 border-t border-gray-50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <Button>버튼~</Button>
              <button
                onClick={handleAdd}
                disabled={!form.title.trim()}
                className="px-5 py-2 rounded-xl text-sm bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-40 shadow-sm shadow-violet-200"
                style={{ fontWeight: 600 }}
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCustomProb;
