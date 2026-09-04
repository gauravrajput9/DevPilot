export const DEFAULT_ARRAY_STARTER_CODE = {
  javascript: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens[0] === '') return;

    const n = parseInt(tokens[0], 10);
    const arr = tokens.slice(1, n + 1).map(Number);

    // Write your solution here
}

main();
`,

  python: `import sys

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return

    n = int(input_data[0])
    arr = [int(x) for x in input_data[1:n+1]]

    # Write your solution here

if __name__ == "__main__":
    main()
`,

  cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    // Write your solution here

    return 0;
}
`,

  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }

        // Write your solution here
    }
}
`,
};

export const DEFAULT_GENERAL_STARTER_CODE = {
  javascript: `const fs = require('fs');

function main() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;

    const tokens = input.split(/\\s+/);

    // Write your solution here
}

main();
`,

  python: `import sys

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return

    # Write your solution here

if __name__ == "__main__":
    main()
`,

  cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Read inputs from stdin using cin >> ...
    // Write your solution here

    return 0;
}
`,

  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;

        // Read inputs using sc.nextInt(), sc.next(), etc.
        // Write your solution here
    }
}
`,
};

export const PISTON_LANGUAGE_SPECS = [
  {
    id: "javascript",
    label: "JavaScript",
    runtime: "Node.js v20.11",
    fileName: "main.js",
    stdinMethod: "fs.readFileSync(0, 'utf-8').trim().split(/\\s+/)",
    stdoutMethod: "console.log(result)",
    keyRules: [
      "Input must be read synchronously from file descriptor 0 using fs.readFileSync(0, 'utf-8').",
      "Do NOT use prompt() or window — code runs on headless Linux Node.js.",
      "Print ONLY the required answer to stdout using console.log. Avoid debug labels like 'Answer: '.",
    ],
    template: DEFAULT_ARRAY_STARTER_CODE.javascript,
  },
  {
    id: "python",
    label: "Python",
    runtime: "Python 3.12",
    fileName: "main.py",
    stdinMethod: "sys.stdin.read().split()",
    stdoutMethod: "print(result)",
    keyRules: [
      "sys.stdin.read().split() reads all whitespace-separated tokens at once, making parsing robust.",
      "Print the final result using print(result). By default, print() appends a newline matching Piston judge trimming.",
      "Avoid input('Enter: ') prompts — any prompt text printed to stdout is compared against expected output and causes Wrong Answer.",
    ],
    template: DEFAULT_ARRAY_STARTER_CODE.python,
  },
  {
    id: "cpp",
    label: "C++",
    runtime: "GCC 10.2 (C++17)",
    fileName: "main.cpp",
    stdinMethod: "cin >> variable",
    stdoutMethod: "cout << result << '\\n';",
    keyRules: [
      "Must define int main() and return 0. Non-zero return codes cause Piston to report Runtime Error.",
      "Include standard headers like <iostream>, <vector>, and <algorithm>.",
      "Never read uninitialized indices. Always ensure the loop bound matches the length N provided in test cases.",
    ],
    template: DEFAULT_ARRAY_STARTER_CODE.cpp,
  },
  {
    id: "java",
    label: "Java",
    runtime: "OpenJDK 15.0.2",
    fileName: "main.java",
    stdinMethod: "Scanner sc = new Scanner(System.in);",
    stdoutMethod: "System.out.println(result);",
    keyRules: [
      "Main class MUST be named Main (public class Main) matching Piston's file main.java.",
      "Entry point must be public static void main(String[] args).",
      "Always check sc.hasNextInt() or sc.hasNext() before reading to prevent NoSuchElementException.",
    ],
    template: DEFAULT_ARRAY_STARTER_CODE.java,
  },
];
