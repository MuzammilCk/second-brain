---
title: DSA Tracker & Confidence Matrix
type: placement
created: 2026-08-03
last-updated: 2026-08-03
sources:
  - raw/claude-exports/Striver-DSA-sliding-window-two-pointer-problems.md
  - raw/claude-exports/i-would-ike-to-learn-all-these-2.md
  - raw/claude-exports/conversations-memory.md
related:
  - wiki/people/muzammil-ck.md
  - wiki/placements/index.md
---

# DSA Tracker & Confidence Matrix

Comprehensive tracker of Data Structures and Algorithms (DSA) preparation for career placements. Tracks confidence levels across core topics, identifies weak areas, and logs specific practice progress (referencing the Striver A2Z DSA Sheet and LeetCode benchmarks).

This tracker maps to [[wiki/people/muzammil-ck|Muzammil Ck]]'s placement preparation goals.

## Confidence Matrix

| Topic | Confidence Level | Rating (1-5) | Core Strengths / Focus Areas |
| :--- | :--- | :--- | :--- |
| **Arrays & Hashing** | High | 5/5 | Vector/list operations, hash maps, frequency tables |
| **Two Pointers** | High | 4.5/5 | Opposite-direction pointers, fast-slow pointers |
| **Sliding Window** | Medium-High | 4/5 | Fixed & variable window, `atMost(K) - atMost(K-1)` counting trick |
| **Sorting & Searching** | High | 4/5 | Binary search on values, sorting bounds, custom comparators |
| **Recursion & Backtracking** | Medium | 3/5 | Basic recursion, subset generation, permutation construction |
| **Trees & BST** | Medium | 3/5 | DFS/BFS traversals, depth/height calculations, BST properties |
| **Graphs** | Medium-Low | 2.5/5 | BFS on grid/state-space, Dijkstra's algorithm, basic DFS |
| **Dynamic Programming** | Medium-Low | 2/5 | 1-D DP (Fibonacci, Stairs, House Robber), Unbounded Knapsack basics |

## Weak Areas & Focus Action Items

### 1. Dynamic Programming (DP)
- **Status**: Weak / Active Training
- **Identified Challenges**:
  - Transition relations for complex state representations (like interval-based DP, multi-dimensional knapsacks).
  - Formulating optimal substructure and base cases without mixing up combinations and permutations (e.g. outer vs. inner loop order issues).
  - Spotting the state dimensions for games/intervals (e.g. Burst Balloons, Egg Drop) and tree-based DP.
- **Action Items**:
  - Complete Weeks 3-5 of the DP Mastery course (State definition, Unbounded/0-1 Knapsacks).
  - Focus on LeetCode practice for Coin Change (LC 322), Partition Equal Subset Sum (LC 416), and Longest Increasing Subsequence (LC 300).

### 2. Graph Algorithms
- **Status**: Weak / Active Training
- **Identified Challenges**:
  - Implementation speed for complex traversals and cycle detection (directed vs. undirected).
  - Advanced structures including Disjoint Set Union (DSU), Minimum Spanning Trees (Kruskal/Prim), and topological sorting edge cases.
  - Custom state spaces in Dijkstra's / shortest path problems (such as multi-constraint paths).
- **Action Items**:
  - Solve standard BFS/DFS grid-traversal problems (e.g. Number of Islands, Rotting Oranges).
  - Implement DSU template code and practice Union-Find applications on LeetCode.

### 3. Hard Recursion & Backtracking
- **Status**: Moderate / Developing
- **Identified Challenges**:
  - Pruning search paths efficiently to avoid TLE on combinatorial outputs.
  - Designing backtracking states and recovering state variables during post-recursion backtrack steps.
- **Action Items**:
  - Drill on N-Queens, Sudoku Solver, and Word Search style backtracking problems.

## Practice Progress Logs

### Step 10: Sliding Window & Two Pointers (Complete)
Successfully implemented all 12 canonical problems from Striver's A2Z DSA Sheet:
- [x] **Maximum Points You Can Obtain from Cards** (LC 1423) — *Fixed Window*
- [x] **Longest Substring Without Repeating Characters** (LC 3) — *Variable Window*
- [x] **Max Consecutive Ones III** (LC 1004) — *Variable Window*
- [x] **Fruit Into Baskets** (LC 904) — *Variable Window*
- [x] **Longest Repeating Character Replacement** (LC 424) — *Variable Window*
- [x] **Binary Subarrays With Sum** (LC 930) — *AtMost Trick*
- [x] **Count Number of Nice Subarrays** (LC 1248) — *AtMost Trick*
- [x] **Number of Substrings Containing All 3 Characters** (LC 1358) — *Last Index*
- [x] **Minimum Size Subarray Sum** (LC 209) — *Variable Window*
- [x] **Permutation in String** (LC 567) — *Fixed Window*
- [x] **Sliding Window Maximum** (LC 239) — *Monotonic Deque (Hard)*
- [x] **Minimum Window Substring** (LC 76) — *Variable Window (Hard)*

## Related Pages
- [[wiki/people/muzammil-ck|Muzammil Ck]]
- [[wiki/placements/index|Placements Index]]
- [[wiki/placements/placement-portal|Placement Portal]]

## Sources
- `raw/claude-exports/Striver-DSA-sliding-window-two-pointer-problems.md`
- `raw/claude-exports/i-would-ike-to-learn-all-these-2.md`
- `raw/claude-exports/conversations-memory.md`
