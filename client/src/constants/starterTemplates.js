export const DEFAULT_ARRAY_STARTER_CODE = {
  cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
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
