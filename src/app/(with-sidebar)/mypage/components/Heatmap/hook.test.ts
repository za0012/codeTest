import { beforeAll, describe, expect, test } from "bun:test";
import { countByDate, createAndFillHeatmap, getColor } from "./hook";

// bun test는 타임존을 UTC로 강제한다.
// toISOString() 기반의 말일 누락 버그는 KST에서만 재현되므로 KST로 고정한다.
beforeAll(() => {
  process.env.TZ = "Asia/Seoul";
});

describe("테스트 환경", () => {
  test("KST(UTC+9)로 실행된다", () => {
    // getTimezoneOffset은 KST에서 -540분이다. TZ 고정이 적용됐는지 확인한다.
    expect(new Date().getTimezoneOffset()).toBe(-540);
  });
});

describe("countByDate", () => {
  test("같은 날짜를 세고, 날짜 문자열을 그대로 키로 쓴다", () => {
    const result = countByDate(["2026-07-31", "2026-07-31", "2026-07-01"]);
    expect(result).toEqual({ "2026-07-31": 2, "2026-07-01": 1 });
  });

  test("말일이 Date 변환 없이 그대로 보존된다", () => {
    // toISOString()을 거치면 KST에서 하루 밀려 말일이 사라지던 자리다.
    expect(countByDate(["2026-07-31"])["2026-07-31"]).toBe(1);
  });

  test("빈 목록은 빈 객체", () => {
    expect(countByDate([])).toEqual({});
  });
});

describe("createAndFillHeatmap", () => {
  const today = new Date(2026, 6, 15); // 2026-07-15 (KST)

  test("이번 달 말일(2026-07-31)이 포함된다", () => {
    const result = createAndFillHeatmap({}, today);
    expect("2026-07-31" in result).toBe(true);
    expect(result["2026-07-31"]).toBe(0);
  });

  test("12개월치(2025-08-01 ~ 2026-07-31, 365일)를 생성한다", () => {
    const result = createAndFillHeatmap({}, today);
    expect(Object.keys(result).length).toBe(365);
    expect("2025-08-01" in result).toBe(true);
  });

  test("풀이가 있는 날은 개수, 없는 날은 0으로 채운다", () => {
    const result = createAndFillHeatmap({ "2026-07-10": 3 }, today);
    expect(result["2026-07-10"]).toBe(3);
    expect(result["2026-07-11"]).toBe(0);
  });
});

describe("getColor 경계값", () => {
  test("0은 가장 옅은 단계", () => {
    expect(getColor(0)).toBe("#F2F4F6");
  });

  test("1과 2는 같은 단계", () => {
    expect(getColor(1)).toBe("#D4E4FF");
    expect(getColor(2)).toBe("#D4E4FF");
  });

  test("3은 그다음 단계", () => {
    expect(getColor(3)).toBe("#689FFF");
  });

  test("4 이상은 가장 진한 단계", () => {
    expect(getColor(4)).toBe("#1B64FA");
    expect(getColor(10)).toBe("#1B64FA");
  });
});
