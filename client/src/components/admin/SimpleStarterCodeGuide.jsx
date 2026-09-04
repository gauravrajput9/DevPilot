import { useState } from "react";
import {
  ListFilter,
  Check,
  Copy,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Code2,
  Layers,
  FileText,
  Grid3X3,
  Calculator,
} from "lucide-react";

const PROBLEM_PATTERNS = [
  {
    id: "array",
    label: "Array / List",
    icon: ListFilter,
    badge: "Most Common",
    simpleExplanation: "Use this for problems where the user receives a list or array of numbers.",
    inputExample: "5\n10 20 30 40 50",
    inputExplanation: [
      "Line 1 (5): Tells the code how many numbers to read (size N).",
      "Line 2 (10 20 30 40 50): The actual numbers, separated by a single space.",
      "Why line 1 matters: Languages like C++ and Java need to know the size before creating the array in memory.",
    ],
    starterCodes: {
      javascript: `const fs = require('fs');

function main() {
    // Read all input text from stdin
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens[0] === '') return;

    // Line 1 is the array size N
    const n = parseInt(tokens[0], 10);

    // Line 2 are the array numbers
    const arr = tokens.slice(1, n + 1).map(Number);

    // TODO: Write your solution here
    // Example: console.log(arr[0]);
}

main();
`,
      python: `import sys

def main():
    # Read all input from stdin
    input_data = sys.stdin.read().split()
    if not input_data:
        return

    # Line 1 is the array size N
    n = int(input_data[0])

    # Line 2 are the array numbers
    arr = [int(x) for x in input_data[1:n+1]]

    # TODO: Write your solution here
    # Example: print(arr[0])

if __name__ == "__main__":
    main()
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Fast I/O
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    // Read the N numbers
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    // TODO: Write your solution here
    // Example: cout << arr[0] << "\\n";

    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        // Line 1 is the array size N
        int n = sc.nextInt();

        // Line 2 are the array numbers
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }

        // TODO: Write your solution here
        // Example: System.out.println(arr[0]);
    }
}
`,
    },
  },
  {
    id: "linked_list",
    label: "Linked List",
    icon: Layers,
    badge: "Pointers",
    simpleExplanation: "Use this for problems where the user needs to work with connected list nodes (head -> next).",
    inputExample: "4\n1 2 3 4",
    inputExplanation: [
      "Line 1 (4): The number of nodes in the linked list.",
      "Line 2 (1 2 3 4): The values of each node.",
      "How it works: The starter code creates a simple ListNode class and connects the nodes into a list automatically, so the user just solves the problem with 'head'.",
    ],
    starterCodes: {
      javascript: `const fs = require('fs');

// Node definition
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens[0] === '') return;

    const n = parseInt(tokens[0], 10);
    if (n === 0) return;

    // Automatically build linked list from inputs
    const head = new ListNode(parseInt(tokens[1], 10));
    let current = head;
    for (let i = 2; i <= n; i++) {
        current.next = new ListNode(parseInt(tokens[i], 10));
        current = current.next;
    }

    // TODO: Write your solution here using 'head'
    // Print the final result to stdout
}

main();
`,
      python: `import sys

# Node definition
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return

    n = int(input_data[0])
    if n == 0:
        return

    # Automatically build linked list from inputs
    head = ListNode(int(input_data[1]))
    current = head
    for i in range(2, n + 1):
        current.next = ListNode(int(input_data[i]))
        current = current.next

    # TODO: Write your solution here using 'head'
    # Print the final result to stdout

if __name__ == "__main__":
    main()
`,
      cpp: `#include <iostream>
using namespace std;

// Node definition
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

int main() {
    int n;
    if (!(cin >> n) || n <= 0) return 0;

    // Automatically build linked list from inputs
    int firstVal;
    cin >> firstVal;
    ListNode* head = new ListNode(firstVal);
    ListNode* current = head;

    for (int i = 1; i < n; i++) {
        int val;
        cin >> val;
        current->next = new ListNode(val);
        current = current->next;
    }

    // TODO: Write your solution here using 'head'
    // Print the final result to stdout

    return 0;
}
`,
      java: `import java.util.Scanner;

// Node definition
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) {
        this.val = val;
        this.next = null;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int n = sc.nextInt();
        if (n <= 0) return;

        // Automatically build linked list from inputs
        ListNode head = new ListNode(sc.nextInt());
        ListNode current = head;

        for (int i = 1; i < n; i++) {
            current.next = new ListNode(sc.nextInt());
            current = current.next;
        }

        // TODO: Write your solution here using 'head'
        // Print the final result to stdout
    }
}
`,
    },
  },
  {
    id: "stack",
    label: "Stack / Queue",
    icon: Code2,
    badge: "Operations",
    simpleExplanation: "Use this when the problem asks the user to process commands or push/pop items.",
    inputExample: "4\npush 10\npush 20\npop\npeek",
    inputExplanation: [
      "Line 1 (4): How many operations or commands will be sent.",
      "Lines 2-5: The commands, like 'push 10', 'pop', or 'peek'.",
      "Why: This format makes it clean to test custom Stack and Queue implementations.",
    ],
    starterCodes: {
      javascript: `const fs = require('fs');

function main() {
    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/);
    if (!lines || lines.length === 0 || !lines[0]) return;

    const numOps = parseInt(lines[0].trim(), 10);
    const stack = [];

    for (let i = 1; i <= numOps && i < lines.length; i++) {
        const parts = lines[i].trim().split(/\\s+/);
        const op = parts[0];

        if (op === 'push') {
            stack.push(parseInt(parts[1], 10));
        } else if (op === 'pop') {
            const val = stack.pop();
            console.log(val !== undefined ? val : -1);
        } else if (op === 'peek') {
            console.log(stack.length > 0 ? stack[stack.length - 1] : -1);
        }
    }
}

main();
`,
      python: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return

    num_ops = int(lines[0].strip())
    stack = []

    for i in range(1, min(num_ops + 1, len(lines))):
        parts = lines[i].strip().split()
        if not parts:
            continue
        op = parts[0]

        if op == "push":
            stack.append(int(parts[1]))
        elif op == "pop":
            print(stack.pop() if stack else -1)
        elif op == "peek":
            print(stack[-1] if stack else -1)

if __name__ == "__main__":
    main()
`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int numOps;
    if (!(cin >> numOps)) return 0;

    vector<int> stack;

    for (int i = 0; i < numOps; i++) {
        string op;
        cin >> op;
        if (op == "push") {
            int val;
            cin >> val;
            stack.push_back(val);
        } else if (op == "pop") {
            if (stack.empty()) {
                cout << -1 << "\\n";
            } else {
                cout << stack.back() << "\\n";
                stack.pop_back();
            }
        } else if (op == "peek") {
            cout << (stack.empty() ? -1 : stack.back()) << "\\n";
        }
    }

    return 0;
}
`,
      java: `import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int numOps = sc.nextInt();
        ArrayList<Integer> stack = new ArrayList<>();

        for (int i = 0; i < numOps; i++) {
            String op = sc.next();
            if (op.equals("push")) {
                stack.add(sc.nextInt());
            } else if (op.equals("pop")) {
                if (stack.isEmpty()) {
                    System.out.println(-1);
                } else {
                    System.out.println(stack.remove(stack.size() - 1));
                }
            } else if (op.equals("peek")) {
                System.out.println(stack.isEmpty() ? -1 : stack.get(stack.size() - 1));
            }
        }
    }
}
`,
    },
  },
  {
    id: "string",
    label: "String / Text",
    icon: FileText,
    badge: "Text",
    simpleExplanation: "Use this for string problems like palindrome check, reverse words, or anagram detection.",
    inputExample: "racecar",
    inputExplanation: [
      "Input is just the string or text to be processed.",
      "If the problem tests multiple words, pass the count on Line 1 or the whole sentence on Line 1.",
    ],
    starterCodes: {
      javascript: `const fs = require('fs');

function main() {
    // Read the input string
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;

    // TODO: Write your solution here
    // Example: check if input is a palindrome
}

main();
`,
      python: `import sys

def main():
    # Read the input string
    input_str = sys.stdin.read().strip()
    if not input_str:
        return

    # TODO: Write your solution here
    # Example: check if input_str is a palindrome

if __name__ == "__main__":
    main()
`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string str;
    if (!(cin >> str)) return 0;

    // TODO: Write your solution here
    // Example: check if str is a palindrome

    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;

        String str = sc.next();

        // TODO: Write your solution here
        // Example: check if str is a palindrome
    }
}
`,
    },
  },
  {
    id: "matrix",
    label: "Matrix / 2D Grid",
    icon: Grid3X3,
    badge: "2D Array",
    simpleExplanation: "Use this for grid problems like island count, matrix rotation, or path finding.",
    inputExample: "3 3\n1 2 3\n4 5 6\n7 8 9",
    inputExplanation: [
      "Line 1 (3 3): Number of rows (R) and number of columns (C).",
      "Next R lines: The values in each row of the matrix.",
    ],
    starterCodes: {
      javascript: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens[0] === '') return;

    const rows = parseInt(tokens[0], 10);
    const cols = parseInt(tokens[1], 10);

    const matrix = [];
    let idx = 2;

    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(Number(tokens[idx++]));
        }
        matrix.push(row);
    }

    // TODO: Write your solution here with 'matrix'
}

main();
`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return

    rows = int(tokens[0])
    cols = int(tokens[1])

    matrix = []
    idx = 2
    for r in range(rows):
        row = [int(tokens[idx + c]) for c in range(cols)]
        idx += cols
        matrix.append(row)

    # TODO: Write your solution here with 'matrix'

if __name__ == "__main__":
    main()
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int rows, cols;
    if (!(cin >> rows >> cols)) return 0;

    vector<vector<int>> matrix(rows, vector<int>(cols));
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            cin >> matrix[r][c];
        }
    }

    // TODO: Write your solution here with 'matrix'

    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int rows = sc.nextInt();
        int cols = sc.nextInt();

        int[][] matrix = new int[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                matrix[r][c] = sc.nextInt();
            }
        }

        // TODO: Write your solution here with 'matrix'
    }
}
`,
    },
  },
  {
    id: "math",
    label: "Numbers / Math",
    icon: Calculator,
    badge: "Simple",
    simpleExplanation: "Use this for simple math or two-number problems like Add Two Numbers, GCD, or Prime check.",
    inputExample: "15 20",
    inputExplanation: [
      "Just the numbers separated by a space on a single line.",
      "Example: 15 and 20 for adding two numbers.",
    ],
    starterCodes: {
      javascript: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;

    const a = parseInt(tokens[0], 10);
    const b = parseInt(tokens[1], 10);

    // TODO: Write your solution here
    // Example: console.log(a + b);
}

main();
`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if len(tokens) < 2:
        return

    a = int(tokens[0])
    b = int(tokens[1])

    # TODO: Write your solution here
    # Example: print(a + b)

if __name__ == "__main__":
    main()
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (!(cin >> a >> b)) return 0;

    // TODO: Write your solution here
    // Example: cout << (a + b) << "\\n";

    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLong()) return;

        long a = sc.nextLong();
        long b = sc.nextLong();

        // TODO: Write your solution here
        // Example: System.out.println(a + b);
    }
}
`,
    },
  },
];

const SimpleStarterCodeGuide = ({ onApplyAllLanguages, onApplySingleLanguage }) => {
  const [activeTab, setActiveTab] = useState("array");
  const [activeLang, setActiveLang] = useState("javascript");
  const [copied, setCopied] = useState(false);

  const currentPattern = PROBLEM_PATTERNS.find((p) => p.id === activeTab) || PROBLEM_PATTERNS[0];
  const currentCode = currentPattern.starterCodes[activeLang] || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadAll = () => {
    if (onApplyAllLanguages) {
      onApplyAllLanguages(currentPattern.starterCodes);
    }
  };

  const handleLoadOne = () => {
    if (onApplySingleLanguage) {
      onApplySingleLanguage(activeLang, currentCode);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-violet-500/20 bg-[#08090f] p-5 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Starter Code & Test Case Helper (Simple Guide)
            </h3>
            <p className="text-xs text-zinc-400">
              Click on the data structure below to see how the input and starter code should look.
            </p>
          </div>
        </div>

        {onApplyAllLanguages && (
          <button
            type="button"
            onClick={handleLoadAll}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-violet-600/20 transition hover:scale-[1.02]"
          >
            <Sparkles size={13} />
            Apply {currentPattern.label} to ALL 4 Languages
          </button>
        )}
      </div>

      {/* Navbar Tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5 rounded-xl border border-white/[0.06] bg-black/40 p-1.5">
        {PROBLEM_PATTERNS.map((pattern) => {
          const Icon = pattern.icon;
          const isActive = activeTab === pattern.id;

          return (
            <button
              key={pattern.id}
              type="button"
              onClick={() => setActiveTab(pattern.id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                isActive
                  ? "bg-violet-600 text-white shadow-md"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Icon size={14} />
              <span>{pattern.label}</span>
              {pattern.badge && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/[0.05] text-zinc-400"
                  }`}
                >
                  {pattern.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area for Selected Pattern */}
      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Left Column: Test Case Input Explanation */}
        <div className="space-y-4 rounded-xl border border-white/[0.06] bg-black/30 p-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20 text-[11px] font-bold text-violet-300">
                1
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                How to write the Test Case Input (stdin)
              </h4>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              {currentPattern.simpleExplanation}
            </p>
          </div>

          {/* Example Input Box */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400">Example Input:</span>
            <pre className="rounded-lg border border-white/10 bg-zinc-950 p-3 font-mono text-xs text-emerald-400 select-all">
              {currentPattern.inputExample}
            </pre>
          </div>

          {/* Input Explanation Bullet Points */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400">How to read this input:</span>
            <ul className="space-y-2 text-xs text-zinc-300">
              {currentPattern.inputExplanation.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight size={13} className="mt-0.5 shrink-0 text-violet-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Golden Rules */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-3 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300 text-[11px] uppercase tracking-wide">
              <AlertTriangle size={13} />
              Important Rules for Admin
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              <strong>Rule 1:</strong> Never ask for input with prompts like <code>&quot;Enter number:&quot;</code>. The system automatically compares everything printed with the expected answer.
            </p>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              <strong>Rule 2:</strong> Always provide starter code for all 4 languages so every user can code in their language.
            </p>
          </div>
        </div>

        {/* Right Column: Starter Code for the 4 Languages */}
        <div className="space-y-3 rounded-xl border border-white/[0.06] bg-black/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[11px] font-bold text-blue-300">
                2
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                How the Starter Code Looks
              </h4>
            </div>

            {/* Language Selector Sub-tabs */}
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1">
              {[
                { id: "javascript", label: "JavaScript" },
                { id: "python", label: "Python" },
                { id: "cpp", label: "C++" },
                { id: "java", label: "Java" },
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setActiveLang(lang.id)}
                  className={`rounded px-2.5 py-1 text-[11px] font-medium transition ${
                    activeLang === lang.id
                      ? "bg-violet-600 text-white font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-[11px] text-zinc-400">
              Starter code for <strong className="text-white">{activeLang === "cpp" ? "C++" : activeLang.toUpperCase()}</strong>:
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              {onApplySingleLanguage && (
                <button
                  type="button"
                  onClick={handleLoadOne}
                  className="inline-flex items-center gap-1 rounded border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-300 transition hover:bg-violet-500/20"
                >
                  Apply to {activeLang === "cpp" ? "C++" : activeLang.toUpperCase()}
                </button>
              )}
            </div>
          </div>

          {/* Code Viewer */}
          <pre className="max-h-72 overflow-auto rounded-lg border border-white/10 bg-zinc-950 p-3.5 font-mono text-[11px] leading-relaxed text-zinc-200">
            {currentCode}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SimpleStarterCodeGuide;
