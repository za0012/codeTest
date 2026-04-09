import { useState } from "react";
import type { Problem } from "../data/mockData";
import { PLATFORM_CONFIG, DIFFICULTY_CONFIG, ALL_TAGS } from "../data/mockData";
import { X, ExternalLink, Edit3, Trash2 } from "lucide-react";
import { useStudy } from "../context/StudyContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  problem: Problem;
  onClose: () => void;
  onDelete?: (id: number) => void;
  onUpdate?: (p: Problem) => void;
}

export function ProblemModal({ problem, onClose, onDelete, onUpdate }: Props) {
  const { members, updateProblem, deleteProblem } = useStudy();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Problem>({ ...problem });

  const member = members.find((m) => m.id === problem.memberId);
  const pc = PLATFORM_CONFIG[problem.platform];
  const dc = DIFFICULTY_CONFIG[problem.difficulty];

  const handleUpdate = () => {
    updateProblem(form);
    onUpdate?.(form);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteProblem(problem.id);
    onDelete?.(problem.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/25 backdrop-blur-[2px] flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-7">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1 min-w-0 pr-4">
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap mb-2.5">
                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full ${pc.bg} ${pc.text}`}
                  style={{ fontWeight: 600 }}
                >
                  {pc.label}
                </span>
                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full ${dc?.bg ?? "bg-gray-100"} ${dc?.text ?? "text-gray-500"}`}
                  style={{ fontWeight: 600 }}
                >
                  {problem.difficulty}
                </span>
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* Title */}
              <h2
                className="text-gray-900"
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.3px",
                }}
              >
                {problem.number ? `${problem.number}. ` : ""}
                {problem.title}
              </h2>
              {/* Meta */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{member?.emoji}</span>
                  <span
                    className="text-gray-500 text-xs"
                    style={{ fontWeight: 500 }}
                  >
                    {member?.name}
                  </span>
                </div>
                <span className="text-gray-200">·</span>
                <span className="text-gray-400 text-xs">{problem.date}</span>
                <span className="text-gray-200">·</span>
                <span className="text-gray-400 text-xs">
                  ⏱ {problem.timeSpent}분
                </span>
                {problem.url && (
                  <>
                    <span className="text-gray-200">·</span>
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-[#3182f6] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={12} />
                      문제 보기
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Edit3 size={15} />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="border-t border-gray-50 mb-5" />

          {!isEditing ? (
            /* ── View mode ── */
            <div className="flex flex-col gap-5">
              {problem.solution && (
                <div>
                  <p
                    className="text-xs text-gray-400 mb-2.5"
                    style={{
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    💻 풀이 코드
                  </p>
                  <SyntaxHighlighter
                    language="javascript"
                    style={dracula}
                    className="text-xs"
                    customStyle={{ padding: 20, borderRadius: 10 }}
                  >
                    {problem.solution}
                  </SyntaxHighlighter>
                </div>
              )}
              {problem.memo && (
                <div>
                  <p
                    className="text-xs text-gray-400 mb-2.5"
                    style={{
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    📝 메모
                  </p>
                  <div
                    className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 text-sm text-gray-700"
                    style={{ lineHeight: 1.7 }}
                  >
                    {problem.memo}
                  </div>
                </div>
              )}
              {!problem.solution && !problem.memo && (
                <div className="text-center py-8 text-gray-300 text-sm">
                  풀이 코드와 메모가 없어요
                </div>
              )}
            </div>
          ) : (
            /* ── Edit mode ── */
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-1.5">
                <p
                  className="text-xs text-gray-400 w-full mb-0.5"
                  style={{ fontWeight: 600 }}
                >
                  태그
                </p>
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
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-[#3182f6]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-300"
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
                    소요 시간 (분)
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
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-300"
                  />
                </div>
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
                  rows={9}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-blue-300 resize-none bg-gray-950 text-gray-100"
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
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-300 resize-none"
                  placeholder="풀이 접근법, 주의사항, 배운 점 등..."
                />
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                  style={{ fontWeight: 600 }}
                >
                  저장
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
