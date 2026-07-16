// 문제별 해설·암기 자료. "왜 이 접근인지"를 중심으로 작성.
"use strict";

const SOLUTIONS = {
  1: {
    pattern: "정렬 + 복합 키 tie-break",
    complexity: "O(N log N)",
    why: `"상위 K개"가 보이면 일단 정렬을 떠올린다. 핵심은 **기준이 2개**(점수 내림차순, 이름 오름차순)라는 것.
파이썬 정렬은 튜플을 앞에서부터 비교하므로, **점수에 마이너스를 붙여** \`(-점수, 이름)\` 튜플을 만들면
오름차순 정렬 한 번으로 두 기준이 동시에 해결된다. 이 "부호 뒤집기" 관용구는 코테에서 수십 번 다시 쓴다.`,
    annotated: `\`\`\`python
import sys
input = sys.stdin.readline        # 입력이 많을 때 필수 (input()보다 수십 배 빠름)

n, k = map(int, input().split())
rows = []
for _ in range(n):
    name, score = input().split()
    rows.append((-int(score), name))   # 핵심: 점수에 -를 붙여 내림차순 효과
rows.sort()                            # 튜플은 (첫 원소, 둘째 원소) 순으로 비교됨
print('\\n'.join(name for _, name in rows[:k]))   # 상위 K개만 잘라 출력
\`\`\``,
    pitfalls: [
      "print를 반복문에서 N번 호출하면 느리다 → '\\n'.join으로 한 번에",
      "점수를 문자열인 채 정렬하면 '9' > '10' 이 된다 → int 변환 필수",
    ],
    core: "rows.append((-score, name)); rows.sort() — 내림차순은 부호 뒤집기",
  },
  2: {
    pattern: "해시 카운팅 (Counter)",
    complexity: "O(N)",
    why: `"가장 많이/적게 나온 것"은 무조건 해시 카운팅이다. 딕셔너리에 개수를 세면 O(N).
동률일 때 사전순 앞을 고르는 것도 튜플 비교로 해결: \`(-개수, 이름)\`이 가장 작은 것을 min으로 뽑으면
개수 많은 순 → 이름 빠른 순이 한 줄에 된다. 1번 문제의 부호 뒤집기와 같은 원리다.`,
    annotated: `\`\`\`python
import sys
from collections import Counter    # 카운팅 전용 딕셔너리

data = sys.stdin.read().split()    # 한 번에 전부 읽기 (줄 단위 입력보다 빠름)
n = int(data[0])
c = Counter(data[1:1 + n])         # {제목: 판매수}
# (-개수, 제목)이 가장 '작은' 항목 = 개수 최대, 동률이면 사전순 앞
print(min(c.items(), key=lambda kv: (-kv[1], kv[0]))[0])
\`\`\``,
    pitfalls: [
      "max(key=개수)만 쓰면 동률 처리가 안 된다 → 튜플 키로 두 기준을 한 번에",
      "sys.stdin.read().split()은 공백·개행 구분 없이 토큰화된다 — 이름에 공백 없을 때만 사용",
    ],
    core: "Counter(리스트) → min(c.items(), key=lambda kv: (-kv[1], kv[0]))",
  },
  3: {
    pattern: "격자 BFS (최단 거리)",
    complexity: "O(N×M)",
    why: `가중치 없는 격자/그래프의 **최단 거리는 무조건 BFS**다. DFS는 최단을 보장하지 않는다.
방문 체크와 거리 저장을 dist 배열 하나로 겸하는 게 요령: 0이면 미방문, 값이 있으면 그게 거리.
큐는 deque를 쓴다(list.pop(0)은 O(N)이라 느림). 이 뼈대는 미로·전염·최단 이동 문제에 그대로 재사용된다.`,
    annotated: `\`\`\`python
import sys
from collections import deque
input = sys.stdin.readline

n, m = map(int, input().split())
grid = [input().strip() for _ in range(n)]
dist = [[0] * m for _ in range(n)]       # 0 = 미방문, 값 = 시작부터의 칸 수
dist[0][0] = 1                            # 출발 칸 포함이므로 1에서 시작
q = deque([(0, 0)])
while q:
    x, y = q.popleft()                    # BFS는 popleft (DFS는 pop)
    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):   # 4방향 상수는 외워 쓰기
        nx, ny = x + dx, y + dy
        if 0 <= nx < n and 0 <= ny < m and grid[nx][ny] == '1' and dist[nx][ny] == 0:
            dist[nx][ny] = dist[x][y] + 1  # 큐에 넣을 때 거리 확정 (중복 방지)
            q.append((nx, ny))
print(dist[n-1][m-1] if dist[n-1][m-1] else (1 if n == m == 1 else -1))
\`\`\``,
    pitfalls: [
      "방문 체크를 큐에서 꺼낼 때 하면 같은 칸이 여러 번 들어가 시간 초과 → 넣을 때 체크",
      "1×1 격자(출발=도착) 같은 경계 케이스를 마지막에 따로 생각할 것",
    ],
    core: "deque + dist배열(방문 겸용) + 넣을 때 dist[nx][ny] = dist[x][y]+1",
  },
  4: {
    pattern: "JOIN + GROUP BY + 정렬",
    complexity: "—",
    why: `두 테이블을 잇는 기본기. "고객별 합계"처럼 **~별이 나오면 GROUP BY**다.
JOIN(INNER)은 양쪽에 다 있는 행만 남기므로 "주문한 적 있는 고객만"이라는 조건이 공짜로 해결된다.
GROUP BY는 id로 하는 게 안전하다(이름이 중복돼도 다른 고객으로 취급됨).`,
    annotated: `\`\`\`sql
SELECT c.name, SUM(o.amount) AS total_amount   -- 출력 컬럼명은 문제가 요구한 별칭으로
FROM customers c
JOIN orders o ON o.customer_id = c.id          -- INNER JOIN = 주문 없는 고객 자동 제외
GROUP BY c.id                                  -- '고객별' → GROUP BY (이름 말고 id로)
ORDER BY total_amount DESC, c.name;            -- 1순위 금액↓, 동률이면 이름↑
\`\`\``,
    pitfalls: [
      "LEFT JOIN을 쓰면 주문 없는 고객(NULL 합계)이 끼어든다 — 문제 조건을 먼저 읽고 JOIN 종류 결정",
      "ORDER BY에 별칭(total_amount)을 쓸 수 있다는 것 기억",
    ],
    core: "JOIN ON 외래키 → GROUP BY id → SUM() → ORDER BY 별칭",
  },
  5: {
    pattern: "윈도우 함수 RANK() OVER",
    complexity: "—",
    why: `"그룹별 순위"는 GROUP BY로는 못 푼다(그룹당 한 행으로 접혀버림). 행을 유지한 채
그룹 안에서 계산하는 게 **윈도우 함수**: \`RANK() OVER (PARTITION BY 그룹 ORDER BY 기준)\`.
RANK는 동점에 같은 순위를 주고 다음 순위를 건너뛴다(1,2,2,4). 안 건너뛰는 건 DENSE_RANK(1,2,2,3).
이 구분은 코테 단골 함정이다.`,
    annotated: `\`\`\`sql
SELECT dept, name, salary,
       RANK() OVER (                       -- 행을 접지 않고 그룹 내 계산
         PARTITION BY dept                 -- 부서마다 따로
         ORDER BY salary DESC              -- 급여 높은 순으로 순위
       ) AS salary_rank
FROM employees
ORDER BY dept, salary_rank, name;          -- 최종 출력 정렬은 별도로 지정
\`\`\``,
    pitfalls: [
      "RANK(1,2,2,4) vs DENSE_RANK(1,2,2,3) vs ROW_NUMBER(동점 무시 1,2,3,4) 구분",
      "OVER 안의 ORDER BY와 문장 끝의 ORDER BY는 완전히 별개다",
    ],
    core: "RANK() OVER (PARTITION BY 그룹 ORDER BY 기준 DESC)",
  },
  6: {
    pattern: "완전탐색 (3중 루프 조합)",
    complexity: "O(N³) — N≤100이라 최대 16만 회",
    why: `N이 작으면(≤100~500) 머리 쓰지 말고 **다 해보는 게 정답**이다. "세 개 골라 조건 최적화"는
i<j<k 3중 루프가 표준형. 완전탐색인지 판단하는 기준은 연산량: N³ ≈ 10⁶이면 파이썬도 1초 안에 돈다.
작은 가지치기(두 장 합이 이미 M 이상이면 스킵)로 상수를 줄일 수 있다.`,
    annotated: `\`\`\`python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
c = list(map(int, input().split()))
best = 0
for i in range(n):
    for j in range(i + 1, n):          # i < j < k 로 같은 조합 중복 방지
        if c[i] + c[j] >= m:
            continue                    # 세 번째 카드(≥1)를 더하면 무조건 초과 → 가지치기
        for k in range(j + 1, n):
            s = c[i] + c[j] + c[k]
            if best < s <= m:           # M 이하 중 최대 갱신
                best = s
print(best)
\`\`\``,
    pitfalls: [
      "range 시작을 i+1, j+1로 안 하면 같은 카드를 두 번 쓰거나 중복 조합이 생긴다",
      "N이 크면(수천~) 완전탐색 불가 → 그때 정렬+투포인터나 이분탐색으로 전환",
    ],
    core: "for i / for j in range(i+1,n) / for k in range(j+1,n) — 조합 3중 루프",
  },
  7: {
    pattern: "그리디 (큰 단위부터)",
    complexity: "O(단위 수)",
    why: `동전 단위가 배수 관계(500=100×5, 100=50×2…)면 **큰 것부터 최대한 쓰는 게 항상 최적**이다.
이게 그리디가 성립하는 조건이고, 단위가 배수 관계가 아니면(예: 1,3,4로 6 만들기) 그리디가 깨져서 DP로 가야 한다.
"그리디를 써도 되는 근거"를 한 줄이라도 생각하는 습관이 중요하다.`,
    annotated: `\`\`\`python
n = int(input())
cnt = 0
for coin in (500, 100, 50, 10, 5, 1):   # 반드시 큰 단위부터
    cnt += n // coin                     # 이 단위로 최대 개수
    n %= coin                            # 남은 금액
print(cnt)
\`\`\``,
    pitfalls: [
      "단위가 배수 관계가 아니면 그리디 오답 (1,3,4로 6 → 그리디 4+1+1=3개, 정답 3+3=2개) → DP",
      "// 와 % 한 쌍으로 처리하는 것이 뼈대",
    ],
    core: "for coin in 큰순: cnt += n//coin; n %= coin (배수 관계일 때만)",
  },
  8: {
    pattern: "그리디 (회의실 배정 = 끝나는 시간 정렬)",
    complexity: "O(N log N)",
    why: `"겹치지 않게 최대한 많이"는 그리디의 대표 문제. **가장 빨리 끝나는 것부터 고르면**
남는 시간이 항상 최대라서 이후 선택지가 가장 많다 — 이게 최적인 이유다.
시작 시간 정렬로 착각하면 오답(길게 걸치는 회의 하나가 다 막아버림). "종료 기준 정렬"을 몸에 새길 것.`,
    annotated: `\`\`\`python
import sys
input = sys.stdin.readline

n = int(input())
iv = [tuple(map(int, input().split())) for _ in range(n)]
iv.sort(key=lambda x: (x[1], x[0]))     # 핵심: 끝나는 시간 기준 정렬
cnt, end = 0, -1
for s, e in iv:
    if s >= end:                         # 이전 종료 시각 이후에 시작하면 채택
        cnt += 1
        end = e                          # 종료 시각 갱신
print(cnt)
\`\`\``,
    pitfalls: [
      "시작 시간 정렬은 오답 — 반례: (0,100), (1,2), (2,3)",
      "'끝나는 시각 = 시작 가능'이면 s >= end, 불가면 s > end — 문제 조건 확인",
    ],
    core: "끝 시간 sort → if s >= end: cnt+=1; end = e",
  },
  9: {
    pattern: "이분탐색 (bisect로 위치 찾기)",
    complexity: "O((N+Q) log N)",
    why: `정렬된 배열에서 "있냐/어디냐"는 이분탐색. 파이썬은 직접 구현보다 **bisect_left**를 쓰는 게
빠르고 실수도 없다. bisect_left(arr, x)는 x가 들어갈 가장 왼쪽 인덱스를 주므로,
그 위치의 값이 x면 존재, 아니면 없음 — 이 2줄 판정이 관용구다.`,
    annotated: `\`\`\`python
import sys
from bisect import bisect_left

data = sys.stdin.buffer.read().split()   # 대량 입력은 buffer.read가 가장 빠름
n = int(data[0])
arr = list(map(int, data[1:1 + n]))
q = int(data[1 + n])
out = []
for tok in data[2 + n:2 + n + q]:
    x = int(tok)
    i = bisect_left(arr, x)              # x가 들어갈 왼쪽 위치
    out.append(str(i) if i < n and arr[i] == x else '-1')   # 존재 판정 관용구
print('\\n'.join(out))
\`\`\``,
    pitfalls: [
      "i < n 범위 체크 없이 arr[i]에 접근하면 IndexError (x가 최댓값보다 클 때)",
      "in 연산(x in arr)은 O(N)이라 Q번 하면 시간 초과",
    ],
    core: "i = bisect_left(arr, x); 존재 = i < n and arr[i] == x",
  },
  10: {
    pattern: "파라메트릭 서치 (답을 이분탐색)",
    complexity: "O(K log(최대길이))",
    why: `"최대 길이가 얼마냐"를 직접 구하기 어렵지만, **"길이 x로 N개를 만들 수 있냐?"는 판정은 쉽다**
(각 케이블에서 c//x개씩 나옴). 이렇게 판정 함수가 단조(x가 커질수록 개수는 줄어듦)면
답 자체를 이분탐색할 수 있다 — 이게 파라메트릭 서치이고, "최대화/최소화 + 판정 가능" 문제의 만능 틀이다.`,
    annotated: `\`\`\`python
import sys
input = sys.stdin.readline

k, n = map(int, input().split())
cables = [int(input()) for _ in range(k)]
lo, hi, ans = 1, max(cables), 1
while lo <= hi:
    mid = (lo + hi) // 2
    if sum(c // mid for c in cables) >= n:   # 판정: 길이 mid로 n개 가능?
        ans = mid                             # 가능 → 답 후보 저장하고
        lo = mid + 1                          #        더 긴 쪽 도전
    else:
        hi = mid - 1                          # 불가능 → 짧은 쪽으로
print(ans)
\`\`\``,
    pitfalls: [
      "lo=0으로 시작하면 c//0 division error — 답의 최솟값(1)부터",
      "'가능하면 ans 저장 후 lo=mid+1' 패턴을 통째로 암기 (경계 헷갈림 방지)",
    ],
    core: "while lo<=hi: 판정(mid) → 가능이면 ans=mid, lo=mid+1 / 불가면 hi=mid-1",
  },
  11: {
    pattern: "DP 기본형 (피보나치 점화식)",
    complexity: "O(N)",
    why: `n번째 계단에 오는 방법 = (n-1에서 1칸) + (n-2에서 2칸). 즉 **dp[n] = dp[n-1] + dp[n-2]**.
DP의 본질은 "큰 문제의 답을 작은 문제의 답으로 표현하는 식(점화식)을 세우는 것"이고,
이 문제가 그 최소 단위다. 배열 없이 변수 2개만 굴리면 메모리도 O(1). 나머지 연산(MOD)은 매 단계에서.`,
    annotated: `\`\`\`python
n = int(input())
MOD = 1_000_000_007        # 코테 단골 소수 — 그대로 외우기
a, b = 1, 2                # a=dp[1], b=dp[2]
if n == 1: print(1)
elif n == 2: print(2)
else:
    for _ in range(3, n + 1):
        a, b = b, (a + b) % MOD    # 매 단계 % — 마지막에 한 번만 하면 수가 거대해져 느려짐
    print(b)
\`\`\``,
    pitfalls: [
      "n=1, n=2 초기값 처리를 빼먹으면 바로 틀림 — DP는 항상 초기값부터",
      "% MOD를 반복문 안에서: 파이썬은 오버플로는 없지만 큰 수 연산으로 느려진다",
    ],
    core: "점화식 dp[n]=dp[n-1]+dp[n-2], 변수 2개 롤링, 매 단계 % MOD",
  },
  12: {
    pattern: "카데인 알고리즘 (최대 연속 부분합)",
    complexity: "O(N)",
    why: `"연속 구간 합의 최대"의 정석. 각 위치에서의 질문은 하나다:
**"이전 구간에 이어붙일까, 여기서 새로 시작할까?"** → cur = max(x, cur + x).
이전 누적이 음수면 버리고 새로 시작하는 게 이득이라는 직관이 이 한 줄에 담겨 있다.
전체 답은 각 위치 cur의 최댓값.`,
    annotated: `\`\`\`python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
best = cur = a[0]                  # 초기값은 첫 원소 (0으로 시작하면 전부 음수일 때 틀림)
for x in a[1:]:
    cur = max(x, cur + x)          # 이어붙이기 vs 새 출발
    best = max(best, cur)
print(best)
\`\`\``,
    pitfalls: [
      "best=0으로 초기화하면 전원 음수 입력에서 오답 — 반드시 a[0]으로",
      "'빈 구간 허용' 여부를 문제에서 확인 (이 문제는 하루 이상 필수)",
    ],
    core: "cur = max(x, cur+x); best = max(best, cur) — 초기값은 a[0]",
  },
  13: {
    pattern: "LIS (가장 긴 증가 부분 수열, bisect 버전)",
    complexity: "O(N log N)",
    why: `LIS는 두 가지 풀이를 알아야 한다. ① O(N²) DP: dp[i] = max(dp[j])+1 (j<i, a[j]<a[i]) — 이해용.
② **tails + bisect**: tails[k] = "길이 k+1 증가수열의 가장 작은 끝값". 각 원소를 tails에서
이분탐색으로 꽂으면(같거나 큰 첫 위치를 교체, 끝이면 연장) tails 길이가 곧 LIS 길이다.
N이 크면 ②만 통과한다.`,
    annotated: `\`\`\`python
import sys
from bisect import bisect_left
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
tails = []                          # tails[k] = 길이 k+1 수열의 최소 끝값
for x in a:
    i = bisect_left(tails, x)       # 엄격 증가 → bisect_left (같으면 교체됨)
    if i == len(tails):
        tails.append(x)             # 모든 끝값보다 크다 → 수열 연장
    else:
        tails[i] = x                # 같은 길이를 더 작은 끝값으로 교체 (미래를 위한 투자)
print(len(tails))
\`\`\``,
    pitfalls: [
      "'증가'가 엄격(<)이면 bisect_left, 같아도 되면(≤) bisect_right — 반대로 쓰면 오답",
      "tails는 LIS 자체가 아니라 길이만 맞다 (실제 수열 복원은 별도 작업)",
    ],
    core: "for x: i=bisect_left(tails,x); 끝이면 append, 아니면 tails[i]=x → len(tails)",
  },
  14: {
    pattern: "그래프 연결 요소 세기 (BFS 반복)",
    complexity: "O(N + M)",
    why: `"서로 이어진 덩어리가 몇 개냐"는 모든 정점을 돌며 **미방문 정점을 만날 때마다 카운트+1 하고
그 덩어리 전체를 BFS/DFS로 방문 처리**하면 끝. 인접 리스트(adj)로 그래프를 만드는 것,
양방향이면 양쪽에 append하는 것까지가 그래프 문제의 공통 준비 동작이다.`,
    annotated: `\`\`\`python
import sys
from collections import deque
input = sys.stdin.readline

n, m = map(int, input().split())
adj = [[] for _ in range(n + 1)]       # 1번부터 쓰려고 n+1칸
for _ in range(m):
    a, b = map(int, input().split())
    adj[a].append(b); adj[b].append(a) # 무방향 → 양쪽 등록
seen = [False] * (n + 1)
cnt = 0
for s in range(1, n + 1):              # 모든 정점을 시작 후보로
    if seen[s]: continue
    cnt += 1                            # 새 덩어리 발견
    seen[s] = True
    q = deque([s])
    while q:                            # 덩어리 전체 방문 처리
        u = q.popleft()
        for v in adj[u]:
            if not seen[v]:
                seen[v] = True; q.append(v)
print(cnt)
\`\`\``,
    pitfalls: [
      "간선 없는 외톨이 정점도 덩어리 1개 — 시작 루프를 전 정점으로 돌리면 자동 해결",
      "재귀 DFS는 파이썬 재귀 한도(1000)에 걸릴 수 있다 → BFS나 스택 DFS 권장",
    ],
    core: "미방문 정점마다 cnt+=1 후 BFS로 전부 방문 처리",
  },
  15: {
    pattern: "멀티소스 BFS (동시 확산)",
    complexity: "O(N×M)",
    why: `감염원이 여러 개고 **동시에** 퍼진다 → 시작점을 전부 큐에 넣고 BFS 한 번이면 된다.
(하나씩 BFS하면 시간도 오답도 난다.) 큐에 (좌표, 일수)를 함께 넣으면 마지막으로 꺼낸 일수가 답.
다 끝나고 '1'이 남아 있으면 도달 불가(-1). 백준 '토마토' 유형으로 기업 코테에도 자주 나온다.`,
    annotated: `\`\`\`python
import sys
from collections import deque
input = sys.stdin.readline

n, m = map(int, input().split())
g = [list(input().strip()) for _ in range(n)]
q = deque()
for i in range(n):
    for j in range(m):
        if g[i][j] == '2':
            q.append((i, j, 0))          # 핵심: 모든 감염원을 0일차로 동시 투입
days = 0
while q:
    x, y, d = q.popleft()
    days = d                              # 마지막으로 꺼낸 것의 일수 = 총 소요일
    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < n and 0 <= ny < m and g[nx][ny] == '1':
            g[nx][ny] = '2'               # 격자 자체를 방문 표시로 재활용
            q.append((nx, ny, d + 1))
print(-1 if any('1' in row for row in g) else days)
\`\`\``,
    pitfalls: [
      "감염원별로 따로 BFS 돌리면 '동시 확산'이 아니게 됨 — 전부 큐에 넣고 시작",
      "처음부터 '1'이 없으면 0 출력 — days 초기값 0이 이를 자동 처리",
    ],
    core: "시작점 전부 큐에 (x,y,0)으로 → BFS 한 번 → 마지막 d가 답",
  },
  16: {
    pattern: "집합 차집합 (set)",
    complexity: "O(N + M)",
    why: `"명단 A에는 있는데 B에는 없는 사람" = **차집합**. 리스트로 'in' 검사를 하면 O(N×M)으로
시간 초과지만, set은 조회가 O(1)이라 차집합 전체가 O(N+M)이다.
"명단, 중복 체크, 있냐없냐"라는 단어가 보이면 반사적으로 set/dict를 꺼낼 것.`,
    annotated: `\`\`\`python
import sys

data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
arrived = set(data[2:2 + n])          # 출근 명단
left = set(data[2 + n:2 + n + m])     # 퇴근 명단
print('\\n'.join(sorted(arrived - left)))   # 차집합 → 사전순 정렬 → 한 번에 출력
\`\`\``,
    pitfalls: [
      "리스트로 x in list 반복 → O(N²) 시간 초과. set의 존재 이유",
      "set은 순서가 없다 — 출력 전 sorted() 필수",
    ],
    core: "set(A) - set(B) → sorted() → join 출력",
  },
  17: {
    pattern: "중복 제거 + 다중 기준 정렬",
    complexity: "O(N log N)",
    why: `set으로 중복을 없애고, **key 튜플 (len(w), w)**로 정렬하면 "짧은 것부터, 같으면 사전순"이
한 줄로 끝난다. 1번 문제의 (-점수, 이름)과 같은 원리 — 정렬 기준이 몇 개든 튜플에 순서대로 나열하면 된다.
이 문제까지 풀면 '튜플 키 정렬'은 완전히 몸에 붙어야 한다.`,
    annotated: `\`\`\`python
import sys

data = sys.stdin.read().split()
n = int(data[0])
words = sorted(set(data[1:1 + n]),          # set으로 중복 제거
               key=lambda w: (len(w), w))    # 1순위 길이, 2순위 사전순
print('\\n'.join(words))
\`\`\``,
    pitfalls: [
      "중복 제거 없이 정렬만 하면 같은 단어가 여러 번 출력됨",
      "기본 문자열 정렬은 사전순일 뿐 길이순이 아니다 — key 필수",
    ],
    core: "sorted(set(words), key=lambda w: (len(w), w))",
  },
  18: {
    pattern: "SELECT + WHERE + ORDER BY (SQL 기본형)",
    complexity: "—",
    why: `모든 SQL의 뼈대: **어떤 컬럼을(SELECT) 어디서(FROM) 어떤 조건으로(WHERE) 어떻게 정렬해(ORDER BY)**.
쿼리를 읽는 순서는 FROM → WHERE → SELECT → ORDER BY라는 것도 같이 기억해 두면
복잡한 쿼리를 만났을 때 해석이 쉬워진다.`,
    annotated: `\`\`\`sql
SELECT name, stock          -- 요구된 컬럼만, 요구된 순서로
FROM products
WHERE stock < 10            -- '미만' → <  ('이하'면 <=)
ORDER BY stock, name;       -- 기본이 오름차순(ASC) — DESC만 명시하면 됨
\`\`\``,
    pitfalls: [
      "미만(<)/이하(<=) 경계를 문제 그대로 옮길 것 — 채점 데이터가 경계값을 노린다",
      "SELECT * 금지 — 요구 컬럼·순서가 다르면 오답",
    ],
    core: "SELECT 컬럼 FROM 테이블 WHERE 조건 ORDER BY 기준",
  },
  19: {
    pattern: "GROUP BY + HAVING + 집계 함수",
    complexity: "—",
    why: `그룹 조건은 WHERE가 아니라 **HAVING**에 쓴다 — WHERE는 그룹핑 *전* 행 필터,
HAVING은 그룹핑 *후* 그룹 필터다. "메뉴가 2개 이상인 카테고리"는 그룹의 성질이므로
HAVING COUNT(*) >= 2. 집계값에 별칭을 붙이면 ORDER BY에서 재사용할 수 있다.`,
    annotated: `\`\`\`sql
SELECT category, ROUND(AVG(price)) AS avg_price   -- 반올림 요구 → ROUND
FROM menu
GROUP BY category                                 -- 카테고리별로 접기
HAVING COUNT(*) >= 2                              -- 그룹 조건은 HAVING (WHERE 아님!)
ORDER BY avg_price DESC, category;
\`\`\``,
    pitfalls: [
      "WHERE COUNT(*) >= 2 는 에러 — 집계는 WHERE에 못 쓴다",
      "SELECT에 집계 함수와 함께 쓰는 일반 컬럼은 GROUP BY에 있어야 한다",
    ],
    core: "GROUP BY 그룹 → HAVING 그룹조건 → 집계함수(AVG/COUNT/SUM)",
  },
  20: {
    pattern: "스칼라 서브쿼리 비교",
    complexity: "—",
    why: `"평균보다 비싼"처럼 **기준값 자체를 쿼리로 구해야 할 때** 서브쿼리를 쓴다.
(SELECT AVG(price) FROM items)는 값 하나(스칼라)로 계산되므로 비교 연산자 옆에 그대로 넣을 수 있다.
같은 테이블을 두 번 참조하는 게 어색해 보여도 완전히 정상적인 패턴이다.`,
    annotated: `\`\`\`sql
SELECT name, price
FROM items
WHERE price > (SELECT AVG(price) FROM items)   -- 서브쿼리 = 값 하나로 계산됨
ORDER BY price DESC, name;
\`\`\``,
    pitfalls: [
      "초과(>)/이상(>=) 경계 주의 — 평균과 정확히 같은 상품의 포함 여부가 갈린다",
      "서브쿼리에 ORDER BY 등을 넣을 필요 없다 — 값 하나만 구하면 됨",
    ],
    core: "WHERE 컬럼 > (SELECT AVG(컬럼) FROM 같은테이블)",
  },
  21: {
    pattern: "윈도우 누적 합 (SUM OVER ORDER BY)",
    complexity: "—",
    why: `누적합은 \`SUM(컬럼) OVER (ORDER BY 정렬키)\` — ORDER BY가 붙는 순간 "처음부터 현재 행까지"의
누적 프레임이 된다(없으면 전체 합). 5번 문제의 RANK와 함께 윈도우 함수의 양대 기본형이고,
전일 대비 증감(LAG), 이동 평균 등이 전부 이 틀의 변형이다.`,
    annotated: `\`\`\`sql
SELECT day, amount,
       SUM(amount) OVER (ORDER BY day) AS running_total
       -- OVER (ORDER BY day) = day 순서로 '여기까지' 누적
       -- OVER ()            = 전체 합계 (완전히 다른 결과!)
FROM sales
ORDER BY day;
\`\`\``,
    pitfalls: [
      "OVER 안에 ORDER BY를 빼먹으면 전 행이 같은 '전체 합'이 된다 — 대표 오답",
      "GROUP BY 없이도 행별 집계가 가능한 것이 윈도우 함수의 존재 이유",
    ],
    core: "SUM(amount) OVER (ORDER BY day) — ORDER BY가 있어야 누적",
  },
  22: {
    pattern: "스택 / 깊이 카운터",
    complexity: "O(N)",
    why: `괄호 짝은 **가장 최근에 열린 것이 가장 먼저 닫혀야** 하는 구조라 스택이 정석이다.
그런데 괄호가 한 종류뿐이면 스택에 뭘 담는지는 중요하지 않고 **개수(깊이)만** 중요하다.
그래서 depth 카운터 하나로 스택을 대신한다: \`(\`에서 +1, \`)\`에서 -1.
**도중에 음수가 되면**(닫을 게 없는데 닫음) 즉시 실패, **끝났을 때 0이 아니면**(덜 닫힘) 실패.`,
    annotated: `\`\`\`python
s = input().strip()
depth = 0
ok = True
for ch in s:
    depth += 1 if ch == '(' else -1
    if depth < 0:          # ')('처럼 닫을 게 없는데 닫는 순간
        ok = False
        break
print('YES' if ok and depth == 0 else 'NO')   # 끝에 0 = 전부 짝 맞음
\`\`\``,
    pitfalls: [
      "끝의 depth==0만 보면 ')(' 를 YES로 오판한다 — 도중 음수 검사가 필수",
      "괄호가 여러 종류면(()[]{}) 카운터로는 안 되고 진짜 스택에 담아야 한다",
    ],
    core: "여는 것 +1, 닫는 것 -1 — 도중 음수 금지, 끝은 0",
  },
  23: {
    pattern: "투 포인터 (슬라이딩 윈도우)",
    complexity: "O(N)",
    why: `"조건을 만족하는 **연속 구간** 중 최소/최대"는 투 포인터의 신호다.
모든 구간을 다 보면 O(N²)이지만, **원소가 전부 양수**라 창을 늘리면 합이 커지고 줄이면 작아지는 단조성이 있다.
그래서 오른쪽 끝(right)을 한 칸씩 늘리다가, 합이 S 이상이 되면 왼쪽(left)을 최대한 당겨 창을 줄인다.
두 포인터 모두 앞으로만 가므로 전체 이동은 최대 2N번 — O(N).`,
    annotated: `\`\`\`python
best = n + 1                      # '불가능' 표시용 초기값
left = 0
cur = 0                           # 현재 창 [left..right]의 합
for right in range(n):
    cur += a[right]               # 창을 오른쪽으로 한 칸 확장
    while cur >= s:               # 조건 만족 → 창을 최대한 줄여본다
        best = min(best, right - left + 1)
        cur -= a[left]
        left += 1
print(best if best <= n else 0)   # 한 번도 못 만족하면 0
\`\`\``,
    pitfalls: [
      "음수가 섞이면 단조성이 깨져 투 포인터를 못 쓴다 — 이 문제가 '양의 정수'인 이유",
      "while(not if)로 줄여야 한다 — 한 번만 줄이면 최소 길이를 놓친다",
    ],
    core: "for right: 늘리고 → while 조건만족: 기록하고 줄이기",
  },
  24: {
    pattern: "그리디 + 최소 힙 (허프만 합치기)",
    complexity: "O(N log N)",
    why: `먼저 합친 파일일수록 이후 합칠 때마다 비용에 반복해서 포함된다.
그러니 **작은 것부터 합쳐야** 큰 파일이 반복 계산되는 걸 막는다 — 그리디.
"매번 가장 작은 두 개"를 빠르게 꺼내려면 **최소 힙**: 꺼내기/넣기가 O(log N).
정렬을 매번 다시 하면 O(N² log N)로 터진다.`,
    annotated: `\`\`\`python
import heapq
h = list(map(int, input().split()))
heapq.heapify(h)                  # 리스트를 힙 구조로 (O(N))
total = 0
while len(h) > 1:                 # 하나 남을 때까지
    a = heapq.heappop(h)          # 가장 작은 것
    b = heapq.heappop(h)          # 그다음 작은 것
    total += a + b                # 합치는 비용
    heapq.heappush(h, a + b)      # 합쳐진 파일을 다시 후보로
print(total)
\`\`\``,
    pitfalls: [
      "파이썬 heapq는 최소 힙뿐 — 최대 힙이 필요하면 부호를 뒤집어 넣는다",
      "N=1이면 while이 아예 안 돌아 0 — 이 경계를 직접 처리하려다 버그 내기 쉽다",
    ],
    core: "heapify → 작은 둘 pop → 합을 push, 반복 — '작은 것부터'가 최적",
  },
  25: {
    pattern: "누적합 (Prefix Sum)",
    complexity: "전처리 O(N) + 질의당 O(1)",
    why: `질의마다 구간을 직접 더하면 O(N×Q)=100억 — 시간 초과.
**prefix[i] = 앞에서 i개의 합**을 미리 만들어두면, 어떤 구간이든
\`prefix[r] - prefix[l-1]\` 뺄셈 한 번으로 나온다. "구간 합을 여러 번 묻는다" = 무조건 누적합.
prefix를 N+1칸으로 잡고 prefix[0]=0으로 두면 l=1일 때도 예외 없이 같은 식이 된다.`,
    annotated: `\`\`\`python
prefix = [0] * (n + 1)            # prefix[0]=0 (아무것도 안 더한 상태)
for i in range(n):
    prefix[i + 1] = prefix[i] + a[i]   # 앞 합계 + 현재 원소
# 질의 (l, r): l번째~r번째 합
#   = 앞 r개의 합 - 앞 (l-1)개의 합
out.append(str(prefix[r] - prefix[l - 1]))
\`\`\``,
    pitfalls: [
      "1-indexed 문제를 0-indexed 배열로 받으면서 ±1 실수가 최다 오답 원인",
      "질의가 10만 개면 print 반복 대신 join 일괄 출력까지가 세트",
    ],
    core: "prefix[r] - prefix[l-1] — 구간 합은 뺄셈이다",
  },
  26: {
    pattern: "유니온 파인드 (서로소 집합)",
    complexity: "거의 O(1) × (M+Q) — 경로 압축 덕분",
    why: `"연결됐나?"를 반복해서 묻는 문제. BFS로 매 질의마다 탐색하면 O(Q×(N+M))로 터진다.
유니온 파인드는 각 덩어리에 **대표(뿌리)**를 두고, "같은 덩어리인가?"를 "뿌리가 같은가?"로 바꾼다.
find(x)는 부모를 따라 뿌리까지 올라가는 함수인데, 올라가면서 **경로를 압축**(부모를 조부모로 교체)하면
트리가 점점 납작해져 다음 find가 거의 즉시 끝난다.`,
    annotated: `\`\`\`python
parent = list(range(n + 1))       # 처음엔 자기 자신이 뿌리
def find(x):
    while parent[x] != x:         # 뿌리(자기 자신을 가리킴)까지
        parent[x] = parent[parent[x]]   # 경로 절반 압축: 부모→조부모
        x = parent[x]
    return x
# union: 두 뿌리가 다르면 한쪽을 다른 쪽 밑으로
ra, rb = find(a), find(b)
if ra != rb:
    parent[rb] = ra
# 질의: 뿌리가 같으면 같은 네트워크
out.append('YES' if find(x) == find(y) else 'NO')
\`\`\``,
    pitfalls: [
      "parent[a] = b처럼 원소끼리 이으면 안 된다 — 반드시 '뿌리끼리' 이어야 한다",
      "경로 압축 없이 체인형 입력을 받으면 find가 O(N)이 돼 시간 초과",
    ],
    core: "find = 뿌리 찾기(+압축), union = 뿌리끼리 잇기, 같은가 = 뿌리 비교",
  },
  27: {
    pattern: "다익스트라 (가중치 최단경로)",
    complexity: "O((N+M) log N)",
    why: `BFS는 "간선 개수"가 최단일 때만 맞는다. 통행료처럼 **가중치가 다르면** 다익스트라.
아이디어는 BFS와 같은 확산인데, 큐 대신 **최소 힙**을 써서 "지금까지 비용이 가장 싼 도시부터" 확정해 나간다.
음수 가중치만 없다면, 힙에서 꺼낸 순간의 비용이 그 도시의 최종 최단 비용임이 보장된다.
같은 도시가 힙에 여러 번 들어갈 수 있으므로, 꺼냈을 때 이미 더 싼 기록이 있으면 버린다(스킵 규칙).`,
    annotated: `\`\`\`python
import heapq
INF = float('inf')
dist = [INF] * (n + 1)
dist[1] = 0
pq = [(0, 1)]                     # (지금까지 비용, 도시) — 비용이 앞이라 힙이 비용순 정렬
while pq:
    d, u = heapq.heappop(pq)      # 현재 가장 싼 후보
    if d > dist[u]:
        continue                  # 낡은 기록(이미 더 싸게 도달함) → 버림
    for c, v in adj[u]:
        nd = d + c
        if nd < dist[v]:          # 더 싼 경로 발견
            dist[v] = nd
            heapq.heappush(pq, (nd, v))
print(dist[n] if dist[n] != INF else -1)
\`\`\``,
    pitfalls: [
      "if d > dist[u]: continue 를 빼먹으면 낡은 항목을 다 처리해 시간 초과 위험",
      "튜플 순서는 (비용, 노드) — 노드를 앞에 두면 힙이 비용순이 아니게 된다",
      "음수 가중치가 있으면 다익스트라 불가(벨만-포드 영역)",
    ],
    core: "힙에 (비용, 노드), 꺼낼 때 낡은 기록 스킵, 더 싸면 갱신 후 push",
  },
  28: {
    pattern: "백트래킹 (재귀 완전탐색)",
    complexity: "O(2^N) — N ≤ 18이라 최대 26만 갈래",
    why: `각 원소마다 "고른다/안 고른다" 두 갈래 — 전체 경우는 2^N.
N이 18이면 26만이라 다 세어도 된다. 이런 "모든 조합을 빠짐없이"는 재귀(DFS)가 가장 자연스럽다:
i번째 원소에서 두 갈래로 갈라지고, 끝(i==N)에 도달하면 조건을 검사한다.
반복문으로는 N중 for가 필요한 일을 재귀 하나가 대신하는 것.`,
    annotated: `\`\`\`python
count = 0
def dfs(i, acc, picked):          # i: 몇 번째 원소 차례, acc: 지금까지 합
    global count                  # 바깥 변수를 고치려면 global 선언
    if i == n:                    # 모든 원소를 결정했다
        if picked and acc == t:   # '1개 이상' 조건 + 목표 합
            count += 1
        return
    dfs(i + 1, acc + a[i], True)  # 갈래 1: a[i]를 고른다
    dfs(i + 1, acc, picked)       # 갈래 2: 안 고른다
dfs(0, 0, False)
print(count)
\`\`\``,
    pitfalls: [
      "빈 부분집합(아무것도 안 고름)을 세면 T=0에서 답이 1 많아진다 — picked 플래그가 그 방지책",
      "음수가 있으면 '합이 넘었으니 중단' 같은 가지치기를 함부로 못 쓴다",
    ],
    core: "dfs(i+1, 고른 경우) / dfs(i+1, 안 고른 경우) — 끝에서 검사",
  },
  29: {
    pattern: "문자열 구현 (런 스캔)",
    complexity: "O(N)",
    why: `구현 문제는 알고리즘보다 **꼼꼼함** 싸움이다. 같은 문자 구간(런)을 훑는 표준 패턴:
바깥 i는 런의 시작, 안쪽 j는 같은 문자가 끝나는 지점까지 전진 → 런 길이는 j-i, 다음 런은 i=j부터.
결과는 문자열 덧붙이기(+=) 대신 리스트에 모아 join — 파이썬 문자열은 불변이라 += 반복은 느리다.`,
    annotated: `\`\`\`python
parts = []
i = 0
while i < len(s):
    j = i
    while j < len(s) and s[j] == s[i]:
        j += 1                    # 같은 문자가 계속되는 동안 전진
    run = j - i                   # 이 뭉치의 길이
    parts.append(s[i] + (str(run) if run > 1 else ''))   # 1이면 숫자 생략
    i = j                         # 다음 뭉치의 시작으로 점프
comp = ''.join(parts)
print(comp if len(comp) < len(s) else s)   # 안 짧아지면 원본
\`\`\``,
    pitfalls: [
      "'길거나 같으면 원본' — 등호 방향을 문제에서 다시 확인 (< vs <=)",
      "개수 1일 때 숫자 생략 조건을 빼먹으면 abc → a1b1c1로 오답",
    ],
    core: "i=런 시작, j=런 끝까지 전진, i=j로 점프 — 런 스캔 패턴",
  },
};
