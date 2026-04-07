export type Platform =
  | "BOJ"
  | "LeetCode"
  | "Programmers"
  | "Codeforces"
  | "SWEA";

export interface Member {
  id: number;
  name: string;
  emoji: string;
  role: "스터디장" | "멤버";
  bio: string;
  solvedCount: number;
  streak: number;
  tier: string;
  tierColor: string;
  tierBg: string;
  todaySolved: boolean;
  joinDate: string;
  favoriteTag: string;
}

export interface Problem {
  id: number;
  title: string;
  number: string;
  platform: Platform;
  difficulty: string;
  tags: string[];
  date: string;
  memberId: number;
  solution: string;
  memo: string;
  timeSpent: number;
  url: string;
}

export const MEMBERS: Member[] = [
  {
    id: 1,
    name: "김민준",
    emoji: "🦊",
    role: "스터디장",
    bio: "알고리즘으로 세상을 바꾸겠어!",
    solvedCount: 42,
    streak: 7,
    tier: "Gold",
    tierColor: "text-yellow-600",
    tierBg: "bg-yellow-50",
    todaySolved: true,
    joinDate: "2026-01-01",
    favoriteTag: "DP",
  },
  {
    id: 2,
    name: "이서연",
    emoji: "🐰",
    role: "멤버",
    bio: "매일 한 문제씩 꾸준히!",
    solvedCount: 38,
    streak: 5,
    tier: "Silver",
    tierColor: "text-slate-500",
    tierBg: "bg-slate-50",
    todaySolved: true,
    joinDate: "2026-01-01",
    favoriteTag: "정렬",
  },
  {
    id: 3,
    name: "박지호",
    emoji: "🐻",
    role: "멤버",
    bio: "코딩테스트 뿌수기 프로젝트",
    solvedCount: 55,
    streak: 12,
    tier: "Platinum",
    tierColor: "text-cyan-600",
    tierBg: "bg-cyan-50",
    todaySolved: false,
    joinDate: "2026-01-01",
    favoriteTag: "그래프",
  },
  {
    id: 4,
    name: "최유나",
    emoji: "🦋",
    role: "멤버",
    bio: "풀스택 개발자 되는 그날까지",
    solvedCount: 29,
    streak: 3,
    tier: "Silver",
    tierColor: "text-slate-500",
    tierBg: "bg-slate-50",
    todaySolved: true,
    joinDate: "2026-01-15",
    favoriteTag: "수학",
  },
  {
    id: 5,
    name: "정태양",
    emoji: "🐯",
    role: "멤버",
    bio: "CS 기초부터 탄탄히",
    solvedCount: 48,
    streak: 9,
    tier: "Gold",
    tierColor: "text-yellow-600",
    tierBg: "bg-yellow-50",
    todaySolved: false,
    joinDate: "2026-01-15",
    favoriteTag: "BFS",
  },
];

export const PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "A+B",
    number: "1000",
    platform: "BOJ",
    difficulty: "Bronze",
    tags: ["입출력"],
    date: "2026-04-01",
    memberId: 1,
    solution: `import sys
input = sys.stdin.readline

a, b = map(int, input().split())
print(a + b)`,
    memo: "기본 입출력 문제. readline 사용하는 습관 들이기!",
    timeSpent: 5,
    url: "https://www.acmicpc.net/problem/1000",
  },
  {
    id: 2,
    title: "최단경로",
    number: "1753",
    platform: "BOJ",
    difficulty: "Gold",
    tags: ["그래프", "다익스트라"],
    date: "2026-04-02",
    memberId: 3,
    solution: `import heapq
import sys
input = sys.stdin.readline

V, E = map(int, input().split())
K = int(input())
graph = [[] for _ in range(V + 1)]
for _ in range(E):
    u, v, w = map(int, input().split())
    graph[u].append((w, v))

INF = float('inf')
dist = [INF] * (V + 1)
dist[K] = 0
heap = [(0, K)]
while heap:
    d, u = heapq.heappop(heap)
    if d > dist[u]: continue
    for w, v in graph[u]:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
            heapq.heappush(heap, (dist[v], v))

for i in range(1, V + 1):
    print(dist[i] if dist[i] != INF else 'INF')`,
    memo: "다익스트라 기본 구현. 우선순위 큐 사용. i*i부터 탐색하는 최적화 기억!",
    timeSpent: 45,
    url: "https://www.acmicpc.net/problem/1753",
  },
  {
    id: 3,
    title: "가장 큰 수",
    number: "",
    platform: "Programmers",
    difficulty: "Lv.2",
    tags: ["정렬", "문자열"],
    date: "2026-04-02",
    memberId: 2,
    solution: `def solution(numbers):
    numbers = list(map(str, numbers))
    numbers.sort(key=lambda x: x*3, reverse=True)
    return str(int(''.join(numbers)))`,
    memo: "정렬 기준을 문자열 3배 반복으로! 0으로만 이루어진 경우 처리 주의.",
    timeSpent: 30,
    url: "https://school.programmers.co.kr/learn/courses/30/lessons/42746",
  },
  {
    id: 4,
    title: "Two Sum",
    number: "1",
    platform: "LeetCode",
    difficulty: "Easy",
    tags: ["해시맵"],
    date: "2026-04-03",
    memberId: 1,
    solution: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
    memo: "해시맵으로 O(n) 풀이. 브루트포스는 O(n²) 이므로 해시맵 무조건 쓰기.",
    timeSpent: 15,
    url: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: 5,
    title: "토마토",
    number: "7576",
    platform: "BOJ",
    difficulty: "Gold",
    tags: ["BFS"],
    date: "2026-04-03",
    memberId: 5,
    solution: `from collections import deque
import sys
input = sys.stdin.readline

M, N = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(N)]
queue = deque()

for i in range(N):
    for j in range(M):
        if grid[i][j] == 1:
            queue.append((i, j, 0))

dx, dy = [0,0,1,-1], [1,-1,0,0]
day = 0
while queue:
    x, y, d = queue.popleft()
    day = max(day, d)
    for k in range(4):
        nx, ny = x+dx[k], y+dy[k]
        if 0 <= nx < N and 0 <= ny < M and grid[nx][ny] == 0:
            grid[nx][ny] = 1
            queue.append((nx, ny, d+1))

print(-1 if any(0 in row for row in grid) else day)`,
    memo: "BFS 멀티소스. 처음부터 모든 익은 토마토를 큐에 넣기!",
    timeSpent: 40,
    url: "https://www.acmicpc.net/problem/7576",
  },
  {
    id: 6,
    title: "1, 2, 3 더하기",
    number: "9095",
    platform: "BOJ",
    difficulty: "Silver",
    tags: ["DP"],
    date: "2026-04-04",
    memberId: 4,
    solution: `import sys
input = sys.stdin.readline

T = int(input())
dp = [0] * 12
dp[1] = 1; dp[2] = 2; dp[3] = 4
for i in range(4, 12):
    dp[i] = dp[i-1] + dp[i-2] + dp[i-3]

for _ in range(T):
    print(dp[int(input())])`,
    memo: "dp[i] = dp[i-1] + dp[i-2] + dp[i-3]. 미리 계산해두기.",
    timeSpent: 20,
    url: "https://www.acmicpc.net/problem/9095",
  },
  {
    id: 7,
    title: "Longest Palindromic Substring",
    number: "5",
    platform: "LeetCode",
    difficulty: "Medium",
    tags: ["DP", "문자열"],
    date: "2026-04-04",
    memberId: 3,
    solution: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)
        res = s[0]
        for center in range(2 * n - 1):
            l = center // 2
            r = l + center % 2
            while l >= 0 and r < n and s[l] == s[r]:
                if r - l + 1 > len(res):
                    res = s[l:r+1]
                l -= 1
                r += 1
        return res`,
    memo: "중심 확장법 O(n²). Manacher 알고리즘 O(n) 도 공부할 것!",
    timeSpent: 60,
    url: "https://leetcode.com/problems/longest-palindromic-substring/",
  },
  {
    id: 8,
    title: "주식 가격",
    number: "",
    platform: "Programmers",
    difficulty: "Lv.2",
    tags: ["스택/큐"],
    date: "2026-04-05",
    memberId: 2,
    solution: `def solution(prices):
    n = len(prices)
    answer = [0] * n
    stack = []
    for i in range(n):
        while stack and prices[stack[-1]] > prices[i]:
            j = stack.pop()
            answer[j] = i - j
        stack.append(i)
    for i in stack:
        answer[i] = n - 1 - i
    return answer`,
    memo: "스택 활용. 가격이 떨어질 때마다 pop하고 차이 계산.",
    timeSpent: 35,
    url: "https://school.programmers.co.kr/learn/courses/30/lessons/42584",
  },
  {
    id: 9,
    title: "수 찾기",
    number: "1920",
    platform: "BOJ",
    difficulty: "Silver",
    tags: ["이분탐색"],
    date: "2026-04-05",
    memberId: 1,
    solution: `import sys
input = sys.stdin.readline
from bisect import bisect_left

N = int(input())
A = sorted(list(map(int, input().split())))
M = int(input())
B = list(map(int, input().split()))

for b in B:
    i = bisect_left(A, b)
    print(1 if i < len(A) and A[i] == b else 0)`,
    memo: "bisect 모듈 활용. 직접 while 이분탐색도 익혀두기.",
    timeSpent: 15,
    url: "https://www.acmicpc.net/problem/1920",
  },
  {
    id: 10,
    title: "전력망을 둘로 나누기",
    number: "",
    platform: "Programmers",
    difficulty: "Lv.2",
    tags: ["완전탐색", "BFS"],
    date: "2026-04-05",
    memberId: 5,
    solution: `from collections import deque

def bfs(n, graph, exclude):
    visited = [False] * (n + 1)
    visited[1] = True
    q = deque([1])
    cnt = 1
    while q:
        v = q.popleft()
        for u in graph[v]:
            if not visited[u] and set([v,u]) != set(exclude):
                visited[u] = True
                cnt += 1
                q.append(u)
    return cnt

def solution(n, wires):
    graph = [[] for _ in range(n + 1)]
    for a, b in wires:
        graph[a].append(b)
        graph[b].append(a)
    ans = n
    for wire in wires:
        cnt = bfs(n, graph, wire)
        ans = min(ans, abs(n - 2 * cnt))
    return ans`,
    memo: "간선 하나씩 제거 후 BFS로 크기 차이 계산. O(n²) 완전탐색.",
    timeSpent: 50,
    url: "https://school.programmers.co.kr/learn/courses/30/lessons/86971",
  },
  {
    id: 11,
    title: "Maximum Subarray",
    number: "53",
    platform: "LeetCode",
    difficulty: "Medium",
    tags: ["DP", "그리디"],
    date: "2026-04-06",
    memberId: 1,
    solution: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        max_sum = curr_sum = nums[0]
        for num in nums[1:]:
            curr_sum = max(num, curr_sum + num)
            max_sum = max(max_sum, curr_sum)
        return max_sum`,
    memo: "카데인 알고리즘! curr_sum이 음수면 버리고 새로 시작.",
    timeSpent: 25,
    url: "https://leetcode.com/problems/maximum-subarray/",
  },
  {
    id: 12,
    title: "소수 구하기",
    number: "1929",
    platform: "BOJ",
    difficulty: "Silver",
    tags: ["수학"],
    date: "2026-04-06",
    memberId: 4,
    solution: `import sys
input = sys.stdin.readline

M, N = map(int, input().split())
sieve = [True] * (N + 1)
sieve[0] = sieve[1] = False
for i in range(2, int(N**0.5) + 1):
    if sieve[i]:
        for j in range(i*i, N+1, i):
            sieve[j] = False

for i in range(M, N+1):
    if sieve[i]:
        print(i)`,
    memo: "에라토스테네스의 체. i*i부터 시작하는 최적화 중요!",
    timeSpent: 20,
    url: "https://www.acmicpc.net/problem/1929",
  },
];

export const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; bg: string; text: string; color: string }
> = {
  BOJ: {
    label: "백준",
    bg: "bg-sky-100",
    text: "text-sky-700",
    color: "#0ea5e9",
  },
  LeetCode: {
    label: "LeetCode",
    bg: "bg-amber-100",
    text: "text-amber-700",
    color: "#f59e0b",
  },
  Programmers: {
    label: "프로그래머스",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    color: "#10b981",
  },
  Codeforces: {
    label: "Codeforces",
    bg: "bg-blue-100",
    text: "text-blue-700",
    color: "#3b82f6",
  },
  SWEA: {
    label: "SWEA",
    bg: "bg-orange-100",
    text: "text-orange-700",
    color: "#f97316",
  },
};

export const DIFFICULTY_BY_PLATFORM: Record<Platform, string[]> = {
  BOJ: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby"],
  LeetCode: ["Easy", "Medium", "Hard"],
  Programmers: ["Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5"],
  Codeforces: ["Div.3", "Div.2", "Div.1"],
  SWEA: ["D2", "D3", "D4", "D5"],
};

export const DIFFICULTY_CONFIG: Record<string, { bg: string; text: string }> = {
  Bronze: { bg: "bg-amber-100", text: "text-amber-800" },
  Silver: { bg: "bg-slate-100", text: "text-slate-600" },
  Gold: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Platinum: { bg: "bg-cyan-100", text: "text-cyan-700" },
  Diamond: { bg: "bg-indigo-100", text: "text-indigo-700" },
  Ruby: { bg: "bg-rose-100", text: "text-rose-700" },
  Easy: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Medium: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Hard: { bg: "bg-red-100", text: "text-red-700" },
  "Lv.1": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Lv.2": { bg: "bg-sky-100", text: "text-sky-700" },
  "Lv.3": { bg: "bg-violet-100", text: "text-violet-700" },
  "Lv.4": { bg: "bg-orange-100", text: "text-orange-700" },
  "Lv.5": { bg: "bg-red-100", text: "text-red-700" },
  "Div.3": { bg: "bg-green-100", text: "text-green-700" },
  "Div.2": { bg: "bg-blue-100", text: "text-blue-700" },
  "Div.1": { bg: "bg-purple-100", text: "text-purple-700" },
  D2: { bg: "bg-green-100", text: "text-green-700" },
  D3: { bg: "bg-sky-100", text: "text-sky-700" },
  D4: { bg: "bg-orange-100", text: "text-orange-700" },
  D5: { bg: "bg-red-100", text: "text-red-700" },
};

export const ALL_TAGS = [
  "DP",
  "BFS",
  "DFS",
  "그리디",
  "정렬",
  "이분탐색",
  "그래프",
  "문자열",
  "스택/큐",
  "완전탐색",
  "투포인터",
  "해시맵",
  "수학",
  "시뮬레이션",
  "트리",
  "입출력",
  "다익스트라",
];

// Deterministic "fake" activity for heatmap
export const getDayActivity = (dateStr: string, memberId: number): number => {
  const hash = dateStr
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), memberId * 13);
  const mod = hash % 10;
  if (mod < 4) return 0;
  if (mod < 7) return 1;
  if (mod < 9) return 2;
  return 3;
};
