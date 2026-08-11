import { beforeAll, describe, expect, test } from "bun:test";
import { countByMonth, createSixMonthObject } from "./hook";

// bun test는 타임존을 UTC로 강제한다.
// toISOString()/new Date(key)의 월 밀림 버그는 KST에서만 재현되므로 KST로 고정한다.
beforeAll(() => {
  process.env.TZ = "Asia/Seoul";
});

describe("테스트 환경", () => {
  test("KST(UTC+9)로 실행된다", () => {
    expect(new Date().getTimezoneOffset()).toBe(-540);
  });
});

describe("countByMonth", () => {
  test("같은 달끼리 세어 'YYYY-MM'으로 묶는다", () => {
    const result = countByMonth(["2026-07-01", "2026-07-31", "2026-06-15"]);
    expect(result).toEqual([
      { date: "2026-07", value: 2 },
      { date: "2026-06", value: 1 },
    ]);
  });

  test("말일도 같은 달로 묶인다", () => {
    // new Date(date).toISOString()을 거치면 월이 밀릴 수 있던 자리다.
    // 문자열을 자르므로 타임존과 무관하다.
    expect(countByMonth(["2026-12-31"])).toEqual([
      { date: "2026-12", value: 1 },
    ]);
  });

  test("빈 목록은 빈 배열", () => {
    expect(countByMonth([])).toEqual([]);
  });
});

describe("createSixMonthObject", () => {
  const today = new Date(2026, 6, 15); // 2026-07-15 (KST)

  test("정확히 6개월치를 만든다", () => {
    const result = createSixMonthObject([], today);
    expect(result.length).toBe(6);
  });

  test("첫 항목은 5개월 전(2월), 마지막 항목은 기준월(7월)이다", () => {
    const result = createSixMonthObject([], today);
    expect(result[0].date).toBe("2월");
    expect(result[5].date).toBe("7월");
  });

  test("월 라벨과 값이 정확히 매핑되고 데이터 없는 달은 0이다", () => {
    const lineData = [
      { date: "2026-07", value: 5 },
      { date: "2026-05", value: 2 },
    ];
    const result = createSixMonthObject(lineData, today);
    expect(result.find((r) => r.date === "7월")?.value).toBe(5);
    expect(result.find((r) => r.date === "5월")?.value).toBe(2);
    expect(result.find((r) => r.date === "6월")?.value).toBe(0);
  });
});
