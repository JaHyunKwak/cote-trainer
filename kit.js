// 프로그래머스 "코딩테스트 고득점 Kit" 문제 목록 (2026-07 기준, 링크만 제공 — 풀이는 프로그래머스에서)
// 백준(BOJ)이 2026-04-28 서비스를 종료해 실전 연습처를 프로그래머스로 교체함.
"use strict";

const PROGRAMMERS_KIT = {
  "해시": [
    { id: 42576, title: "완주하지 못한 선수", level: 1 },
    { id: 1845, title: "폰켓몬", level: 1 },
    { id: 42577, title: "전화번호 목록", level: 2 },
    { id: 42578, title: "의상", level: 2 },
    { id: 42579, title: "베스트앨범", level: 3 },
  ],
  "정렬": [
    { id: 42748, title: "K번째수", level: 1 },
    { id: 42746, title: "가장 큰 수", level: 2 },
    { id: 42747, title: "H-Index", level: 2 },
  ],
  "스택/큐": [
    { id: 12906, title: "같은 숫자는 싫어", level: 1 },
    { id: 42586, title: "기능개발", level: 2 },
    { id: 12909, title: "올바른 괄호", level: 2 },
    { id: 42587, title: "프로세스", level: 2 },
    { id: 42583, title: "다리를 지나는 트럭", level: 2 },
    { id: 42584, title: "주식가격", level: 2 },
  ],
  "힙": [
    { id: 42626, title: "더 맵게", level: 2 },
    { id: 42627, title: "디스크 컨트롤러", level: 3 },
    { id: 42628, title: "이중우선순위큐", level: 3 },
  ],
  "완전탐색": [
    { id: 86491, title: "최소직사각형", level: 1 },
    { id: 42840, title: "모의고사", level: 1 },
    { id: 42839, title: "소수 찾기", level: 2 },
    { id: 42842, title: "카펫", level: 2 },
    { id: 87946, title: "피로도", level: 2 },
    { id: 86971, title: "전력망을 둘로 나누기", level: 2 },
    { id: 84512, title: "모음사전", level: 2 },
  ],
  "그리디": [
    { id: 42862, title: "체육복", level: 1 },
    { id: 42860, title: "조이스틱", level: 2 },
    { id: 42883, title: "큰 수 만들기", level: 2 },
    { id: 42885, title: "구명보트", level: 2 },
    { id: 42861, title: "섬 연결하기", level: 3 },
    { id: 42884, title: "단속카메라", level: 3 },
  ],
  "DP": [
    { id: 42895, title: "N으로 표현", level: 3 },
    { id: 43105, title: "정수 삼각형", level: 3 },
    { id: 42898, title: "등굣길", level: 3 },
    { id: 1843, title: "사칙연산", level: 4 },
    { id: 42897, title: "도둑질", level: 4 },
  ],
  "DFS/BFS": [
    { id: 43165, title: "타겟 넘버", level: 2 },
    { id: 1844, title: "게임 맵 최단거리", level: 2 },
    { id: 43162, title: "네트워크", level: 3 },
    { id: 43163, title: "단어 변환", level: 3 },
    { id: 87694, title: "아이템 줍기", level: 3 },
    { id: 43164, title: "여행경로", level: 3 },
    { id: 84021, title: "퍼즐 조각 채우기", level: 3 },
  ],
  "이분탐색": [
    { id: 43238, title: "입국심사", level: 3 },
    { id: 43236, title: "징검다리", level: 4 },
  ],
  "그래프": [
    { id: 49189, title: "가장 먼 노드", level: 3 },
    { id: 49191, title: "순위", level: 3 },
    { id: 49190, title: "방의 개수", level: 5 },
  ],
};

const PROG_LESSON_URL = (id) => `https://school.programmers.co.kr/learn/courses/30/lessons/${id}`;
