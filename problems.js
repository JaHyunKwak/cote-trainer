// 문제 데이터 (모두 직접 창작). 성능 케이스는 용량 때문에 함수로 생성.
"use strict";

function genSortPerfIn() {
  const lines = ["100000 100"];
  for (let i = 0; i < 100000; i++) {
    lines.push(`n${String(i).padStart(6, "0")} ${i % 1000}`);
  }
  return lines.join("\n") + "\n";
}
function genSortPerfOut() {
  const lines = [];
  for (let i = 999; i < 100000; i += 1000) {
    lines.push(`n${String(i).padStart(6, "0")}`);
  }
  return lines.join("\n") + "\n";
}
function genHashPerfIn() {
  return "100000\n" + "aa\nab\n".repeat(50000);
}
function genBfsPerfIn() {
  return "100 100\n" + ("1".repeat(100) + "\n").repeat(100);
}
function genTripleCardIn() {
  return "100 1000000\n" + Array(100).fill("333333").join(" ") + "\n";
}
function genRoomsIn() {
  const L = ["100000"];
  for (let i = 0; i < 100000; i++) L.push(`${i} ${i + 1}`);
  return L.join("\n") + "\n";
}
function genBisectIn() {
  const arr = [], qs = [];
  for (let i = 0; i < 100000; i++) { arr.push(i * 2); qs.push(i); }
  return `100000\n${arr.join(" ")}\n100000\n${qs.join(" ")}\n`;
}
function genBisectOut() {
  const L = [];
  for (let q = 0; q < 100000; q++) L.push(q % 2 === 0 ? String(q / 2) : "-1");
  return L.join("\n") + "\n";
}
function genCableIn() {
  const L = ["100000 100000"];
  for (let i = 1; i <= 100000; i++) L.push(String(i));
  return L.join("\n") + "\n";
}
function genKadaneIn() {
  return "100000\n-5 " + Array(99999).fill("1").join(" ") + "\n";
}
function genLisIn() {
  const a = [];
  for (let i = 0; i < 1000; i++) a.push((i % 100) * 10 + (9 - Math.floor(i / 100)));
  return "1000\n" + a.join(" ") + "\n";
}
function genComponentsIn() {
  const L = ["10000 5000"];
  for (let i = 1; i <= 10000; i += 2) L.push(`${i} ${i + 1}`);
  return L.join("\n") + "\n";
}
function genInfectionIn() {
  const rows = ["2" + "1".repeat(99)];
  for (let i = 1; i < 100; i++) rows.push("1".repeat(100));
  return "100 100\n" + rows.join("\n") + "\n";
}
function genOfficeIn() {
  const inL = [], outL = [];
  for (let i = 0; i < 100000; i++) {
    const nm = `n${String(i).padStart(6, "0")}`;
    inL.push(nm);
    if (i % 2 === 0) outL.push(nm);
  }
  return `100000 50000\n${inL.join("\n")}\n${outL.join("\n")}\n`;
}
function genOfficeOut() {
  const L = [];
  for (let i = 1; i < 100000; i += 2) L.push(`n${String(i).padStart(6, "0")}`);
  return L.join("\n") + "\n";
}
function genWordsIn() {
  const L = [];
  for (let i = 0; i < 100000; i++) {
    const len = (i * 7) % 15 + 1;
    L.push(String.fromCharCode(97 + (i % 26)).repeat(len));
  }
  return "100000\n" + L.join("\n") + "\n";
}
function genWordsOut() {
  const set = new Set();
  for (let i = 0; i < 100000; i++) {
    const len = (i * 7) % 15 + 1;
    set.add(String.fromCharCode(97 + (i % 26)).repeat(len));
  }
  const words = [...set].sort((a, b) => a.length - b.length || (a < b ? -1 : 1));
  return words.join("\n") + "\n";
}
function genParenPerfIn() { return "()".repeat(50000) + "\n"; }
function genTwoPtrPerfIn() { return "100000 50000\n" + Array(100000).fill("1").join(" ") + "\n"; }
function genHeapPerfIn() { return "100000\n" + Array(100000).fill("1").join(" ") + "\n"; }
function genPrefixPerfIn() {
  const qs = [];
  for (let i = 1; i <= 100000; i++) qs.push(`1 ${i}`);
  return "100000 100000\n" + Array(100000).fill("1").join(" ") + "\n" + qs.join("\n") + "\n";
}
function genPrefixPerfOut() {
  const L = [];
  for (let i = 1; i <= 100000; i++) L.push(String(i));
  return L.join("\n") + "\n";
}
function genDsuPerfIn() {
  const L = ["100000 99999 100000"];
  for (let i = 1; i < 100000; i++) L.push(`${i} ${i + 1}`);   // 체인으로 전부 연결
  for (let i = 1; i <= 100000; i++) L.push(`1 ${i}`);          // 질의: 1과 i
  return L.join("\n") + "\n";
}
function genDsuPerfOut() { return "YES\n".repeat(100000); }
function genDijkstraPerfIn() {
  const L = ["10000 9999"];
  for (let i = 1; i < 10000; i++) L.push(`${i} ${i + 1} 1`);   // 일직선 도로
  return L.join("\n") + "\n";
}
function genRlePerfIn() { return "ab".repeat(50000) + "\n"; }
function genRlePerfOut() { return "ab".repeat(50000) + "\n"; } // 압축이 더 길어서 원본 유지

const ALGO_STARTER = "import sys\ninput = sys.stdin.readline\n\n";

const PROBLEMS = [
  {
    id: 1,
    title: "합격자 명단",
    type: "algo",
    difficulty: "쉬움",
    tags: ["정렬"],
    timeLimit: 2.0, // 네이티브 기준 초. 브라우저(WASM)에서는 ×3 적용
    statement: `지원자 N명의 이름과 점수가 주어진다. 점수가 높은 순서로 상위 K명을 합격시킨다.
점수가 같으면 이름이 사전순(오름차순)으로 앞서는 사람이 먼저 합격한다.

**입력**
- 첫 줄: N K (1 ≤ K ≤ N ≤ 100,000)
- 다음 N줄: \`이름 점수\` (이름은 공백 없는 영문 소문자, 점수는 0~1000 정수)

**출력**
- 합격자 K명의 이름을 순위 순으로 한 줄에 하나씩 출력.

**예시 입력**
\`\`\`
4 2
dana 90
alex 95
casey 90
blair 95
\`\`\`
**예시 출력**
\`\`\`
alex
blair
\`\`\``,
    starterCode: ALGO_STARTER + "n, k = map(int, input().split())\n# 여기에 작성\n",
    referenceSolution:
      "import sys\ninput = sys.stdin.readline\n" +
      "n, k = map(int, input().split())\n" +
      "rows = []\n" +
      "for _ in range(n):\n" +
      "    name, score = input().split()\n" +
      "    rows.append((-int(score), name))\n" +
      "rows.sort()\n" +
      "print('\\n'.join(name for _, name in rows[:k]))\n",
    testcases: [
      { input: "4 2\ndana 90\nalex 95\ncasey 90\nblair 95\n", expected: "alex\nblair\n", isSample: true },
      { input: "1 1\nsolo 0\n", expected: "solo\n" },
      { input: "5 5\ne 10\nd 10\nc 10\nb 10\na 10\n", expected: "a\nb\nc\nd\ne\n" },
      { input: "6 3\nzoe 100\namy 100\nbob 99\ncal 100\ndan 98\neve 99\n", expected: "amy\ncal\nzoe\n" },
      { input: "5 2\nb 50\na 50\nc 50\nd 40\ne 60\n", expected: "e\na\n" },
      { inputGen: genSortPerfIn, expectedGen: genSortPerfOut, label: "성능 (N=100,000)" },
    ],
  },
  {
    id: 2,
    title: "베스트셀러",
    type: "algo",
    difficulty: "쉬움",
    tags: ["해시"],
    timeLimit: 2.0,
    statement: `서점의 하루 판매 기록이 주어진다. 가장 많이 팔린 책 제목을 출력하라.
그런 책이 여러 권이면 사전순으로 가장 앞선 제목을 출력한다.

**입력**
- 첫 줄: 판매 건수 N (1 ≤ N ≤ 100,000)
- 다음 N줄: 책 제목 (공백 없는 영문 소문자, 길이 ≤ 30)

**출력**
- 가장 많이 팔린 책 제목 1개.

**예시 입력**
\`\`\`
5
apple
banana
apple
cherry
banana
\`\`\`
**예시 출력**
\`\`\`
apple
\`\`\``,
    starterCode: ALGO_STARTER + "n = int(input())\n# 여기에 작성\n",
    referenceSolution:
      "import sys\nfrom collections import Counter\n" +
      "data = sys.stdin.read().split()\n" +
      "n = int(data[0])\n" +
      "c = Counter(data[1:1 + n])\n" +
      "print(min(c.items(), key=lambda kv: (-kv[1], kv[0]))[0])\n",
    testcases: [
      { input: "5\napple\nbanana\napple\ncherry\nbanana\n", expected: "apple\n", isSample: true },
      { input: "1\nonly\n", expected: "only\n" },
      { input: "4\nzz\naa\nzz\naa\n", expected: "aa\n" },
      { input: "6\nx\ny\ny\nx\nz\ny\n", expected: "y\n" },
      { inputGen: genHashPerfIn, expected: "aa\n", label: "성능 (N=100,000)" },
    ],
  },
  {
    id: 3,
    title: "창고 최단 경로",
    type: "algo",
    difficulty: "중간",
    tags: ["BFS/DFS"],
    timeLimit: 2.0,
    statement: `N×M 창고 지도가 주어진다. \`1\`은 지나갈 수 있는 칸, \`0\`은 막힌 칸이다.
로봇은 (1,1)에서 출발해 (N,M)까지 상·하·좌·우로만 이동한다.
지나야 하는 **칸의 개수**(출발·도착 칸 포함)의 최솟값을 출력하라. 도달할 수 없으면 \`-1\`.

**입력**
- 첫 줄: N M (1 ≤ N, M ≤ 100)
- 다음 N줄: 길이 M의 0/1 문자열. (1,1)과 (N,M)은 항상 \`1\`.

**출력**
- 최단 칸 수 또는 -1.

**예시 입력**
\`\`\`
4 6
101111
101010
101011
111011
\`\`\`
**예시 출력**
\`\`\`
15
\`\`\``,
    starterCode: ALGO_STARTER + "from collections import deque\n\nn, m = map(int, input().split())\ngrid = [input().strip() for _ in range(n)]\n# 여기에 작성\n",
    referenceSolution:
      "import sys\nfrom collections import deque\n" +
      "input = sys.stdin.readline\n" +
      "n, m = map(int, input().split())\n" +
      "grid = [input().strip() for _ in range(n)]\n" +
      "dist = [[0] * m for _ in range(n)]\n" +
      "dist[0][0] = 1\n" +
      "q = deque([(0, 0)])\n" +
      "while q:\n" +
      "    x, y = q.popleft()\n" +
      "    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):\n" +
      "        nx, ny = x + dx, y + dy\n" +
      "        if 0 <= nx < n and 0 <= ny < m and grid[nx][ny] == '1' and dist[nx][ny] == 0:\n" +
      "            dist[nx][ny] = dist[x][y] + 1\n" +
      "            q.append((nx, ny))\n" +
      "print(dist[n-1][m-1] if dist[n-1][m-1] else (1 if n == m == 1 else -1))\n",
    testcases: [
      { input: "4 6\n101111\n101010\n101011\n111011\n", expected: "15\n", isSample: true },
      { input: "1 1\n1\n", expected: "1\n" },
      { input: "2 2\n10\n01\n", expected: "-1\n" },
      { input: "3 3\n111\n111\n111\n", expected: "5\n" },
      { input: "1 5\n11111\n", expected: "5\n" },
      { input: "5 1\n1\n1\n0\n1\n1\n", expected: "-1\n" },
      { inputGen: genBfsPerfIn, expected: "199\n", label: "성능 (100×100)" },
    ],
  },
  {
    id: 4,
    title: "고객별 총 주문 금액",
    type: "sql",
    difficulty: "쉬움",
    tags: ["SQL-조인"],
    timeLimit: 5.0,
    statement: `\`customers\`, \`orders\` 테이블이 있다. 주문한 적 있는 고객의 이름과 총 주문 금액을 조회하라.
총 주문 금액이 큰 순으로 정렬하고, 금액이 같으면 이름 오름차순으로 정렬한다.

**테이블**
- customers(id, name)
- orders(id, customer_id, amount)

**출력 컬럼**: name, total_amount`,
    starterCode: "SELECT\n  -- 여기에 작성\n",
    sqlFixture: {
      schemaSql:
        "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);\n" +
        "CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount INTEGER);",
      seedSql:
        "INSERT INTO customers VALUES (1,'kim'),(2,'lee'),(3,'park'),(4,'choi');\n" +
        "INSERT INTO orders VALUES (1,1,300),(2,2,150),(3,1,200),(4,3,700),(5,2,350),(6,3,0);",
      solutionQuery:
        "SELECT c.name, SUM(o.amount) AS total_amount\n" +
        "FROM customers c JOIN orders o ON o.customer_id = c.id\n" +
        "GROUP BY c.id ORDER BY total_amount DESC, c.name;",
      orderSensitive: true,
    },
  },
  {
    id: 5,
    title: "부서별 급여 순위",
    type: "sql",
    difficulty: "중간",
    tags: ["SQL-윈도우함수"],
    timeLimit: 5.0,
    statement: `\`employees\` 테이블에서 부서별로 급여가 높은 순으로 순위를 매겨 조회하라.
급여가 같으면 같은 순위(RANK)로 처리한다. 부서 오름차순, 순위 오름차순, 이름 오름차순으로 정렬한다.

**테이블**
- employees(id, name, dept, salary)

**출력 컬럼**: dept, name, salary, salary_rank`,
    starterCode: "SELECT\n  -- RANK() OVER (...) 를 사용해 보세요\n",
    sqlFixture: {
      schemaSql:
        "CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, dept TEXT, salary INTEGER);",
      seedSql:
        "INSERT INTO employees VALUES\n" +
        " (1,'ahn','data',5200),(2,'bae','data',6100),(3,'cho','data',5200),\n" +
        " (4,'doh','infra',7000),(5,'eum','infra',6500),(6,'foo','ml',8000),(7,'goo','ml',8000),\n" +
        " (8,'ha','data',5000);",
      solutionQuery:
        "SELECT dept, name, salary,\n" +
        "       RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS salary_rank\n" +
        "FROM employees ORDER BY dept, salary_rank, name;",
      orderSensitive: true,
    },
  },
  {
    id: 6,
    title: "카드 세 장",
    type: "algo",
    difficulty: "쉬움",
    tags: ["완전탐색"],
    timeLimit: 2.0,
    statement: `숫자 카드 N장이 주어진다. 서로 다른 세 장을 골라 합을 만들 때, M을 넘지 않는 최대 합을 출력하라.
M 이하로 만들 수 있는 조합은 항상 하나 이상 존재한다.

**입력**
- 첫 줄: N M (3 ≤ N ≤ 100, 1 ≤ M ≤ 1,000,000)
- 둘째 줄: 카드 숫자 N개 (각 1 이상 300,000 이하)

**출력**
- M을 넘지 않는 세 장의 최대 합.

**예시 입력**
\`\`\`
5 21
5 6 7 8 9
\`\`\`
**예시 출력**
\`\`\`
21
\`\`\``,
    starterCode: ALGO_STARTER + "n, m = map(int, input().split())\ncards = list(map(int, input().split()))\n# 여기에 작성\n",
    referenceSolution:
      "import sys\ninput = sys.stdin.readline\n" +
      "n, m = map(int, input().split())\n" +
      "c = list(map(int, input().split()))\n" +
      "best = 0\n" +
      "for i in range(n):\n" +
      "    for j in range(i + 1, n):\n" +
      "        if c[i] + c[j] >= m:\n" +
      "            continue  # 세 번째 카드(1 이상)를 더하면 무조건 M 초과\n" +
      "        for k in range(j + 1, n):\n" +
      "            s = c[i] + c[j] + c[k]\n" +
      "            if best < s <= m: best = s\n" +
      "print(best)\n",
    testcases: [
      { input: "5 21\n5 6 7 8 9\n", expected: "21\n", isSample: true },
      { input: "3 600\n100 200 300\n", expected: "600\n" },
      { input: "4 10\n1 2 3 4\n", expected: "9\n" },
      { input: "5 500000\n300000 300000 1 1 1\n", expected: "300002\n" },
      { inputGen: genTripleCardIn, expected: "999999\n", label: "성능 (N=100)" },
    ],
  },
  {
    id: 7,
    title: "거스름돈",
    type: "algo",
    difficulty: "쉬움",
    tags: ["그리디"],
    timeLimit: 2.0,
    statement: `편의점 금고에 500, 100, 50, 10, 5, 1원짜리 동전이 무한히 있다.
거슬러 줄 금액 N이 주어질 때, 동전 개수의 최솟값을 출력하라.

**입력**
- 첫 줄: N (1 ≤ N ≤ 1,000,000)

**출력**
- 동전 개수의 최솟값.

**예시 입력**
\`\`\`
1260
\`\`\`
**예시 출력**
\`\`\`
6
\`\`\``,
    starterCode: ALGO_STARTER + "n = int(input())\n# 여기에 작성\n",
    referenceSolution:
      "n = int(input())\n" +
      "cnt = 0\n" +
      "for coin in (500, 100, 50, 10, 5, 1):\n" +
      "    cnt += n // coin\n" +
      "    n %= coin\n" +
      "print(cnt)\n",
    testcases: [
      { input: "1260\n", expected: "6\n", isSample: true },
      { input: "1\n", expected: "1\n" },
      { input: "500\n", expected: "1\n" },
      { input: "999999\n", expected: "2013\n" },
      { input: "4\n", expected: "4\n" },
    ],
  },
  {
    id: 8,
    title: "스터디룸 예약",
    type: "algo",
    difficulty: "중간",
    tags: ["그리디"],
    timeLimit: 2.0,
    statement: `스터디룸 하나에 예약 신청 N건이 들어왔다. 각 신청은 시작 시각과 종료 시각이 있다.
한 신청이 끝나는 시각에 다음 신청이 바로 시작할 수 있다. 겹치지 않게 수락할 수 있는 신청의 최대 개수를 출력하라.

**입력**
- 첫 줄: N (1 ≤ N ≤ 100,000)
- 다음 N줄: \`시작 종료\` (0 ≤ 시작 < 종료 ≤ 1,000,000,000)

**출력**
- 수락 가능한 신청의 최대 개수.

**예시 입력**
\`\`\`
5
1 4
3 5
0 6
5 7
8 9
\`\`\`
**예시 출력**
\`\`\`
3
\`\`\``,
    starterCode: ALGO_STARTER + "n = int(input())\n# 여기에 작성\n",
    referenceSolution:
      "import sys\ninput = sys.stdin.readline\n" +
      "n = int(input())\n" +
      "iv = [tuple(map(int, input().split())) for _ in range(n)]\n" +
      "iv.sort(key=lambda x: (x[1], x[0]))\n" +
      "cnt, end = 0, -1\n" +
      "for s, e in iv:\n" +
      "    if s >= end:\n" +
      "        cnt += 1\n" +
      "        end = e\n" +
      "print(cnt)\n",
    testcases: [
      { input: "5\n1 4\n3 5\n0 6\n5 7\n8 9\n", expected: "3\n", isSample: true },
      { input: "1\n0 1\n", expected: "1\n" },
      { input: "3\n0 10\n0 10\n0 10\n", expected: "1\n" },
      { input: "4\n0 2\n2 4\n4 6\n6 8\n", expected: "4\n" },
      { input: "4\n0 100\n1 2\n2 3\n3 4\n", expected: "3\n" },
      { inputGen: genRoomsIn, expected: "100000\n", label: "성능 (N=100,000)" },
    ],
  },
  {
    id: 9,
    title: "번호 찾기",
    type: "algo",
    difficulty: "쉬움",
    tags: ["이분탐색"],
    timeLimit: 2.0,
    statement: `서로 다른 정수 N개가 오름차순으로 주어진다. 질의 Q개에 대해 각 수가 몇 번째 위치(0부터 시작)에 있는지 출력하라. 없으면 -1.

**입력**
- 첫 줄: N (1 ≤ N ≤ 100,000)
- 둘째 줄: 오름차순 정수 N개
- 셋째 줄: Q (1 ≤ Q ≤ 100,000)
- 넷째 줄: 질의 정수 Q개

**출력**
- 질의마다 위치 또는 -1을 한 줄에 하나씩.

**예시 입력**
\`\`\`
5
2 4 6 8 10
3
6 3 10
\`\`\`
**예시 출력**
\`\`\`
2
-1
4
\`\`\``,
    starterCode: ALGO_STARTER + "n = int(input())\narr = list(map(int, input().split()))\n# 여기에 작성\n",
    referenceSolution:
      "import sys\nfrom bisect import bisect_left\n" +
      "data = sys.stdin.buffer.read().split()\n" +
      "n = int(data[0])\n" +
      "arr = list(map(int, data[1:1 + n]))\n" +
      "q = int(data[1 + n])\n" +
      "out = []\n" +
      "for tok in data[2 + n:2 + n + q]:\n" +
      "    x = int(tok)\n" +
      "    i = bisect_left(arr, x)\n" +
      "    out.append(str(i) if i < n and arr[i] == x else '-1')\n" +
      "print('\\n'.join(out))\n",
    testcases: [
      { input: "5\n2 4 6 8 10\n3\n6 3 10\n", expected: "2\n-1\n4\n", isSample: true },
      { input: "1\n7\n2\n7 8\n", expected: "0\n-1\n" },
      { input: "3\n-5 0 5\n3\n-5 5 -6\n", expected: "0\n2\n-1\n" },
      { inputGen: genBisectIn, expectedGen: genBisectOut, label: "성능 (N=Q=100,000)" },
    ],
  },
  {
    id: 10,
    title: "케이블 자르기",
    type: "algo",
    difficulty: "중간",
    tags: ["이분탐색"],
    timeLimit: 2.0,
    statement: `길이가 제각각인 케이블 K개가 있다. 이것을 잘라서 길이가 같은 케이블 N개를 만들려 한다.
자른 케이블은 이어 붙일 수 없고, 남는 부분은 버린다. 만들 수 있는 케이블 한 개의 최대 길이(정수)를 출력하라.
길이 1짜리 N개는 항상 만들 수 있다고 가정한다.

**입력**
- 첫 줄: K N (1 ≤ K ≤ 100,000, 1 ≤ N ≤ 1,000,000)
- 다음 K줄: 각 케이블의 길이 (1 이상 2,000,000,000 이하 정수)

**출력**
- 최대 길이.

**예시 입력**
\`\`\`
4 11
802
743
457
539
\`\`\`
**예시 출력**
\`\`\`
200
\`\`\``,
    starterCode: ALGO_STARTER + "k, n = map(int, input().split())\ncables = [int(input()) for _ in range(k)]\n# 여기에 작성\n",
    referenceSolution:
      "import sys\ninput = sys.stdin.readline\n" +
      "k, n = map(int, input().split())\n" +
      "cables = [int(input()) for _ in range(k)]\n" +
      "lo, hi, ans = 1, max(cables), 1\n" +
      "while lo <= hi:\n" +
      "    mid = (lo + hi) // 2\n" +
      "    if sum(c // mid for c in cables) >= n:\n" +
      "        ans = mid; lo = mid + 1\n" +
      "    else:\n" +
      "        hi = mid - 1\n" +
      "print(ans)\n",
    testcases: [
      { input: "4 11\n802\n743\n457\n539\n", expected: "200\n", isSample: true },
      { input: "1 1\n1\n", expected: "1\n" },
      { input: "1 5\n10\n", expected: "2\n" },
      { input: "2 3\n2000000000\n2000000000\n", expected: "1000000000\n" },
      { inputGen: genCableIn, expected: "33334\n", label: "성능 (K=100,000)" },
    ],
  },
  {
    id: 11,
    title: "계단 경로 수",
    type: "algo",
    difficulty: "쉬움",
    tags: ["DP"],
    timeLimit: 2.0,
    statement: `계단 N개를 오른다. 한 번에 1칸 또는 2칸씩 오를 수 있다.
꼭대기까지 오르는 서로 다른 방법의 수를 1,000,000,007로 나눈 나머지를 출력하라.

**입력**
- 첫 줄: N (1 ≤ N ≤ 1,000,000)

**출력**
- 방법의 수 mod 1,000,000,007.

**예시 입력**
\`\`\`
4
\`\`\`
**예시 출력**
\`\`\`
5
\`\`\``,
    starterCode: ALGO_STARTER + "n = int(input())\n# 여기에 작성\n",
    referenceSolution:
      "n = int(input())\n" +
      "MOD = 1_000_000_007\n" +
      "a, b = 1, 2\n" +
      "if n == 1: print(1)\n" +
      "elif n == 2: print(2)\n" +
      "else:\n" +
      "    for _ in range(3, n + 1):\n" +
      "        a, b = b, (a + b) % MOD\n" +
      "    print(b)\n",
    testcases: [
      { input: "4\n", expected: "5\n", isSample: true },
      { input: "1\n", expected: "1\n" },
      { input: "2\n", expected: "2\n" },
      { input: "10\n", expected: "89\n" },
      { input: "1000000\n", expected: "534400663\n", label: "성능 (N=1,000,000)" },
    ],
  },
  {
    id: 12,
    title: "최대 연속 매출",
    type: "algo",
    difficulty: "중간",
    tags: ["DP"],
    timeLimit: 2.0,
    statement: `N일 동안의 일별 손익(음수 가능)이 주어진다. 연속된 하루 이상의 구간을 골랐을 때 손익 합의 최댓값을 출력하라.

**입력**
- 첫 줄: N (1 ≤ N ≤ 100,000)
- 둘째 줄: 정수 N개 (각 -10,000 이상 10,000 이하)

**출력**
- 연속 구간 합의 최댓값.

**예시 입력**
\`\`\`
6
-2 3 -1 4 -10 2
\`\`\`
**예시 출력**
\`\`\`
6
\`\`\``,
    starterCode: ALGO_STARTER + "n = int(input())\na = list(map(int, input().split()))\n# 여기에 작성\n",
    referenceSolution:
      "import sys\ninput = sys.stdin.readline\n" +
      "n = int(input())\n" +
      "a = list(map(int, input().split()))\n" +
      "best = cur = a[0]\n" +
      "for x in a[1:]:\n" +
      "    cur = max(x, cur + x)\n" +
      "    best = max(best, cur)\n" +
      "print(best)\n",
    testcases: [
      { input: "6\n-2 3 -1 4 -10 2\n", expected: "6\n", isSample: true },
      { input: "1\n-7\n", expected: "-7\n" },
      { input: "3\n-3 -1 -2\n", expected: "-1\n" },
      { input: "5\n1 2 3 4 5\n", expected: "15\n" },
      { inputGen: genKadaneIn, expected: "99999\n", label: "성능 (N=100,000)" },
    ],
  },
  {
    id: 13,
    title: "가장 긴 상승 구간",
    type: "algo",
    difficulty: "중간",
    tags: ["DP"],
    timeLimit: 2.0,
    statement: `수열 N개가 주어진다. 순서를 유지하면서 골라낸 **엄격히 증가하는** 부분 수열의 최대 길이를 출력하라.

**입력**
- 첫 줄: N (1 ≤ N ≤ 1,000)
- 둘째 줄: 정수 N개 (각 0 이상 1,000,000 이하)

**출력**
- 가장 긴 증가 부분 수열의 길이.

**예시 입력**
\`\`\`
6
10 20 10 30 20 50
\`\`\`
**예시 출력**
\`\`\`
4
\`\`\``,
    starterCode: ALGO_STARTER + "n = int(input())\na = list(map(int, input().split()))\n# 여기에 작성\n",
    referenceSolution:
      "import sys\nfrom bisect import bisect_left\n" +
      "input = sys.stdin.readline\n" +
      "n = int(input())\n" +
      "a = list(map(int, input().split()))\n" +
      "tails = []\n" +
      "for x in a:\n" +
      "    i = bisect_left(tails, x)\n" +
      "    if i == len(tails): tails.append(x)\n" +
      "    else: tails[i] = x\n" +
      "print(len(tails))\n",
    testcases: [
      { input: "6\n10 20 10 30 20 50\n", expected: "4\n", isSample: true },
      { input: "1\n5\n", expected: "1\n" },
      { input: "5\n5 4 3 2 1\n", expected: "1\n" },
      { input: "4\n3 3 3 3\n", expected: "1\n" },
      { input: "5\n1 2 3 4 5\n", expected: "5\n" },
      { inputGen: genLisIn, expected: "100\n", label: "성능 (N=1,000)" },
    ],
  },
  {
    id: 14,
    title: "동아리 개수",
    type: "algo",
    difficulty: "중간",
    tags: ["그래프"],
    timeLimit: 2.0,
    statement: `학생 N명이 있고, 서로 아는 사이 M쌍이 주어진다. 아는 사이를 계속 따라가면 닿는 학생들은 같은 동아리다.
동아리(연결 요소)의 개수를 출력하라. 아무와도 모르는 학생은 혼자서 동아리 하나다.

**입력**
- 첫 줄: N M (1 ≤ N ≤ 10,000, 0 ≤ M ≤ 100,000)
- 다음 M줄: \`a b\` (1 ≤ a, b ≤ N, a ≠ b)

**출력**
- 동아리 개수.

**예시 입력**
\`\`\`
6 3
1 2
2 3
5 6
\`\`\`
**예시 출력**
\`\`\`
3
\`\`\``,
    starterCode: ALGO_STARTER + "n, m = map(int, input().split())\n# 여기에 작성\n",
    referenceSolution:
      "import sys\nfrom collections import deque\n" +
      "input = sys.stdin.readline\n" +
      "n, m = map(int, input().split())\n" +
      "adj = [[] for _ in range(n + 1)]\n" +
      "for _ in range(m):\n" +
      "    a, b = map(int, input().split())\n" +
      "    adj[a].append(b); adj[b].append(a)\n" +
      "seen = [False] * (n + 1)\n" +
      "cnt = 0\n" +
      "for s in range(1, n + 1):\n" +
      "    if seen[s]: continue\n" +
      "    cnt += 1\n" +
      "    seen[s] = True\n" +
      "    q = deque([s])\n" +
      "    while q:\n" +
      "        u = q.popleft()\n" +
      "        for v in adj[u]:\n" +
      "            if not seen[v]:\n" +
      "                seen[v] = True; q.append(v)\n" +
      "print(cnt)\n",
    testcases: [
      { input: "6 3\n1 2\n2 3\n5 6\n", expected: "3\n", isSample: true },
      { input: "1 0\n", expected: "1\n" },
      { input: "4 0\n", expected: "4\n" },
      { input: "4 4\n1 2\n2 3\n3 4\n4 1\n", expected: "1\n" },
      { inputGen: genComponentsIn, expected: "5000\n", label: "성능 (N=10,000)" },
    ],
  },
  {
    id: 15,
    title: "창고 감염 확산",
    type: "algo",
    difficulty: "중간",
    tags: ["BFS/DFS"],
    timeLimit: 2.0,
    statement: `N×M 창고에 상자가 놓여 있다. \`2\`는 감염된 상자, \`1\`은 정상 상자, \`0\`은 빈 칸이다.
하루가 지나면 감염된 상자의 상·하·좌·우에 있는 정상 상자가 감염된다.
모든 정상 상자가 감염되기까지 걸리는 최소 일수를 출력하라. 처음부터 정상 상자가 없으면 0, 끝까지 감염되지 않는 상자가 있으면 -1.

**입력**
- 첫 줄: N M (1 ≤ N, M ≤ 100)
- 다음 N줄: 길이 M의 0/1/2 문자열. \`2\`는 하나 이상 존재한다.

**출력**
- 최소 일수, 0 또는 -1.

**예시 입력**
\`\`\`
3 4
2110
1110
0011
\`\`\`
**예시 출력**
\`\`\`
5
\`\`\``,
    starterCode: ALGO_STARTER + "from collections import deque\n\nn, m = map(int, input().split())\ngrid = [list(input().strip()) for _ in range(n)]\n# 여기에 작성\n",
    referenceSolution:
      "import sys\nfrom collections import deque\n" +
      "input = sys.stdin.readline\n" +
      "n, m = map(int, input().split())\n" +
      "g = [list(input().strip()) for _ in range(n)]\n" +
      "q = deque()\n" +
      "for i in range(n):\n" +
      "    for j in range(m):\n" +
      "        if g[i][j] == '2': q.append((i, j, 0))\n" +
      "days = 0\n" +
      "while q:\n" +
      "    x, y, d = q.popleft()\n" +
      "    days = d\n" +
      "    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):\n" +
      "        nx, ny = x + dx, y + dy\n" +
      "        if 0 <= nx < n and 0 <= ny < m and g[nx][ny] == '1':\n" +
      "            g[nx][ny] = '2'; q.append((nx, ny, d + 1))\n" +
      "print(-1 if any('1' in row for row in g) else days)\n",
    testcases: [
      { input: "3 4\n2110\n1110\n0011\n", expected: "5\n", isSample: true },
      { input: "1 1\n2\n", expected: "0\n" },
      { input: "2 2\n20\n02\n", expected: "0\n" },
      { input: "2 3\n210\n001\n", expected: "-1\n" },
      { input: "1 5\n21112\n", expected: "2\n" },
      { inputGen: genInfectionIn, expected: "198\n", label: "성능 (100×100)" },
    ],
  },
  {
    id: 16,
    title: "야근하는 사람",
    type: "algo",
    difficulty: "쉬움",
    tags: ["해시"],
    timeLimit: 2.0,
    statement: `출근 기록 N개와 퇴근 기록 M개가 주어진다. 이름은 중복되지 않고, 퇴근한 사람은 반드시 출근 기록에 있다.
아직 회사에 남아 있는 사람의 이름을 사전순으로 한 줄에 하나씩 출력하라. 남은 사람은 항상 1명 이상이다.

**입력**
- 첫 줄: N M (1 ≤ M < N ≤ 100,000)
- 다음 N줄: 출근한 사람 이름 (영문 소문자·숫자)
- 다음 M줄: 퇴근한 사람 이름

**출력**
- 남아 있는 사람 이름을 사전순으로.

**예시 입력**
\`\`\`
4 2
kim
lee
park
choi
lee
kim
\`\`\`
**예시 출력**
\`\`\`
choi
park
\`\`\``,
    starterCode: ALGO_STARTER + "n, m = map(int, input().split())\n# 여기에 작성\n",
    referenceSolution:
      "import sys\n" +
      "data = sys.stdin.read().split()\n" +
      "n, m = int(data[0]), int(data[1])\n" +
      "arrived = set(data[2:2 + n])\n" +
      "left = set(data[2 + n:2 + n + m])\n" +
      "print('\\n'.join(sorted(arrived - left)))\n",
    testcases: [
      { input: "4 2\nkim\nlee\npark\nchoi\nlee\nkim\n", expected: "choi\npark\n", isSample: true },
      { input: "2 1\nb1\na2\nb1\n", expected: "a2\n" },
      { inputGen: genOfficeIn, expectedGen: genOfficeOut, label: "성능 (N=100,000)" },
    ],
  },
  {
    id: 17,
    title: "단어 정렬",
    type: "algo",
    difficulty: "중간",
    tags: ["정렬"],
    timeLimit: 2.0,
    statement: `단어 N개가 주어진다. 중복을 제거한 뒤 다음 기준으로 정렬해 출력하라.

1. 길이가 짧은 것부터
2. 길이가 같으면 사전순으로

**입력**
- 첫 줄: N (1 ≤ N ≤ 100,000)
- 다음 N줄: 영문 소문자 단어 (길이 ≤ 50)

**출력**
- 정렬된 단어를 한 줄에 하나씩.

**예시 입력**
\`\`\`
5
but
i
wont
but
i
\`\`\`
**예시 출력**
\`\`\`
i
but
wont
\`\`\``,
    starterCode: ALGO_STARTER + "n = int(input())\n# 여기에 작성\n",
    referenceSolution:
      "import sys\n" +
      "data = sys.stdin.read().split()\n" +
      "n = int(data[0])\n" +
      "words = sorted(set(data[1:1 + n]), key=lambda w: (len(w), w))\n" +
      "print('\\n'.join(words))\n",
    testcases: [
      { input: "5\nbut\ni\nwont\nbut\ni\n", expected: "i\nbut\nwont\n", isSample: true },
      { input: "1\nsolo\n", expected: "solo\n" },
      { input: "4\nbb\naa\nb\na\n", expected: "a\nb\naa\nbb\n" },
      { inputGen: genWordsIn, expectedGen: genWordsOut, label: "성능 (N=100,000)" },
    ],
  },
  {
    id: 18,
    title: "품절 임박 재고",
    type: "sql",
    difficulty: "쉬움",
    tags: ["SQL-기본조회"],
    timeLimit: 5.0,
    statement: `\`products\` 테이블에서 재고(stock)가 10 미만인 상품을 조회하라.
재고 오름차순으로 정렬하고, 재고가 같으면 이름 오름차순으로 정렬한다.

**테이블**
- products(id, name, stock, price)

**출력 컬럼**: name, stock`,
    starterCode: "SELECT\n  -- 여기에 작성\n",
    sqlFixture: {
      schemaSql:
        "CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER);",
      seedSql:
        "INSERT INTO products VALUES\n" +
        " (1,'pen',3,1000),(2,'note',25,3000),(3,'clip',3,500),\n" +
        " (4,'tape',9,1500),(5,'glue',10,2000),(6,'ink',0,8000);",
      solutionQuery:
        "SELECT name, stock FROM products WHERE stock < 10 ORDER BY stock, name;",
      orderSensitive: true,
    },
  },
  {
    id: 19,
    title: "카테고리별 평균 가격",
    type: "sql",
    difficulty: "중간",
    tags: ["SQL-집계"],
    timeLimit: 5.0,
    statement: `\`menu\` 테이블에서 메뉴가 2개 이상인 카테고리의 평균 가격을 조회하라.
평균 가격은 ROUND로 반올림하고, 평균 가격 내림차순·카테고리 오름차순으로 정렬한다.

**테이블**
- menu(id, name, category, price)

**출력 컬럼**: category, avg_price`,
    starterCode: "SELECT\n  -- GROUP BY 와 HAVING 을 사용해 보세요\n",
    sqlFixture: {
      schemaSql:
        "CREATE TABLE menu (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER);",
      seedSql:
        "INSERT INTO menu VALUES\n" +
        " (1,'americano','coffee',4500),(2,'latte','coffee',5000),\n" +
        " (3,'croissant','bakery',3800),(4,'bagel','bakery',3500),(5,'scone','bakery',3300),\n" +
        " (6,'ade','beverage',6000),\n" +
        " (7,'greentea','tea',5500),(8,'blacktea','tea',4000);",
      solutionQuery:
        "SELECT category, ROUND(AVG(price)) AS avg_price\n" +
        "FROM menu GROUP BY category HAVING COUNT(*) >= 2\n" +
        "ORDER BY avg_price DESC, category;",
      orderSensitive: true,
    },
  },
  {
    id: 20,
    title: "평균보다 비싼 상품",
    type: "sql",
    difficulty: "중간",
    tags: ["SQL-서브쿼리"],
    timeLimit: 5.0,
    statement: `\`items\` 테이블에서 전체 평균 가격보다 비싼 상품을 조회하라.
가격 내림차순으로 정렬하고, 가격이 같으면 이름 오름차순으로 정렬한다.

**테이블**
- items(id, name, price)

**출력 컬럼**: name, price`,
    starterCode: "SELECT\n  -- 서브쿼리로 평균을 구해 비교해 보세요\n",
    sqlFixture: {
      schemaSql:
        "CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, price INTEGER);",
      seedSql:
        // 평균이 정확히 40000(=fan 가격) → '>'와 '>='가 다른 결과를 내도록 설계
        "INSERT INTO items VALUES\n" +
        " (1,'ssd',100000),(2,'ram',70000),(3,'fan',40000),\n" +
        " (4,'case',20000),(5,'cable',5000),(6,'mouse',5000);",
      solutionQuery:
        "SELECT name, price FROM items\n" +
        "WHERE price > (SELECT AVG(price) FROM items)\n" +
        "ORDER BY price DESC, name;",
      orderSensitive: true,
    },
  },
  {
    id: 21,
    title: "일별 누적 매출",
    type: "sql",
    difficulty: "중간",
    tags: ["SQL-윈도우함수"],
    timeLimit: 5.0,
    statement: `\`sales\` 테이블에서 날짜순으로 매출과 누적 매출을 조회하라.
누적 매출은 해당 날짜까지의 amount 합계다. 윈도우 함수 SUM() OVER를 사용해 보라.

**테이블**
- sales(day, amount)

**출력 컬럼**: day, amount, running_total (day 오름차순)`,
    starterCode: "SELECT\n  -- SUM(...) OVER (ORDER BY ...) 를 사용해 보세요\n",
    sqlFixture: {
      schemaSql: "CREATE TABLE sales (day INTEGER PRIMARY KEY, amount INTEGER);",
      seedSql:
        "INSERT INTO sales VALUES (1,12000),(3,8000),(4,15000),(7,3000),(9,21000),(10,5000);",
      solutionQuery:
        "SELECT day, amount, SUM(amount) OVER (ORDER BY day) AS running_total\n" +
        "FROM sales ORDER BY day;",
      orderSensitive: true,
    },
  },
  {
    id: 22,
    title: "괄호 검사",
    type: "algo",
    difficulty: "쉬움",
    tags: ["스택"],
    timeLimit: 2.0,
    statement: `괄호 문자열이 주어진다. 모든 여는 괄호 \`(\`가 순서에 맞게 닫히면 \`YES\`, 아니면 \`NO\`를 출력하라.

**입력**
- 첫 줄: \`(\`와 \`)\`로만 이루어진 문자열 (길이 1 이상 100,000 이하)

**출력**
- YES 또는 NO.

**예시 입력**
\`\`\`
(())()
\`\`\`
**예시 출력**
\`\`\`
YES
\`\`\``,
    starterCode: ALGO_STARTER + "s = input().strip()\n# 여기에 작성\n",
    referenceSolution:
      "s = input().strip()\n" +
      "depth = 0\n" +
      "ok = True\n" +
      "for ch in s:\n" +
      "    depth += 1 if ch == '(' else -1\n" +
      "    if depth < 0:\n" +
      "        ok = False\n" +
      "        break\n" +
      "print('YES' if ok and depth == 0 else 'NO')\n",
    testcases: [
      { input: "(())()\n", expected: "YES\n", isSample: true },
      { input: "(\n", expected: "NO\n" },
      { input: ")(\n", expected: "NO\n" },
      { input: "()\n", expected: "YES\n" },
      { input: "((())\n", expected: "NO\n" },
      { inputGen: genParenPerfIn, expected: "YES\n", label: "성능 (10만 글자)" },
    ],
  },
  {
    id: 23,
    title: "최소 구간 길이",
    type: "algo",
    difficulty: "중간",
    tags: ["투포인터"],
    timeLimit: 2.0,
    statement: `양의 정수 N개가 주어진다. 연속 구간의 합이 S 이상이 되는 **가장 짧은 구간의 길이**를 출력하라. 그런 구간이 없으면 0.

**입력**
- 첫 줄: N S (1 ≤ N ≤ 100,000, 1 ≤ S ≤ 10억)
- 둘째 줄: 양의 정수 N개 (각 10,000 이하)

**출력**
- 최소 구간 길이 또는 0.

**예시 입력**
\`\`\`
10 15
5 1 3 5 10 7 4 9 2 8
\`\`\`
**예시 출력**
\`\`\`
2
\`\`\``,
    starterCode: ALGO_STARTER + "n, s = map(int, input().split())\na = list(map(int, input().split()))\n# 여기에 작성\n",
    referenceSolution:
      "import sys\ninput = sys.stdin.readline\n" +
      "n, s = map(int, input().split())\n" +
      "a = list(map(int, input().split()))\n" +
      "best = n + 1\n" +
      "left = 0\n" +
      "cur = 0\n" +
      "for right in range(n):\n" +
      "    cur += a[right]\n" +
      "    while cur >= s:\n" +
      "        best = min(best, right - left + 1)\n" +
      "        cur -= a[left]\n" +
      "        left += 1\n" +
      "print(best if best <= n else 0)\n",
    testcases: [
      { input: "10 15\n5 1 3 5 10 7 4 9 2 8\n", expected: "2\n", isSample: true },
      { input: "1 5\n5\n", expected: "1\n" },
      { input: "3 100\n1 2 3\n", expected: "0\n" },
      { input: "5 11\n1 2 3 4 5\n", expected: "3\n" },
      { inputGen: genTwoPtrPerfIn, expected: "50000\n", label: "성능 (N=100,000)" },
    ],
  },
  {
    id: 24,
    title: "파일 합치기 최소 비용",
    type: "algo",
    difficulty: "중간",
    tags: ["힙"],
    timeLimit: 2.0,
    statement: `크기가 제각각인 파일 N개를 하나로 합친다. 한 번에 두 파일만 합칠 수 있고, 비용은 두 파일 크기의 합이다.
합쳐진 파일도 다시 합칠 수 있다. 전체를 하나로 만드는 **최소 총비용**을 출력하라. 파일이 1개면 0.

**입력**
- 첫 줄: N (1 ≤ N ≤ 100,000)
- 둘째 줄: 파일 크기 N개 (각 1 이상 10,000 이하)

**출력**
- 최소 총비용.

**예시 입력**
\`\`\`
4
10 20 30 40
\`\`\`
**예시 출력**
\`\`\`
190
\`\`\``,
    starterCode: ALGO_STARTER + "import heapq\n\nn = int(input())\nsizes = list(map(int, input().split()))\n# 여기에 작성\n",
    referenceSolution:
      "import sys, heapq\ninput = sys.stdin.readline\n" +
      "n = int(input())\n" +
      "h = list(map(int, input().split()))\n" +
      "heapq.heapify(h)\n" +
      "total = 0\n" +
      "while len(h) > 1:\n" +
      "    a = heapq.heappop(h)\n" +
      "    b = heapq.heappop(h)\n" +
      "    total += a + b\n" +
      "    heapq.heappush(h, a + b)\n" +
      "print(total)\n",
    testcases: [
      { input: "4\n10 20 30 40\n", expected: "190\n", isSample: true },
      { input: "1\n7\n", expected: "0\n" },
      { input: "2\n3 5\n", expected: "8\n" },
      { input: "3\n1 1 1\n", expected: "5\n" },
      { inputGen: genHeapPerfIn, expected: "1668928\n", label: "성능 (N=100,000)" },
    ],
  },
  {
    id: 25,
    title: "구간 합 질의",
    type: "algo",
    difficulty: "쉬움",
    tags: ["누적합"],
    timeLimit: 2.0,
    statement: `정수 N개와 질의 Q개가 주어진다. 각 질의 \`l r\`에 대해 l번째부터 r번째까지(1번부터 셈)의 합을 출력하라.

**입력**
- 첫 줄: N Q (1 ≤ N, Q ≤ 100,000)
- 둘째 줄: 정수 N개 (각 -10,000 이상 10,000 이하)
- 다음 Q줄: \`l r\` (1 ≤ l ≤ r ≤ N)

**출력**
- 질의마다 구간 합을 한 줄에 하나씩.

**예시 입력**
\`\`\`
5 3
3 -1 4 1 5
1 3
2 5
3 3
\`\`\`
**예시 출력**
\`\`\`
6
9
4
\`\`\``,
    starterCode: ALGO_STARTER + "n, q = map(int, input().split())\na = list(map(int, input().split()))\n# 여기에 작성\n",
    referenceSolution:
      "import sys\n" +
      "data = sys.stdin.buffer.read().split()\n" +
      "n, q = int(data[0]), int(data[1])\n" +
      "a = list(map(int, data[2:2 + n]))\n" +
      "prefix = [0] * (n + 1)\n" +
      "for i in range(n):\n" +
      "    prefix[i + 1] = prefix[i] + a[i]\n" +
      "out = []\n" +
      "idx = 2 + n\n" +
      "for _ in range(q):\n" +
      "    l, r = int(data[idx]), int(data[idx + 1])\n" +
      "    idx += 2\n" +
      "    out.append(str(prefix[r] - prefix[l - 1]))\n" +
      "print('\\n'.join(out))\n",
    testcases: [
      { input: "5 3\n3 -1 4 1 5\n1 3\n2 5\n3 3\n", expected: "6\n9\n4\n", isSample: true },
      { input: "1 1\n-5\n1 1\n", expected: "-5\n" },
      { input: "3 2\n1 2 3\n1 3\n2 2\n", expected: "6\n2\n" },
      { inputGen: genPrefixPerfIn, expectedGen: genPrefixPerfOut, label: "성능 (N=Q=100,000)" },
    ],
  },
  {
    id: 26,
    title: "같은 네트워크인가",
    type: "algo",
    difficulty: "중간",
    tags: ["유니온파인드"],
    timeLimit: 2.0,
    statement: `컴퓨터 N대와 케이블 M개가 주어진다. 질의 Q개에 대해 두 컴퓨터가 케이블을 따라 연결돼 있으면 \`YES\`, 아니면 \`NO\`를 출력하라.

**입력**
- 첫 줄: N M Q (1 ≤ N ≤ 100,000, 0 ≤ M ≤ 100,000, 1 ≤ Q ≤ 100,000)
- 다음 M줄: 케이블 \`a b\`
- 다음 Q줄: 질의 \`x y\`

**출력**
- 질의마다 YES 또는 NO.

**예시 입력**
\`\`\`
5 3 3
1 2
2 3
4 5
1 3
1 4
5 4
\`\`\`
**예시 출력**
\`\`\`
YES
NO
YES
\`\`\``,
    starterCode: ALGO_STARTER + "n, m, q = map(int, input().split())\n# 여기에 작성\n",
    referenceSolution:
      "import sys\n" +
      "data = sys.stdin.buffer.read().split()\n" +
      "n, m, q = int(data[0]), int(data[1]), int(data[2])\n" +
      "parent = list(range(n + 1))\n" +
      "def find(x):\n" +
      "    while parent[x] != x:\n" +
      "        parent[x] = parent[parent[x]]  # 경로 절반 압축\n" +
      "        x = parent[x]\n" +
      "    return x\n" +
      "idx = 3\n" +
      "for _ in range(m):\n" +
      "    a, b = int(data[idx]), int(data[idx + 1])\n" +
      "    idx += 2\n" +
      "    ra, rb = find(a), find(b)\n" +
      "    if ra != rb:\n" +
      "        parent[rb] = ra\n" +
      "out = []\n" +
      "for _ in range(q):\n" +
      "    x, y = int(data[idx]), int(data[idx + 1])\n" +
      "    idx += 2\n" +
      "    out.append('YES' if find(x) == find(y) else 'NO')\n" +
      "print('\\n'.join(out))\n",
    testcases: [
      { input: "5 3 3\n1 2\n2 3\n4 5\n1 3\n1 4\n5 4\n", expected: "YES\nNO\nYES\n", isSample: true },
      { input: "2 0 1\n1 2\n", expected: "NO\n" },
      { input: "1 0 1\n1 1\n", expected: "YES\n" },
      { input: "4 2 2\n1 2\n3 4\n2 1\n2 3\n", expected: "YES\nNO\n" },
      { inputGen: genDsuPerfIn, expectedGen: genDsuPerfOut, label: "성능 (전부 10만)" },
    ],
  },
  {
    id: 27,
    title: "배송 최소 비용",
    type: "algo",
    difficulty: "중간",
    tags: ["다익스트라"],
    timeLimit: 2.0,
    statement: `도시 N개와 양방향 도로 M개가 있고, 도로마다 통행료가 있다. 1번 도시에서 N번 도시까지 가는 **최소 통행료 합**을 출력하라. 갈 수 없으면 -1.

**입력**
- 첫 줄: N M (2 ≤ N ≤ 10,000, 0 ≤ M ≤ 100,000)
- 다음 M줄: \`a b c\` — a와 b를 잇는 통행료 c의 도로 (1 ≤ c ≤ 10,000)

**출력**
- 최소 비용 또는 -1.

**예시 입력**
\`\`\`
5 6
1 2 2
1 3 5
2 3 1
2 4 7
3 5 6
4 5 3
\`\`\`
**예시 출력**
\`\`\`
9
\`\`\``,
    starterCode: ALGO_STARTER + "import heapq\n\nn, m = map(int, input().split())\n# 여기에 작성\n",
    referenceSolution:
      "import sys, heapq\ninput = sys.stdin.readline\n" +
      "n, m = map(int, input().split())\n" +
      "adj = [[] for _ in range(n + 1)]\n" +
      "for _ in range(m):\n" +
      "    a, b, c = map(int, input().split())\n" +
      "    adj[a].append((c, b))\n" +
      "    adj[b].append((c, a))\n" +
      "INF = float('inf')\n" +
      "dist = [INF] * (n + 1)\n" +
      "dist[1] = 0\n" +
      "pq = [(0, 1)]\n" +
      "while pq:\n" +
      "    d, u = heapq.heappop(pq)\n" +
      "    if d > dist[u]:\n" +
      "        continue  # 이미 더 싼 경로로 확정된 노드\n" +
      "    for c, v in adj[u]:\n" +
      "        nd = d + c\n" +
      "        if nd < dist[v]:\n" +
      "            dist[v] = nd\n" +
      "            heapq.heappush(pq, (nd, v))\n" +
      "print(dist[n] if dist[n] != INF else -1)\n",
    testcases: [
      { input: "5 6\n1 2 2\n1 3 5\n2 3 1\n2 4 7\n3 5 6\n4 5 3\n", expected: "9\n", isSample: true },
      { input: "2 0\n", expected: "-1\n" },
      { input: "2 1\n1 2 10\n", expected: "10\n" },
      { input: "3 3\n1 2 1\n2 3 1\n1 3 5\n", expected: "2\n" },
      { inputGen: genDijkstraPerfIn, expected: "9999\n", label: "성능 (일직선 1만 도시)" },
    ],
  },
  {
    id: 28,
    title: "목표 합 조합의 수",
    type: "algo",
    difficulty: "중간",
    tags: ["백트래킹"],
    timeLimit: 2.0,
    statement: `정수 N개 중 **1개 이상**을 골라 합이 정확히 T가 되는 부분집합의 개수를 출력하라.

**입력**
- 첫 줄: N T (1 ≤ N ≤ 18, -100,000 ≤ T ≤ 100,000)
- 둘째 줄: 정수 N개 (각 -10,000 이상 10,000 이하)

**출력**
- 부분집합의 개수.

**예시 입력**
\`\`\`
5 0
-7 -3 -2 5 8
\`\`\`
**예시 출력**
\`\`\`
1
\`\`\``,
    starterCode: ALGO_STARTER + "n, t = map(int, input().split())\na = list(map(int, input().split()))\n# 여기에 작성\n",
    referenceSolution:
      "import sys\ninput = sys.stdin.readline\n" +
      "n, t = map(int, input().split())\n" +
      "a = list(map(int, input().split()))\n" +
      "count = 0\n" +
      "def dfs(i, acc, picked):\n" +
      "    global count\n" +
      "    if i == n:\n" +
      "        if picked and acc == t:\n" +
      "            count += 1\n" +
      "        return\n" +
      "    dfs(i + 1, acc + a[i], True)   # a[i]를 고른다\n" +
      "    dfs(i + 1, acc, picked)        # 안 고른다\n" +
      "dfs(0, 0, False)\n" +
      "print(count)\n",
    testcases: [
      { input: "5 0\n-7 -3 -2 5 8\n", expected: "1\n", isSample: true },
      { input: "1 5\n5\n", expected: "1\n" },
      { input: "3 0\n0 0 0\n", expected: "7\n" },
      { input: "4 10\n1 2 3 4\n", expected: "1\n" },
      { input: "18 9\n1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1\n", expected: "48620\n", label: "성능 (2^18 전수)" },
    ],
  },
  {
    id: 29,
    title: "문자 뭉치 압축",
    type: "algo",
    difficulty: "쉬움",
    tags: ["문자열·구현"],
    timeLimit: 2.0,
    statement: `문자열에서 같은 문자가 연속되면 \`문자+개수\`로 줄인다(개수가 1이면 숫자 생략).
예: \`aaabbc\` → \`a3b2c\`. 압축한 결과가 원본보다 **길거나 같으면 원본을 그대로** 출력하라.

**입력**
- 첫 줄: 영문 소문자 문자열 (길이 1 이상 100,000 이하)

**출력**
- 압축 결과 또는 원본.

**예시 입력**
\`\`\`
aaabbc
\`\`\`
**예시 출력**
\`\`\`
a3b2c
\`\`\``,
    starterCode: ALGO_STARTER + "s = input().strip()\n# 여기에 작성\n",
    referenceSolution:
      "s = input().strip()\n" +
      "parts = []\n" +
      "i = 0\n" +
      "while i < len(s):\n" +
      "    j = i\n" +
      "    while j < len(s) and s[j] == s[i]:\n" +
      "        j += 1\n" +
      "    run = j - i\n" +
      "    parts.append(s[i] + (str(run) if run > 1 else ''))\n" +
      "    i = j\n" +
      "comp = ''.join(parts)\n" +
      "print(comp if len(comp) < len(s) else s)\n",
    testcases: [
      { input: "aaabbc\n", expected: "a3b2c\n", isSample: true },
      { input: "a\n", expected: "a\n" },
      { input: "abc\n", expected: "abc\n" },
      { input: "aaaaaaaaaaaa\n", expected: "a12\n" },
      { input: "aabb\n", expected: "aabb\n" },
      { inputGen: genRlePerfIn, expectedGen: genRlePerfOut, label: "성능 (10만 글자)" },
    ],
  },
];

// 테스트케이스의 실제 입력/기대값 해석 (함수 생성형 지원)
function resolveCase(tc) {
  return {
    input: tc.inputGen ? tc.inputGen() : tc.input,
    expected: tc.expectedGen ? tc.expectedGen() : tc.expected,
    isSample: !!tc.isSample,
    label: tc.label || "",
  };
}
