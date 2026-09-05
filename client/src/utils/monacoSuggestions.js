/**
 * Monaco Suggestions & IntelliSense Engine for DevPilot
 * Provides VS Code-like autocomplete, method signatures, classes,
 * relative file imports, JSX/HTML tags, CSS, and multi-language support (Python, C++, Java, JS).
 */

/* =========================================================
   VS CODE EDITOR DEFAULT OPTIONS
========================================================= */

export const vsCodeEditorOptions = {
  automaticLayout: true,
  fontSize: 14,
  fontFamily: 'Consolas, "Courier New", monospace, "Fira Code"',
  fontLigatures: true,
  padding: {
    top: 12,
    bottom: 12,
  },
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  cursorSmoothCaretAnimation: "on",
  cursorBlinking: "smooth",
  renderLineHighlight: "all",
  lineNumbers: "on",
  roundedSelection: true,
  selectionHighlight: true,
  occurrencesHighlight: "allFiles",
  renderWhitespace: "selection",

  /* Formatting & Brackets */
  formatOnPaste: true,
  formatOnType: true,
  autoClosingBrackets: "always",
  autoClosingQuotes: "always",
  autoClosingDelete: "always",
  autoClosingOvertype: "always",
  autoSurround: "languageDefined",
  bracketPairColorization: {
    enabled: true,
  },
  guides: {
    bracketPairs: true,
    indentation: true,
  },

  /* IntelliSense & Suggestions */
  hover: {
    enabled: true,
    delay: 250,
  },
  parameterHints: {
    enabled: true,
    cycle: true,
  },
  quickSuggestions: {
    other: true,
    comments: true,
    strings: true,
  },
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnCommitCharacter: true,
  acceptSuggestionOnEnter: "on",
  tabCompletion: "on",
  wordBasedSuggestions: "allDocuments",
  snippetSuggestions: "inline",
  suggestSelection: "first",
  renderValidationDecorations: "on",

  suggest: {
    showMethods: true,
    showFunctions: true,
    showConstructors: true,
    showDeprecated: true,
    showFields: true,
    showVariables: true,
    showClasses: true,
    showInterfaces: true,
    showModules: true,
    showProperties: true,
    showEvents: true,
    showOperators: true,
    showValues: true,
    showConstants: true,
    showEnums: true,
    showEnumMembers: true,
    showKeywords: true,
    showWords: true,
    showFiles: true,
    showReferences: true,
    showFolders: true,
    showTypeParameters: true,
    showSnippets: true,
    preview: true,
    shareSuggestSelections: true,
  },

  /* Scrollbar & Minimap */
  scrollbar: {
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },
  minimap: {
    enabled: false,
  },
  folding: true,
  foldingStrategy: "auto",
  showFoldingControls: "mouseover",
  contextmenu: true,
  mouseWheelZoom: true,
  links: true,
};

/* =========================================================
   FRONTEND TYPESCRIPT & JAVASCRIPT CONFIGURATION
========================================================= */

let frontendConfigured = false;

export const setupMonacoFrontend = (monaco) => {
  if (frontendConfigured) return;
  frontendConfigured = true;

  const compilerOptions = {
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
    allowJs: true,
    allowNonTsExtensions: true,
    noEmit: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    checkJs: false,
    strict: false,
  };

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);

  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSyntaxValidation: false,
    noSemanticValidation: true,
  });
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSyntaxValidation: false,
    noSemanticValidation: true,
  });

  // Enable eager model sync so all project files are cross-referenced
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

  // Browser & DOM Type Definitions
  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    `
    interface Window {
      __devpilot_root?: any;
      localStorage: Storage;
      sessionStorage: Storage;
      location: Location;
      addEventListener(type: string, listener: (event: any) => void): void;
      removeEventListener(type: string, listener: (event: any) => void): void;
      alert(message?: any): void;
      confirm(message?: string): boolean;
      prompt(message?: string, _default?: string): string | null;
      setTimeout(handler: (...args: any[]) => void, timeout?: number): number;
      clearTimeout(id: number): void;
      setInterval(handler: (...args: any[]) => void, timeout?: number): number;
      clearInterval(id: number): void;
      requestAnimationFrame(callback: (time: number) => void): number;
      cancelAnimationFrame(handle: number): void;
    }

    declare const window: Window;
    declare const document: {
      getElementById(elementId: string): HTMLElement | null;
      querySelector<E extends HTMLElement = HTMLElement>(selectors: string): E | null;
      querySelectorAll<E extends HTMLElement = HTMLElement>(selectors: string): NodeListOf<E>;
      createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
      createElement(tagName: string): HTMLElement;
      addEventListener(type: string, listener: (event: any) => void): void;
      removeEventListener(type: string, listener: (event: any) => void): void;
      body: HTMLElement;
      title: string;
    };

    declare const console: {
      log(...args: any[]): void;
      error(...args: any[]): void;
      warn(...args: any[]): void;
      info(...args: any[]): void;
      table(tabularData?: any, properties?: string[]): void;
      clear(): void;
      time(label?: string): void;
      timeEnd(label?: string): void;
    };

    declare function fetch(input: string | URL, init?: any): Promise<Response>;
    `,
    "file:///devpilot/browser.d.ts"
  );

  // React & JSX Types
  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    `
    declare module "react" {
      export type SetStateAction<S> = S | ((prevState: S) => S);
      export type Dispatch<A> = (value: A) => void;

      export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
      export function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

      export function useEffect(effect: () => void | (() => void | undefined), deps?: readonly any[]): void;
      export function useLayoutEffect(effect: () => void | (() => void | undefined), deps?: readonly any[]): void;
      export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
      export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
      export function useRef<T>(initialValue: T): { current: T };
      export function useRef<T = undefined>(): { current: T | undefined };
      export function useContext<T>(context: ReactContext<T>): T;
      export function useReducer<R extends (state: any, action: any) => any, I>(
        reducer: R,
        initializerArg: I,
        initializer?: (arg: I) => any
      ): [any, Dispatch<any>];
      export function useId(): string;
      export function useTransition(): [boolean, (callback: () => void) => void];
      export function useDeferredValue<T>(value: T): T;

      export interface ReactContext<T> {
        Provider: any;
        Consumer: any;
        displayName?: string;
      }
      export function createContext<T>(defaultValue: T): ReactContext<T>;
      export function memo<T>(Component: T): T;
      export function forwardRef<T, P = {}>(render: (props: P, ref: any) => any): any;

      export const Fragment: any;
      export const StrictMode: any;
      export const Suspense: any;

      const React: any;
      export default React;
    }

    declare module "react-dom/client" {
      export interface Root {
        render(children: any): void;
        unmount(): void;
      }
      export function createRoot(container: Element | DocumentFragment): Root;
    }

    declare module "react-dom" {
      export function createPortal(children: any, container: Element): any;
    }

    declare namespace JSX {
      interface Element {}
      interface IntrinsicElements {
        div: any;
        span: any;
        button: any;
        input: any;
        form: any;
        label: any;
        p: any;
        h1: any;
        h2: any;
        h3: any;
        h4: any;
        h5: any;
        h6: any;
        ul: any;
        ol: any;
        li: any;
        a: any;
        img: any;
        table: any;
        thead: any;
        tbody: any;
        tr: any;
        th: any;
        td: any;
        section: any;
        header: any;
        footer: any;
        nav: any;
        main: any;
        aside: any;
        article: any;
        select: any;
        option: any;
        textarea: any;
        canvas: any;
        svg: any;
        path: any;
        [elemName: string]: any;
      }
    }
    `,
    "file:///devpilot/react.d.ts"
  );
};

/* =========================================================
   JSX & HTML TAG COMPLETIONS (React / HTML)
========================================================= */

const HTML_TAG_SNIPPETS = [
  { label: "div", snippet: '<div className="$1">\n\t$0\n</div>', detail: "HTML <div> element" },
  { label: "button", snippet: '<button type="button" onClick={$1} className="$2">\n\t$0\n</button>', detail: "HTML <button> element" },
  { label: "span", snippet: '<span className="$1">$0</span>', detail: "HTML <span> element" },
  { label: "p", snippet: '<p className="$1">$0</p>', detail: "HTML <p> paragraph" },
  { label: "h1", snippet: '<h1 className="$1">$0</h1>', detail: "HTML <h1> heading" },
  { label: "h2", snippet: '<h2 className="$1">$0</h2>', detail: "HTML <h2> heading" },
  { label: "h3", snippet: '<h3 className="$1">$0</h3>', detail: "HTML <h3> heading" },
  { label: "input", snippet: '<input type="${1:text}" value={$2} onChange={$3} className="$4" placeholder="$5" />', detail: "HTML <input> element" },
  { label: "form", snippet: '<form onSubmit={$1} className="$2">\n\t$0\n</form>', detail: "HTML <form> element" },
  { label: "label", snippet: '<label className="$1">\n\t$0\n</label>', detail: "HTML <label> element" },
  { label: "ul", snippet: '<ul className="$1">\n\t<li$2>$0</li>\n</ul>', detail: "HTML <ul> list" },
  { label: "li", snippet: '<li className="$1">$0</li>', detail: "HTML <li> item" },
  { label: "a", snippet: '<a href="${1:#}" className="$2">$0</a>', detail: "HTML <a> anchor" },
  { label: "img", snippet: '<img src="${1}" alt="${2}" className="$3" />', detail: "HTML <img> image" },
  { label: "section", snippet: '<section className="$1">\n\t$0\n</section>', detail: "HTML <section> container" },
  { label: "main", snippet: '<main className="$1">\n\t$0\n</main>', detail: "HTML <main> container" },
  { label: "header", snippet: '<header className="$1">\n\t$0\n</header>', detail: "HTML <header> element" },
  { label: "footer", snippet: '<footer className="$1">\n\t$0\n</footer>', detail: "HTML <footer> element" },
  { label: "nav", snippet: '<nav className="$1">\n\t$0\n</nav>', detail: "HTML <nav> navigation" },
  { label: "textarea", snippet: '<textarea value={$1} onChange={$2} className="$3" placeholder="$4" rows={${5:4}} />', detail: "HTML <textarea> element" },
  { label: "select", snippet: '<select value={$1} onChange={$2} className="$3">\n\t<option value="$4">$5</option>\n</select>', detail: "HTML <select> element" },
];

const JSX_ATTRIBUTES = [
  { label: "className", insertText: 'className="$1"', detail: "CSS class name" },
  { label: "style", insertText: "style={{ $1 }}", detail: "Inline styles object" },
  { label: "onClick", insertText: "onClick={$1}", detail: "Click event handler" },
  { label: "onChange", insertText: "onChange={(e) => $1}", detail: "Change event handler" },
  { label: "onSubmit", insertText: "onSubmit={(e) => {\n\te.preventDefault();\n\t$1\n}}", detail: "Form submit handler" },
  { label: "onKeyDown", insertText: "onKeyDown={(e) => $1}", detail: "Key down handler" },
  { label: "value", insertText: "value={$1}", detail: "Controlled input value" },
  { label: "placeholder", insertText: 'placeholder="$1"', detail: "Placeholder text" },
  { label: "disabled", insertText: "disabled", detail: "Disabled boolean attribute" },
  { label: "type", insertText: 'type="${1|text,button,submit,number,checkbox,password|}"', detail: "Input type" },
  { label: "id", insertText: 'id="$1"', detail: "Element ID" },
  { label: "ref", insertText: "ref={$1}", detail: "React reference" },
  { label: "key", insertText: "key={$1}", detail: "React element key" },
  { label: "title", insertText: 'title="$1"', detail: "Tooltip title" },
  { label: "autoFocus", insertText: "autoFocus", detail: "Auto focus on mount" },
];

const REACT_SNIPPETS = [
  {
    label: "useState",
    insertText: "const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialState});",
    detail: "React useState hook snippet",
  },
  {
    label: "useEffect",
    insertText: "useEffect(() => {\n\t$0\n}, [${1}]);",
    detail: "React useEffect hook snippet",
  },
  {
    label: "useMemo",
    insertText: "const ${1:memoizedValue} = useMemo(() => {\n\treturn $2;\n}, [${3}]);",
    detail: "React useMemo hook snippet",
  },
  {
    label: "useCallback",
    insertText: "const ${1:memoizedCallback} = useCallback((${2}) => {\n\t$0\n}, [${3}]);",
    detail: "React useCallback hook snippet",
  },
  {
    label: "useRef",
    insertText: "const ${1:ref} = useRef(${2:null});",
    detail: "React useRef hook snippet",
  },
  {
    label: "rfc (React Functional Component)",
    insertText: "export default function ${1:Component}() {\n\treturn (\n\t\t<div>\n\t\t\t$0\n\t\t</div>\n\t);\n}",
    detail: "React Functional Component snippet",
  },
];

/* =========================================================
   CSS PROPERTIES COMPLETIONS
========================================================= */

const CSS_PROPERTIES = [
  { label: "display", insertText: "display: ${1|flex,grid,block,inline-block,none,inline|};", detail: "CSS display" },
  { label: "flex-direction", insertText: "flex-direction: ${1|row,column,row-reverse,column-reverse|};", detail: "Flex direction" },
  { label: "justify-content", insertText: "justify-content: ${1|center,space-between,space-around,space-evenly,flex-start,flex-end|};", detail: "Flex/Grid justify content" },
  { label: "align-items", insertText: "align-items: ${1|center,flex-start,flex-end,stretch,baseline|};", detail: "Flex/Grid align items" },
  { label: "gap", insertText: "gap: ${1:16px};", detail: "Gap between grid/flex items" },
  { label: "padding", insertText: "padding: ${1:16px};", detail: "Padding" },
  { label: "margin", insertText: "margin: ${1:0};", detail: "Margin" },
  { label: "width", insertText: "width: ${1:100%};", detail: "Width" },
  { label: "height", insertText: "height: ${1:100%};", detail: "Height" },
  { label: "min-width", insertText: "min-width: ${1:0};", detail: "Minimum width" },
  { label: "min-height", insertText: "min-height: ${1:100vh};", detail: "Minimum height" },
  { label: "background", insertText: "background: ${1:#000};", detail: "Background" },
  { label: "background-color", insertText: "background-color: ${1:#ffffff};", detail: "Background color" },
  { label: "color", insertText: "color: ${1:#ffffff};", detail: "Text color" },
  { label: "font-size", insertText: "font-size: ${1:16px};", detail: "Font size" },
  { label: "font-weight", insertText: "font-weight: ${1|400,500,600,700,bold,normal|};", detail: "Font weight" },
  { label: "font-family", insertText: "font-family: ${1:Arial, sans-serif};", detail: "Font family" },
  { label: "border", insertText: "border: 1px solid ${1:#e5e7eb};", detail: "Border" },
  { label: "border-radius", insertText: "border-radius: ${1:8px};", detail: "Border radius" },
  { label: "box-sizing", insertText: "box-sizing: ${1|border-box,content-box|};", detail: "Box sizing" },
  { label: "position", insertText: "position: ${1|relative,absolute,fixed,sticky,static|};", detail: "Position" },
  { label: "top", insertText: "top: ${1:0};", detail: "Top offset" },
  { label: "left", insertText: "left: ${1:0};", detail: "Left offset" },
  { label: "right", insertText: "right: ${1:0};", detail: "Right offset" },
  { label: "bottom", insertText: "bottom: ${1:0};", detail: "Bottom offset" },
  { label: "z-index", insertText: "z-index: ${1:10};", detail: "Z-index stack order" },
  { label: "overflow", insertText: "overflow: ${1|hidden,auto,scroll,visible|};", detail: "Overflow behavior" },
  { label: "cursor", insertText: "cursor: ${1|pointer,default,not-allowed,grab|};", detail: "Mouse cursor" },
  { label: "transition", insertText: "transition: all ${1:0.2s} ease;", detail: "Transition" },
  { label: "transform", insertText: "transform: ${1|scale(1.05),translateY(-2px),rotate(45deg)|};", detail: "Transform" },
  { label: "box-shadow", insertText: "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);", detail: "Box shadow" },
  { label: "opacity", insertText: "opacity: ${1:0.8};", detail: "Opacity" },
];

/* =========================================================
   TAILWIND CSS UTILITY CLASSES CATALOG
========================================================= */

const TAILWIND_UTILITY_CLASSES = [
  // Layout & Display
  { label: "flex", detail: "display: flex;", doc: "Creates a flex container." },
  { label: "inline-flex", detail: "display: inline-flex;", doc: "Creates an inline flex container." },
  { label: "grid", detail: "display: grid;", doc: "Creates a grid container." },
  { label: "inline-grid", detail: "display: inline-grid;", doc: "Creates an inline grid container." },
  { label: "hidden", detail: "display: none;", doc: "Hides an element from the layout." },
  { label: "block", detail: "display: block;", doc: "Displays an element as a block-level element." },
  { label: "inline-block", detail: "display: inline-block;", doc: "Displays an element as an inline-level block container." },
  { label: "inline", detail: "display: inline;", doc: "Displays an element as an inline element." },
  { label: "contents", detail: "display: contents;", doc: "Creates a phantom container whose children act like direct children of the parent." },
  { label: "container", detail: "max-width: 100%;", doc: "Responsive container with fixed widths matching current breakpoint." },

  // Flexbox
  { label: "flex-col", detail: "flex-direction: column;", doc: "Positions flex items vertically." },
  { label: "flex-row", detail: "flex-direction: row;", doc: "Positions flex items horizontally." },
  { label: "flex-col-reverse", detail: "flex-direction: column-reverse;", doc: "Positions flex items vertically in reverse." },
  { label: "flex-row-reverse", detail: "flex-direction: row-reverse;", doc: "Positions flex items horizontally in reverse." },
  { label: "flex-wrap", detail: "flex-wrap: wrap;", doc: "Allows flex items to wrap onto multiple lines." },
  { label: "flex-nowrap", detail: "flex-wrap: nowrap;", doc: "Prevents flex items from wrapping." },
  { label: "flex-1", detail: "flex: 1 1 0%;", doc: "Allows flex item to grow and shrink as needed, ignoring initial size." },
  { label: "flex-auto", detail: "flex: 1 1 auto;", doc: "Allows flex item to grow and shrink, taking initial size into account." },
  { label: "flex-initial", detail: "flex: 0 1 auto;", doc: "Allows flex item to shrink but not grow." },
  { label: "flex-none", detail: "flex: none;", doc: "Prevents a flex item from growing or shrinking." },
  { label: "grow", detail: "flex-grow: 1;", doc: "Allows a flex item to grow to fill any available space." },
  { label: "grow-0", detail: "flex-grow: 0;", doc: "Prevents a flex item from growing." },
  { label: "shrink", detail: "flex-shrink: 1;", doc: "Allows a flex item to shrink if needed." },
  { label: "shrink-0", detail: "flex-shrink: 0;", doc: "Prevents a flex item from shrinking below its default size." },

  // Alignment & Justify
  { label: "items-center", detail: "align-items: center;", doc: "Aligns flex/grid items along center of cross axis." },
  { label: "items-start", detail: "align-items: flex-start;", doc: "Aligns items to start of cross axis." },
  { label: "items-end", detail: "align-items: flex-end;", doc: "Aligns items to end of cross axis." },
  { label: "items-stretch", detail: "align-items: stretch;", doc: "Stretches items to fill cross axis." },
  { label: "items-baseline", detail: "align-items: baseline;", doc: "Aligns items along their baseline." },
  { label: "justify-center", detail: "justify-content: center;", doc: "Justifies items along center of main axis." },
  { label: "justify-between", detail: "justify-content: space-between;", doc: "Justifies items with equal space between them." },
  { label: "justify-around", detail: "justify-content: space-around;", doc: "Justifies items with space around them." },
  { label: "justify-evenly", detail: "justify-content: space-evenly;", doc: "Justifies items with equal space around each item." },
  { label: "justify-start", detail: "justify-content: flex-start;", doc: "Justifies items against start of main axis." },
  { label: "justify-end", detail: "justify-content: flex-end;", doc: "Justifies items against end of main axis." },
  { label: "self-auto", detail: "align-self: auto;", doc: "Aligns item based on parent align-items." },
  { label: "self-start", detail: "align-self: flex-start;", doc: "Aligns item to start of cross axis." },
  { label: "self-end", detail: "align-self: flex-end;", doc: "Aligns item to end of cross axis." },
  { label: "self-center", detail: "align-self: center;", doc: "Aligns item along center of cross axis." },
  { label: "self-stretch", detail: "align-self: stretch;", doc: "Stretches item to fill cross axis." },

  // Grid
  { label: "grid-cols-1", detail: "grid-template-columns: repeat(1, minmax(0, 1fr));", doc: "Grid with 1 column." },
  { label: "grid-cols-2", detail: "grid-template-columns: repeat(2, minmax(0, 1fr));", doc: "Grid with 2 equal columns." },
  { label: "grid-cols-3", detail: "grid-template-columns: repeat(3, minmax(0, 1fr));", doc: "Grid with 3 equal columns." },
  { label: "grid-cols-4", detail: "grid-template-columns: repeat(4, minmax(0, 1fr));", doc: "Grid with 4 equal columns." },
  { label: "grid-cols-5", detail: "grid-template-columns: repeat(5, minmax(0, 1fr));", doc: "Grid with 5 equal columns." },
  { label: "grid-cols-6", detail: "grid-template-columns: repeat(6, minmax(0, 1fr));", doc: "Grid with 6 equal columns." },
  { label: "grid-cols-12", detail: "grid-template-columns: repeat(12, minmax(0, 1fr));", doc: "12-column grid system." },
  { label: "col-span-1", detail: "grid-column: span 1 / span 1;", doc: "Spans 1 column in a grid." },
  { label: "col-span-2", detail: "grid-column: span 2 / span 2;", doc: "Spans 2 columns in a grid." },
  { label: "col-span-3", detail: "grid-column: span 3 / span 3;", doc: "Spans 3 columns in a grid." },
  { label: "col-span-4", detail: "grid-column: span 4 / span 4;", doc: "Spans 4 columns in a grid." },
  { label: "col-span-6", detail: "grid-column: span 6 / span 6;", doc: "Spans 6 columns in a grid." },
  { label: "col-span-12", detail: "grid-column: span 12 / span 12;", doc: "Spans 12 columns." },
  { label: "col-span-full", detail: "grid-column: 1 / -1;", doc: "Spans across all columns in a grid." },
  { label: "gap-1", detail: "gap: 0.25rem;", doc: "4px gap." },
  { label: "gap-2", detail: "gap: 0.5rem;", doc: "8px gap." },
  { label: "gap-3", detail: "gap: 0.75rem;", doc: "12px gap." },
  { label: "gap-4", detail: "gap: 1rem;", doc: "16px gap." },
  { label: "gap-5", detail: "gap: 1.25rem;", doc: "20px gap." },
  { label: "gap-6", detail: "gap: 1.5rem;", doc: "24px gap." },
  { label: "gap-8", detail: "gap: 2rem;", doc: "32px gap." },
  { label: "gap-10", detail: "gap: 2.5rem;", doc: "40px gap." },
  { label: "gap-12", detail: "gap: 3rem;", doc: "48px gap." },
  { label: "gap-x-2", detail: "column-gap: 0.5rem;", doc: "8px horizontal gap." },
  { label: "gap-x-4", detail: "column-gap: 1rem;", doc: "16px horizontal gap." },
  { label: "gap-x-6", detail: "column-gap: 1.5rem;", doc: "24px horizontal gap." },
  { label: "gap-y-2", detail: "row-gap: 0.5rem;", doc: "8px vertical gap." },
  { label: "gap-y-4", detail: "row-gap: 1rem;", doc: "16px vertical gap." },
  { label: "gap-y-6", detail: "row-gap: 1.5rem;", doc: "24px vertical gap." },

  // Spacing (Padding)
  { label: "p-0", detail: "padding: 0px;", doc: "0px padding." },
  { label: "p-1", detail: "padding: 0.25rem;", doc: "4px padding." },
  { label: "p-1.5", detail: "padding: 0.375rem;", doc: "6px padding." },
  { label: "p-2", detail: "padding: 0.5rem;", doc: "8px padding." },
  { label: "p-2.5", detail: "padding: 0.625rem;", doc: "10px padding." },
  { label: "p-3", detail: "padding: 0.75rem;", doc: "12px padding." },
  { label: "p-4", detail: "padding: 1rem;", doc: "16px padding." },
  { label: "p-5", detail: "padding: 1.25rem;", doc: "20px padding." },
  { label: "p-6", detail: "padding: 1.5rem;", doc: "24px padding." },
  { label: "p-8", detail: "padding: 2rem;", doc: "32px padding." },
  { label: "p-10", detail: "padding: 2.5rem;", doc: "40px padding." },
  { label: "p-12", detail: "padding: 3rem;", doc: "48px padding." },
  { label: "p-16", detail: "padding: 4rem;", doc: "64px padding." },
  { label: "px-1", detail: "padding-left: 0.25rem; padding-right: 0.25rem;", doc: "4px horizontal padding." },
  { label: "px-2", detail: "padding-left: 0.5rem; padding-right: 0.5rem;", doc: "8px horizontal padding." },
  { label: "px-3", detail: "padding-left: 0.75rem; padding-right: 0.75rem;", doc: "12px horizontal padding." },
  { label: "px-4", detail: "padding-left: 1rem; padding-right: 1rem;", doc: "16px horizontal padding." },
  { label: "px-5", detail: "padding-left: 1.25rem; padding-right: 1.25rem;", doc: "20px horizontal padding." },
  { label: "px-6", detail: "padding-left: 1.5rem; padding-right: 1.5rem;", doc: "24px horizontal padding." },
  { label: "px-8", detail: "padding-left: 2rem; padding-right: 2rem;", doc: "32px horizontal padding." },
  { label: "py-1", detail: "padding-top: 0.25rem; padding-bottom: 0.25rem;", doc: "4px vertical padding." },
  { label: "py-1.5", detail: "padding-top: 0.375rem; padding-bottom: 0.375rem;", doc: "6px vertical padding." },
  { label: "py-2", detail: "padding-top: 0.5rem; padding-bottom: 0.5rem;", doc: "8px vertical padding." },
  { label: "py-2.5", detail: "padding-top: 0.625rem; padding-bottom: 0.625rem;", doc: "10px vertical padding." },
  { label: "py-3", detail: "padding-top: 0.75rem; padding-bottom: 0.75rem;", doc: "12px vertical padding." },
  { label: "py-4", detail: "padding-top: 1rem; padding-bottom: 1rem;", doc: "16px vertical padding." },
  { label: "py-6", detail: "padding-top: 1.5rem; padding-bottom: 1.5rem;", doc: "24px vertical padding." },
  { label: "py-8", detail: "padding-top: 2rem; padding-bottom: 2rem;", doc: "32px vertical padding." },
  { label: "pt-2", detail: "padding-top: 0.5rem;", doc: "8px top padding." },
  { label: "pt-4", detail: "padding-top: 1rem;", doc: "16px top padding." },
  { label: "pt-6", detail: "padding-top: 1.5rem;", doc: "24px top padding." },
  { label: "pt-8", detail: "padding-top: 2rem;", doc: "32px top padding." },
  { label: "pb-2", detail: "padding-bottom: 0.5rem;", doc: "8px bottom padding." },
  { label: "pb-4", detail: "padding-bottom: 1rem;", doc: "16px bottom padding." },
  { label: "pb-6", detail: "padding-bottom: 1.5rem;", doc: "24px bottom padding." },
  { label: "pb-8", detail: "padding-bottom: 2rem;", doc: "32px bottom padding." },
  { label: "pl-2", detail: "padding-left: 0.5rem;", doc: "8px left padding." },
  { label: "pl-4", detail: "padding-left: 1rem;", doc: "16px left padding." },
  { label: "pr-2", detail: "padding-right: 0.5rem;", doc: "8px right padding." },
  { label: "pr-4", detail: "padding-right: 1rem;", doc: "16px right padding." },

  // Spacing (Margin)
  { label: "m-0", detail: "margin: 0px;", doc: "0px margin." },
  { label: "m-1", detail: "margin: 0.25rem;", doc: "4px margin." },
  { label: "m-2", detail: "margin: 0.5rem;", doc: "8px margin." },
  { label: "m-3", detail: "margin: 0.75rem;", doc: "12px margin." },
  { label: "m-4", detail: "margin: 1rem;", doc: "16px margin." },
  { label: "m-6", detail: "margin: 1.5rem;", doc: "24px margin." },
  { label: "m-8", detail: "margin: 2rem;", doc: "32px margin." },
  { label: "m-auto", detail: "margin: auto;", doc: "Automatic margin." },
  { label: "mx-auto", detail: "margin-left: auto; margin-right: auto;", doc: "Center horizontally with auto margins." },
  { label: "my-auto", detail: "margin-top: auto; margin-bottom: auto;", doc: "Center vertically with auto margins." },
  { label: "mx-2", detail: "margin-left: 0.5rem; margin-right: 0.5rem;", doc: "8px horizontal margin." },
  { label: "mx-4", detail: "margin-left: 1rem; margin-right: 1rem;", doc: "16px horizontal margin." },
  { label: "my-2", detail: "margin-top: 0.5rem; margin-bottom: 0.5rem;", doc: "8px vertical margin." },
  { label: "my-4", detail: "margin-top: 1rem; margin-bottom: 1rem;", doc: "16px vertical margin." },
  { label: "my-6", detail: "margin-top: 1.5rem; margin-bottom: 1.5rem;", doc: "24px vertical margin." },
  { label: "my-8", detail: "margin-top: 2rem; margin-bottom: 2rem;", doc: "32px vertical margin." },
  { label: "mt-1", detail: "margin-top: 0.25rem;", doc: "4px top margin." },
  { label: "mt-2", detail: "margin-top: 0.5rem;", doc: "8px top margin." },
  { label: "mt-3", detail: "margin-top: 0.75rem;", doc: "12px top margin." },
  { label: "mt-4", detail: "margin-top: 1rem;", doc: "16px top margin." },
  { label: "mt-6", detail: "margin-top: 1.5rem;", doc: "24px top margin." },
  { label: "mt-8", detail: "margin-top: 2rem;", doc: "32px top margin." },
  { label: "mb-1", detail: "margin-bottom: 0.25rem;", doc: "4px bottom margin." },
  { label: "mb-2", detail: "margin-bottom: 0.5rem;", doc: "8px bottom margin." },
  { label: "mb-3", detail: "margin-bottom: 0.75rem;", doc: "12px bottom margin." },
  { label: "mb-4", detail: "margin-bottom: 1rem;", doc: "16px bottom margin." },
  { label: "mb-6", detail: "margin-bottom: 1.5rem;", doc: "24px bottom margin." },
  { label: "mb-8", detail: "margin-bottom: 2rem;", doc: "32px bottom margin." },
  { label: "-translate-y-0.5", detail: "transform: translateY(-0.125rem);", doc: "-2px translate Y." },
  { label: "-translate-y-1", detail: "transform: translateY(-0.25rem);", doc: "-4px translate Y." },
  { label: "translate-y-0", detail: "transform: translateY(0px);", doc: "Reset translate Y." },

  // Sizing
  { label: "w-full", detail: "width: 100%;", doc: "Full width (100%)." },
  { label: "w-screen", detail: "width: 100vw;", doc: "Full viewport width (100vw)." },
  { label: "w-auto", detail: "width: auto;", doc: "Automatic width." },
  { label: "w-fit", detail: "width: fit-content;", doc: "Fit content width." },
  { label: "w-1/2", detail: "width: 50%;", doc: "50% width." },
  { label: "w-1/3", detail: "width: 33.333333%;", doc: "33.33% width." },
  { label: "w-2/3", detail: "width: 66.666667%;", doc: "66.67% width." },
  { label: "w-1/4", detail: "width: 25%;", doc: "25% width." },
  { label: "w-3/4", detail: "width: 75%;", doc: "75% width." },
  { label: "w-4", detail: "width: 1rem;", doc: "16px width." },
  { label: "w-5", detail: "width: 1.25rem;", doc: "20px width." },
  { label: "w-6", detail: "width: 1.5rem;", doc: "24px width." },
  { label: "w-8", detail: "width: 2rem;", doc: "32px width." },
  { label: "w-10", detail: "width: 2.5rem;", doc: "40px width." },
  { label: "w-12", detail: "width: 3rem;", doc: "48px width." },
  { label: "w-16", detail: "width: 4rem;", doc: "64px width." },
  { label: "w-20", detail: "width: 5rem;", doc: "80px width." },
  { label: "w-24", detail: "width: 6rem;", doc: "96px width." },
  { label: "w-32", detail: "width: 8rem;", doc: "128px width." },
  { label: "w-48", detail: "width: 12rem;", doc: "192px width." },
  { label: "w-64", detail: "width: 16rem;", doc: "256px width." },
  { label: "h-full", detail: "height: 100%;", doc: "Full height (100%)." },
  { label: "h-screen", detail: "height: 100vh;", doc: "Full viewport height (100vh)." },
  { label: "h-auto", detail: "height: auto;", doc: "Automatic height." },
  { label: "h-fit", detail: "height: fit-content;", doc: "Fit content height." },
  { label: "h-4", detail: "height: 1rem;", doc: "16px height." },
  { label: "h-5", detail: "height: 1.25rem;", doc: "20px height." },
  { label: "h-6", detail: "height: 1.5rem;", doc: "24px height." },
  { label: "h-8", detail: "height: 2rem;", doc: "32px height." },
  { label: "h-10", detail: "height: 2.5rem;", doc: "40px height." },
  { label: "h-12", detail: "height: 3rem;", doc: "48px height." },
  { label: "h-16", detail: "height: 4rem;", doc: "64px height." },
  { label: "h-20", detail: "height: 5rem;", doc: "80px height." },
  { label: "h-24", detail: "height: 6rem;", doc: "96px height." },
  { label: "h-32", detail: "height: 8rem;", doc: "128px height." },
  { label: "min-h-screen", detail: "min-height: 100vh;", doc: "Minimum height of 100vh." },
  { label: "min-h-full", detail: "min-height: 100%;", doc: "Minimum height of 100%." },
  { label: "min-h-0", detail: "min-height: 0px;", doc: "Allows flex child to shrink." },
  { label: "min-w-0", detail: "min-width: 0px;", doc: "Allows flex child to truncate or shrink." },
  { label: "min-w-full", detail: "min-width: 100%;", doc: "Minimum width of 100%." },
  { label: "max-w-xs", detail: "max-width: 20rem;", doc: "320px max width." },
  { label: "max-w-sm", detail: "max-width: 24rem;", doc: "384px max width." },
  { label: "max-w-md", detail: "max-width: 28rem;", doc: "448px max width." },
  { label: "max-w-lg", detail: "max-width: 32rem;", doc: "512px max width." },
  { label: "max-w-xl", detail: "max-width: 36rem;", doc: "576px max width." },
  { label: "max-w-2xl", detail: "max-width: 42rem;", doc: "672px max width." },
  { label: "max-w-3xl", detail: "max-width: 48rem;", doc: "768px max width." },
  { label: "max-w-4xl", detail: "max-width: 56rem;", doc: "896px max width." },
  { label: "max-w-5xl", detail: "max-width: 64rem;", doc: "1024px max width." },
  { label: "max-w-7xl", detail: "max-width: 80rem;", doc: "1280px max width." },
  { label: "max-w-full", detail: "max-width: 100%;", doc: "Full max width." },
  { label: "max-w-none", detail: "max-width: none;", doc: "Remove max width." },

  // Typography
  { label: "text-xs", detail: "font-size: 0.75rem; line-height: 1rem;", doc: "12px text size." },
  { label: "text-sm", detail: "font-size: 0.875rem; line-height: 1.25rem;", doc: "14px text size." },
  { label: "text-base", detail: "font-size: 1rem; line-height: 1.5rem;", doc: "16px text size." },
  { label: "text-lg", detail: "font-size: 1.125rem; line-height: 1.75rem;", doc: "18px text size." },
  { label: "text-xl", detail: "font-size: 1.25rem; line-height: 1.75rem;", doc: "20px text size." },
  { label: "text-2xl", detail: "font-size: 1.5rem; line-height: 2rem;", doc: "24px text size." },
  { label: "text-3xl", detail: "font-size: 1.875rem; line-height: 2.25rem;", doc: "30px text size." },
  { label: "text-4xl", detail: "font-size: 2.25rem; line-height: 2.5rem;", doc: "36px text size." },
  { label: "text-5xl", detail: "font-size: 3rem; line-height: 1;", doc: "48px text size." },
  { label: "font-light", detail: "font-weight: 300;", doc: "Light font weight." },
  { label: "font-normal", detail: "font-weight: 400;", doc: "Normal font weight." },
  { label: "font-medium", detail: "font-weight: 500;", doc: "Medium font weight." },
  { label: "font-semibold", detail: "font-weight: 600;", doc: "Semibold font weight." },
  { label: "font-bold", detail: "font-weight: 700;", doc: "Bold font weight." },
  { label: "font-extrabold", detail: "font-weight: 800;", doc: "Extra bold font weight." },
  { label: "font-black", detail: "font-weight: 900;", doc: "Black font weight." },
  { label: "font-sans", detail: "font-family: ui-sans-serif, system-ui, ...;", doc: "Sans-serif font family." },
  { label: "font-mono", detail: "font-family: ui-monospace, SFMono-Regular, ...;", doc: "Monospace font family." },
  { label: "text-left", detail: "text-align: left;", doc: "Align text to left." },
  { label: "text-center", detail: "text-align: center;", doc: "Align text to center." },
  { label: "text-right", detail: "text-align: right;", doc: "Align text to right." },
  { label: "truncate", detail: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;", doc: "Truncate text with ellipsis." },
  { label: "tracking-tight", detail: "letter-spacing: -0.025em;", doc: "Tighter letter spacing." },
  { label: "tracking-wide", detail: "letter-spacing: 0.025em;", doc: "Wider letter spacing." },
  { label: "leading-tight", detail: "line-height: 1.25;", doc: "Tight line height." },
  { label: "leading-normal", detail: "line-height: 1.5;", doc: "Normal line height." },
  { label: "leading-relaxed", detail: "line-height: 1.625;", doc: "Relaxed line height." },
  { label: "antialiased", detail: "-webkit-font-smoothing: antialiased;", doc: "Smooth font rendering." },
  { label: "italic", detail: "font-style: italic;", doc: "Italic text." },
  { label: "underline", detail: "text-decoration: underline;", doc: "Underline text." },
  { label: "no-underline", detail: "text-decoration: none;", doc: "Remove text underline." },

  // Colors & Backgrounds
  { label: "bg-transparent", detail: "background-color: transparent;", kind: "Color" },
  { label: "bg-black", detail: "background-color: #000000;", kind: "Color" },
  { label: "bg-white", detail: "background-color: #ffffff;", kind: "Color" },
  { label: "text-white", detail: "color: #ffffff;", kind: "Color" },
  { label: "text-black", detail: "color: #000000;", kind: "Color" },
  { label: "bg-zinc-50", detail: "background-color: #fafafa;", kind: "Color" },
  { label: "bg-zinc-100", detail: "background-color: #f4f4f5;", kind: "Color" },
  { label: "bg-zinc-800", detail: "background-color: #27272a;", kind: "Color" },
  { label: "bg-zinc-900", detail: "background-color: #18181b;", kind: "Color" },
  { label: "bg-zinc-950", detail: "background-color: #09090b;", kind: "Color" },
  { label: "text-zinc-100", detail: "color: #f4f4f5;", kind: "Color" },
  { label: "text-zinc-200", detail: "color: #e4e4e7;", kind: "Color" },
  { label: "text-zinc-300", detail: "color: #d4d4d8;", kind: "Color" },
  { label: "text-zinc-400", detail: "color: #a1a1aa;", kind: "Color" },
  { label: "text-zinc-500", detail: "color: #71717a;", kind: "Color" },
  { label: "bg-violet-500", detail: "background-color: #8b5cf6;", kind: "Color" },
  { label: "bg-violet-600", detail: "background-color: #7c3aed;", kind: "Color" },
  { label: "bg-violet-700", detail: "background-color: #6d28d9;", kind: "Color" },
  { label: "text-violet-400", detail: "color: #a78bfa;", kind: "Color" },
  { label: "text-violet-500", detail: "color: #8b5cf6;", kind: "Color" },
  { label: "bg-blue-500", detail: "background-color: #3b82f6;", kind: "Color" },
  { label: "bg-blue-600", detail: "background-color: #2563eb;", kind: "Color" },
  { label: "text-blue-400", detail: "color: #60a5fa;", kind: "Color" },
  { label: "bg-emerald-500", detail: "background-color: #10b981;", kind: "Color" },
  { label: "bg-emerald-600", detail: "background-color: #059669;", kind: "Color" },
  { label: "text-emerald-400", detail: "color: #34d399;", kind: "Color" },
  { label: "bg-red-500", detail: "background-color: #ef4444;", kind: "Color" },
  { label: "bg-red-600", detail: "background-color: #dc2626;", kind: "Color" },
  { label: "text-red-400", detail: "color: #f87171;", kind: "Color" },
  { label: "bg-amber-500", detail: "background-color: #f59e0b;", kind: "Color" },
  { label: "text-amber-400", detail: "color: #fbbf24;", kind: "Color" },
  { label: "bg-indigo-600", detail: "background-color: #4f46e5;", kind: "Color" },
  { label: "text-indigo-400", detail: "color: #818cf8;", kind: "Color" },

  // Gradients
  { label: "bg-gradient-to-r", detail: "linear-gradient(to right, var(--tw-gradient-stops))", doc: "Gradient to right." },
  { label: "bg-gradient-to-b", detail: "linear-gradient(to bottom, var(--tw-gradient-stops))", doc: "Gradient to bottom." },
  { label: "bg-gradient-to-br", detail: "linear-gradient(to bottom right, var(--tw-gradient-stops))", doc: "Gradient to bottom right." },
  { label: "from-zinc-950", detail: "--tw-gradient-from: #09090b;", kind: "Color" },
  { label: "from-violet-600", detail: "--tw-gradient-from: #7c3aed;", kind: "Color" },
  { label: "from-blue-600", detail: "--tw-gradient-from: #2563eb;", kind: "Color" },
  { label: "via-zinc-900", detail: "--tw-gradient-to: #18181b;", kind: "Color" },
  { label: "to-zinc-950", detail: "--tw-gradient-to: #09090b;", kind: "Color" },
  { label: "to-indigo-600", detail: "--tw-gradient-to: #4f46e5;", kind: "Color" },

  // Borders & Rounded
  { label: "rounded-sm", detail: "border-radius: 0.125rem;", doc: "2px border radius." },
  { label: "rounded", detail: "border-radius: 0.25rem;", doc: "4px border radius." },
  { label: "rounded-md", detail: "border-radius: 0.375rem;", doc: "6px border radius." },
  { label: "rounded-lg", detail: "border-radius: 0.5rem;", doc: "8px border radius." },
  { label: "rounded-xl", detail: "border-radius: 0.75rem;", doc: "12px border radius." },
  { label: "rounded-2xl", detail: "border-radius: 1rem;", doc: "16px border radius." },
  { label: "rounded-3xl", detail: "border-radius: 1.5rem;", doc: "24px border radius." },
  { label: "rounded-full", detail: "border-radius: 9999px;", doc: "Pill/circle border radius." },
  { label: "border", detail: "border-width: 1px;", doc: "1px border." },
  { label: "border-0", detail: "border-width: 0px;", doc: "0px border." },
  { label: "border-2", detail: "border-width: 2px;", doc: "2px border." },
  { label: "border-t", detail: "border-top-width: 1px;", doc: "1px top border." },
  { label: "border-b", detail: "border-bottom-width: 1px;", doc: "1px bottom border." },
  { label: "border-l", detail: "border-left-width: 1px;", doc: "1px left border." },
  { label: "border-r", detail: "border-right-width: 1px;", doc: "1px right border." },
  { label: "border-white/10", detail: "border-color: rgba(255, 255, 255, 0.1);", kind: "Color" },
  { label: "border-white/20", detail: "border-color: rgba(255, 255, 255, 0.2);", kind: "Color" },
  { label: "border-zinc-800", detail: "border-color: #27272a;", kind: "Color" },
  { label: "border-zinc-700", detail: "border-color: #3f3f46;", kind: "Color" },
  { label: "border-violet-500/30", detail: "border-color: rgba(139, 92, 246, 0.3);", kind: "Color" },
  { label: "border-transparent", detail: "border-color: transparent;", kind: "Color" },
  { label: "divide-y", detail: "divide-y border;", doc: "Divide children with horizontal border." },
  { label: "divide-x", detail: "divide-x border;", doc: "Divide children with vertical border." },

  // Shadows & Effects
  { label: "shadow-sm", detail: "box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);", doc: "Small shadow." },
  { label: "shadow", detail: "box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);", doc: "Normal shadow." },
  { label: "shadow-md", detail: "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);", doc: "Medium shadow." },
  { label: "shadow-lg", detail: "box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);", doc: "Large shadow." },
  { label: "shadow-xl", detail: "box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);", doc: "Extra large shadow." },
  { label: "shadow-2xl", detail: "box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);", doc: "Deep 2XL shadow." },
  { label: "shadow-none", detail: "box-shadow: none;", doc: "Remove shadow." },
  { label: "opacity-0", detail: "opacity: 0;", doc: "0% opacity." },
  { label: "opacity-50", detail: "opacity: 0.5;", doc: "50% opacity." },
  { label: "opacity-75", detail: "opacity: 0.75;", doc: "75% opacity." },
  { label: "opacity-100", detail: "opacity: 1;", doc: "100% opacity." },
  { label: "backdrop-blur-sm", detail: "backdrop-filter: blur(4px);", doc: "4px backdrop blur." },
  { label: "backdrop-blur-md", detail: "backdrop-filter: blur(12px);", doc: "12px backdrop blur." },

  // Transitions & Animations
  { label: "transition", detail: "transition-property: color, background-color, ...;", doc: "Standard transition." },
  { label: "transition-all", detail: "transition-property: all;", doc: "Transition all properties." },
  { label: "transition-colors", detail: "transition-property: color, background-color;", doc: "Transition colors." },
  { label: "transition-transform", detail: "transition-property: transform;", doc: "Transition transform." },
  { label: "duration-150", detail: "transition-duration: 150ms;", doc: "150ms duration." },
  { label: "duration-200", detail: "transition-duration: 200ms;", doc: "200ms duration." },
  { label: "duration-300", detail: "transition-duration: 300ms;", doc: "300ms duration." },
  { label: "duration-500", detail: "transition-duration: 500ms;", doc: "500ms duration." },
  { label: "ease-in-out", detail: "transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);", doc: "Ease in out." },
  { label: "animate-spin", detail: "animation: spin 1s linear infinite;", doc: "Continuous spin animation." },
  { label: "animate-ping", detail: "animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;", doc: "Ping radar animation." },
  { label: "animate-pulse", detail: "animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;", doc: "Gentle pulse animation." },
  { label: "animate-bounce", detail: "animation: bounce 1s infinite;", doc: "Bounce animation." },

  // Positioning & Overflow
  { label: "relative", detail: "position: relative;", doc: "Relative position." },
  { label: "absolute", detail: "position: absolute;", doc: "Absolute position." },
  { label: "fixed", detail: "position: fixed;", doc: "Fixed position." },
  { label: "sticky", detail: "position: sticky;", doc: "Sticky position." },
  { label: "inset-0", detail: "inset: 0px;", doc: "top: 0; right: 0; bottom: 0; left: 0;" },
  { label: "top-0", detail: "top: 0px;", doc: "Top 0px." },
  { label: "bottom-0", detail: "bottom: 0px;", doc: "Bottom 0px." },
  { label: "left-0", detail: "left: 0px;", doc: "Left 0px." },
  { label: "right-0", detail: "right: 0px;", doc: "Right 0px." },
  { label: "z-0", detail: "z-index: 0;", doc: "Z-index 0." },
  { label: "z-10", detail: "z-index: 10;", doc: "Z-index 10." },
  { label: "z-20", detail: "z-index: 20;", doc: "Z-index 20." },
  { label: "z-50", detail: "z-index: 50;", doc: "Z-index 50." },
  { label: "overflow-hidden", detail: "overflow: hidden;", doc: "Clip overflow content." },
  { label: "overflow-auto", detail: "overflow: auto;", doc: "Auto scroll on overflow." },

  // Interactivity
  { label: "cursor-pointer", detail: "cursor: pointer;", doc: "Pointer (hand) cursor." },
  { label: "cursor-not-allowed", detail: "cursor: not-allowed;", doc: "Not-allowed cursor." },
  { label: "select-none", detail: "user-select: none;", doc: "Prevent text selection." },
  { label: "pointer-events-none", detail: "pointer-events: none;", doc: "Ignore pointer events." },
];

export const getTailwindClassSuggestions = (monaco, currentToken = "", range) => {
  const suggestions = [];

  // Check for variant prefixes: hover:, focus:, dark:, md:, etc.
  const variantMatch = currentToken.match(/^([a-z0-9-]+:)+/);
  const variantPrefix = variantMatch ? variantMatch[0] : "";

  const COMMON_VARIANTS = [
    { prefix: "hover:", desc: "Apply on hover state" },
    { prefix: "focus:", desc: "Apply on focus state" },
    { prefix: "active:", desc: "Apply on active state" },
    { prefix: "disabled:", desc: "Apply when disabled" },
    { prefix: "group-hover:", desc: "Apply on group hover" },
    { prefix: "dark:", desc: "Apply in dark mode" },
    { prefix: "sm:", desc: "Small screens (640px+)" },
    { prefix: "md:", desc: "Medium screens (768px+)" },
    { prefix: "lg:", desc: "Large screens (1024px+)" },
    { prefix: "xl:", desc: "Extra large screens (1280px+)" },
  ];

  if (!variantPrefix) {
    COMMON_VARIANTS.forEach((v) => {
      suggestions.push({
        label: v.prefix,
        kind: monaco.languages.CompletionItemKind.Keyword,
        detail: `Tailwind variant (${v.desc})`,
        documentation: `Tailwind CSS pseudo-class/media query prefix: ${v.prefix}`,
        insertText: v.prefix,
        range,
        sortText: "0" + v.prefix,
      });
    });
  }

  TAILWIND_UTILITY_CLASSES.forEach((cls) => {
    const fullLabel = variantPrefix ? `${variantPrefix}${cls.label}` : cls.label;
    const kind =
      cls.kind === "Color"
        ? monaco.languages.CompletionItemKind.Color
        : monaco.languages.CompletionItemKind.Property;

    suggestions.push({
      label: fullLabel,
      kind,
      detail: cls.detail || fullLabel,
      documentation: cls.doc || `Tailwind CSS: ${cls.detail}`,
      insertText: fullLabel,
      range,
      sortText: "1" + cls.label,
    });
  });

  return suggestions;
};

/* =========================================================
   CSS COMPLETION PROVIDER
========================================================= */

let cssProviderRegistered = false;

export const registerCSSCompletions = (monaco) => {
  if (cssProviderRegistered) return;
  cssProviderRegistered = true;

  monaco.languages.registerCompletionItemProvider("css", {
    triggerCharacters: [":", "@", " ", "-"],

    provideCompletionItems: (model, position) => {
      const line = model.getLineContent(position.lineNumber);
      const textBeforeCursor = line.substring(0, position.column - 1);
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      // 1. @apply autocompletion for Tailwind classes
      const applyMatch = /@apply\s+([^;]*)$/.exec(textBeforeCursor);
      if (applyMatch) {
        const classText = applyMatch[1] || "";
        const words = classText.split(/\s+/);
        const currentToken = words[words.length - 1] || "";
        const startCol = position.column - currentToken.length;
        const applyRange = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: startCol,
          endColumn: position.column,
        };
        const suggestions = getTailwindClassSuggestions(monaco, currentToken, applyRange);
        return { suggestions };
      }

      // 2. @ directives (Tailwind & CSS at-rules)
      if (textBeforeCursor.trim().startsWith("@") || textBeforeCursor.endsWith("@")) {
        const atDirectives = [
          {
            label: "@tailwind base;",
            detail: "Tailwind base styles",
            insertText: "@tailwind base;",
            kind: monaco.languages.CompletionItemKind.Keyword,
          },
          {
            label: "@tailwind components;",
            detail: "Tailwind component classes",
            insertText: "@tailwind components;",
            kind: monaco.languages.CompletionItemKind.Keyword,
          },
          {
            label: "@tailwind utilities;",
            detail: "Tailwind utility classes",
            insertText: "@tailwind utilities;",
            kind: monaco.languages.CompletionItemKind.Keyword,
          },
          {
            label: "@apply",
            detail: "Inline Tailwind utility classes into CSS",
            insertText: "@apply $0;",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            kind: monaco.languages.CompletionItemKind.Keyword,
          },
          {
            label: "@layer",
            detail: "Tailwind @layer directive (base, components, utilities)",
            insertText: "@layer ${1|utilities,components,base|} {\n\t$0\n}",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            kind: monaco.languages.CompletionItemKind.Keyword,
          },
        ];

        return {
          suggestions: atDirectives.map((d) => ({
            ...d,
            range,
          })),
        };
      }

      // Standard CSS properties
      const suggestions = CSS_PROPERTIES.map((prop) => ({
        label: prop.label,
        kind: monaco.languages.CompletionItemKind.Property,
        detail: prop.detail,
        insertText: prop.insertText,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      }));

      return { suggestions };
    },
  });
};

/* =========================================================
   EXTRACT COMPONENT & FUNCTION SYMBOLS FROM FILES
========================================================= */

export const extractWorkspaceSymbols = (projectFiles = []) => {
  const symbols = [];

  for (const file of projectFiles) {
    if (!file || !file.content) continue;
    const content = file.content;
    const path = file.path || file.name;

    // Match: export default function ComponentName
    const exportDefaultMatch = content.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
    if (exportDefaultMatch && exportDefaultMatch[1]) {
      symbols.push({
        name: exportDefaultMatch[1],
        type: "component",
        path,
        isDefault: true,
      });
    }

    // Match: export function name / export const name
    const namedFunctionMatches = content.matchAll(/export\s+(?:function|const|class)\s+([A-Za-z0-9_]+)/g);
    for (const match of namedFunctionMatches) {
      if (match[1] && (!exportDefaultMatch || match[1] !== exportDefaultMatch[1])) {
        const isComponent = /^[A-Z]/.test(match[1]);
        symbols.push({
          name: match[1],
          type: isComponent ? "component" : "function",
          path,
          isDefault: false,
        });
      }
    }
  }

  return symbols;
};

/* =========================================================
   SYNCHRONIZE INSTALLED DEPENDENCIES WITH MONACO
========================================================= */

let extraDependenciesLib = null;

export const syncDependenciesWithMonaco = (monaco, dependencies = {}) => {
  if (!monaco) return;

  if (extraDependenciesLib) {
    try {
      extraDependenciesLib.dispose();
    } catch {
      // ignore
    }
    extraDependenciesLib = null;
  }

  const pkgNames = Object.keys(dependencies || {}).filter(
    (pkg) => pkg !== "react" && pkg !== "react-dom"
  );

  if (pkgNames.length === 0) return;

  const decls = pkgNames
    .map(
      (pkg) => `
    declare module "${pkg}" {
      const content: any;
      export default content;
      export = content;
    }
  `
    )
    .join("\n");

  extraDependenciesLib = monaco.languages.typescript.javascriptDefaults.addExtraLib(
    decls,
    "file:///devpilot/dependencies.d.ts"
  );
};

/* =========================================================
   FRONTEND INTELLISENSE PROVIDER (FILES, METHODS, CLASSES, JSX, PACKAGES)
========================================================= */

export const registerFrontendCompletions = (
  monaco,
  getProjectFiles,
  getCurrentFilePath,
  getDependencies
) => {
  setupMonacoFrontend(monaco);
  registerCSSCompletions(monaco);

  return monaco.languages.registerCompletionItemProvider(
    ["javascript", "typescript"],
    {
      triggerCharacters: ["/", ".", '"', "'", "<", "@", " ", ":", "-"],

      provideCompletionItems: (model, position) => {
        const line = model.getLineContent(position.lineNumber);
        const textBeforeCursor = line.substring(0, position.column - 1);
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const projectFiles = getProjectFiles ? getProjectFiles() : [];
        const currentFilePath = getCurrentFilePath ? getCurrentFilePath() : "";
        const dependencies = getDependencies ? getDependencies() : {};

        /* -----------------------------------------------------
           1. FILE / IMPORT AUTOCOMPLETION
        ----------------------------------------------------- */
        const importMatch = textBeforeCursor.match(/(?:import\s+(?:.*?\s+from\s+)?|require\(\s*)["']([^"']*)$/);
        if (importMatch) {
          const importPath = importMatch[1] || "";
          const startCol = position.column - importPath.length;
          const importRange = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: startCol,
            endColumn: position.column,
          };

          const suggestions = [];

          // Case A: External package completions (not starting with . or /)
          if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
            // Suggest installed npm packages
            Object.entries(dependencies).forEach(([pkgName, pkgVersion]) => {
              suggestions.push({
                label: pkgName,
                kind: monaco.languages.CompletionItemKind.Module,
                detail: `npm package (${pkgVersion})`,
                documentation: `Installed npm dependency "${pkgName}" (${pkgVersion}) from package.json`,
                insertText: pkgName,
                range: importRange,
                sortText: "0" + pkgName,
              });
            });

            // If empty importPath (e.g. from "|), also allow typing relative imports
            if (importPath === "") {
              suggestions.push({
                label: "./",
                kind: monaco.languages.CompletionItemKind.Folder,
                detail: "Current directory",
                insertText: "./",
                range: importRange,
                sortText: "1./",
              });
              suggestions.push({
                label: "../",
                kind: monaco.languages.CompletionItemKind.Folder,
                detail: "Parent directory",
                insertText: "../",
                range: importRange,
                sortText: "1../",
              });
            }

            return { suggestions };
          }

          // Case B: Local relative file & folder completions
          const norm = (p) => (p.startsWith("/") ? p : `/${p}`).replace(/\\/g, "/");
          const getDir = (p) => {
            const n = norm(p);
            const idx = n.lastIndexOf("/");
            return idx <= 0 ? "/" : n.substring(0, idx);
          };

          const curDir = getDir(currentFilePath || "/src/App.jsx");

          // Helper to compute relative path from curDir to targetPath
          const getRel = (targetPath) => {
            const fromParts = curDir.split("/").filter(Boolean);
            const toParts = norm(targetPath).split("/").filter(Boolean);
            const file = toParts.pop();

            let common = 0;
            while (common < fromParts.length && common < toParts.length && fromParts[common] === toParts[common]) {
              common++;
            }

            const up = fromParts.length - common;
            const relParts = [];
            for (let i = 0; i < up; i++) relParts.push("..");
            relParts.push(...toParts.slice(common));
            relParts.push(file);

            let res = "./" + relParts.join("/");
            if (res.startsWith("./..")) res = res.substring(2);
            // Remove js/jsx/ts/tsx extension except css/json
            res = res.replace(/\.(jsx|js|tsx|ts)$/, "").replace(/\/index$/, "");
            return res;
          };

          // Suggest all project files
          projectFiles.forEach((file) => {
            if (!file || !file.path) return;
            const relPath = getRel(file.path);
            const fileName = file.name || file.path.split("/").pop();

            suggestions.push({
              label: fileName,
              kind: monaco.languages.CompletionItemKind.File,
              detail: file.path,
              documentation: `Import ${fileName} (${file.path})`,
              insertText: relPath,
              range: importRange,
              sortText: "0" + fileName,
            });
          });

          // Also suggest subfolders
          const folderSet = new Set();
          projectFiles.forEach((file) => {
            if (!file || !file.path) return;
            const parts = norm(file.path).split("/").filter(Boolean);
            parts.pop();
            for (let i = 1; i <= parts.length; i++) {
              folderSet.add("/" + parts.slice(0, i).join("/"));
            }
          });

          folderSet.forEach((folder) => {
            const folderName = folder.split("/").pop();
            const relFolder = getRel(folder + "/dummy").replace("/dummy", "");
            suggestions.push({
              label: folderName + "/",
              kind: monaco.languages.CompletionItemKind.Folder,
              detail: folder,
              insertText: relFolder.endsWith("/") ? relFolder : relFolder + "/",
              range: importRange,
              sortText: "1" + folderName,
            });
          });

          return { suggestions };
        }

        /* -----------------------------------------------------
           2. JSX / COMPONENT AUTOCOMPLETION (<Tag)
        ----------------------------------------------------- */
        const jsxMatch = textBeforeCursor.match(/<([A-Za-z0-9_]*)$/);
        if (jsxMatch) {
          const typedTag = jsxMatch[1] || "";
          const tagStartCol = position.column - typedTag.length;
          const tagRange = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: tagStartCol,
            endColumn: position.column,
          };

          const suggestions = [];

          // Suggest workspace components
          const symbols = extractWorkspaceSymbols(projectFiles);
          symbols
            .filter((sym) => sym.type === "component")
            .forEach((comp) => {
              suggestions.push({
                label: comp.name,
                kind: monaco.languages.CompletionItemKind.Class,
                detail: `Component from ${comp.path}`,
                documentation: `React component defined in ${comp.path}`,
                insertText: `${comp.name} $0/>`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: tagRange,
                sortText: "0" + comp.name,
              });
            });

          // Suggest standard HTML elements
          HTML_TAG_SNIPPETS.forEach((item) => {
            suggestions.push({
              label: item.label,
              kind: monaco.languages.CompletionItemKind.Property,
              detail: item.detail,
              insertText: item.snippet,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: tagRange,
              sortText: "1" + item.label,
            });
          });

          return { suggestions };
        }

        /* -----------------------------------------------------
           3. TAILWIND CSS AUTOCOMPLETION
           Triggered inside className="...", class="...", or clsx/cn/twMerge
        ----------------------------------------------------- */
        const classMatch =
          /(?:className|class)\s*=\s*["'`]([^"'`]*)$/.exec(textBeforeCursor) ||
          /(?:clsx|cn|twMerge|cva)\([^)]*?["'`]([^"'`]*)$/.exec(textBeforeCursor);

        if (classMatch) {
          const classText = classMatch[1] || "";
          const words = classText.split(/\s+/);
          const currentToken = words[words.length - 1] || "";
          const startCol = position.column - currentToken.length;
          const classRange = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: startCol,
            endColumn: position.column,
          };

          const suggestions = getTailwindClassSuggestions(
            monaco,
            currentToken,
            classRange
          );
          return { suggestions };
        }

        /* -----------------------------------------------------
           4. JSX ATTRIBUTES INSIDE TAGS
        ----------------------------------------------------- */
        const inTagMatch = /<[A-Za-z0-9_]+(?:\s+[^>]*?)?$/.test(textBeforeCursor);
        if (inTagMatch && !textBeforeCursor.endsWith(">")) {
          const suggestions = JSX_ATTRIBUTES.map((attr) => ({
            label: attr.label,
            kind: monaco.languages.CompletionItemKind.Field,
            detail: attr.detail,
            insertText: attr.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
            sortText: "0" + attr.label,
          }));
          return { suggestions };
        }

        /* -----------------------------------------------------
           4. REACT SNIPPETS & WORKSPACE SYMBOLS (GENERAL SCOPE)
        ----------------------------------------------------- */
        const generalSuggestions = [];

        // Add React snippets (useState, useEffect, etc.)
        REACT_SNIPPETS.forEach((snip) => {
          generalSuggestions.push({
            label: snip.label,
            kind: monaco.languages.CompletionItemKind.Snippet,
            detail: snip.detail,
            insertText: snip.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
            sortText: "0" + snip.label,
          });
        });

        // Add workspace exported symbols & components
        const symbols = extractWorkspaceSymbols(projectFiles);
        symbols.forEach((sym) => {
          generalSuggestions.push({
            label: sym.name,
            kind:
              sym.type === "component"
                ? monaco.languages.CompletionItemKind.Class
                : monaco.languages.CompletionItemKind.Function,
            detail: `(${sym.type}) ${sym.name} from ${sym.path}`,
            documentation: `Exported from ${sym.path}`,
            insertText: sym.name,
            range,
            sortText: "1" + sym.name,
          });
        });

        return { suggestions: generalSuggestions };
      },
    }
  );
};

/* =========================================================
   CODING PROBLEM LANGUAGES INTELLISENSE (Python, C++, Java, JS)
========================================================= */

/* ---------------------------------------------------------
   PYTHON INTELLISENSE
--------------------------------------------------------- */
const PYTHON_BUILTINS = [
  { label: "print", snippet: "print($0)", detail: "print(*objects, sep=' ', end='\\n')", doc: "Prints values to a stream or sys.stdout by default." },
  { label: "len", snippet: "len(${1:obj})", detail: "len(s) -> int", doc: "Return the number of items in a container." },
  { label: "range", snippet: "range(${1:stop})", detail: "range(start, stop[, step])", doc: "Return an object that produces a sequence of integers from start to stop by step." },
  { label: "enumerate", snippet: "enumerate(${1:iterable})", detail: "enumerate(iterable, start=0)", doc: "Return an enumerate object yielding (index, value) tuples." },
  { label: "zip", snippet: "zip(${1:iter1}, ${2:iter2})", detail: "zip(*iterables)", doc: "Aggregate elements from each of the iterables." },
  { label: "sorted", snippet: "sorted(${1:iterable}, key=${2:None}, reverse=${3:False})", detail: "sorted(iterable, /, *, key=None, reverse=False)", doc: "Return a new list containing all items from the iterable in ascending order." },
  { label: "min", snippet: "min(${1:a}, ${2:b})", detail: "min(iterable, *[, default=obj, key=func]) -> value", doc: "Return the smallest item in an iterable or between arguments." },
  { label: "max", snippet: "max(${1:a}, ${2:b})", detail: "max(iterable, *[, default=obj, key=func]) -> value", doc: "Return the largest item in an iterable or between arguments." },
  { label: "sum", snippet: "sum(${1:iterable})", detail: "sum(iterable, /, start=0) -> value", doc: "Return the sum of a 'start' value plus an iterable of numbers." },
  { label: "abs", snippet: "abs(${1:x})", detail: "abs(x) -> number", doc: "Return the absolute value of the argument." },
  { label: "map", snippet: "map(${1:func}, ${2:iterable})", detail: "map(func, *iterables) -> map object", doc: "Make an iterator that computes the function using arguments from each of the iterables." },
  { label: "filter", snippet: "filter(${1:function}, ${2:iterable})", detail: "filter(function, iterable) -> filter object", doc: "Return an iterator yielding those items of iterable for which function(item) is true." },
  { label: "any", snippet: "any(${1:iterable})", detail: "any(iterable) -> bool", doc: "Return True if bool(x) is True for any x in the iterable." },
  { label: "all", snippet: "all(${1:iterable})", detail: "all(iterable) -> bool", doc: "Return True if bool(x) is True for all values in the iterable." },
  { label: "isinstance", snippet: "isinstance(${1:obj}, ${2:class_or_tuple})", detail: "isinstance(object, classinfo) -> bool", doc: "Return whether an object is an instance of a class or of a subclass thereof." },
  { label: "int", snippet: "int(${1:x})", detail: "int(x=0) -> integer", doc: "Convert a number or string to an integer." },
  { label: "str", snippet: "str(${1:x})", detail: "str(object='') -> str", doc: "Create a new string object from the given object." },
  { label: "float", snippet: "float(${1:x})", detail: "float(x=0) -> floating point number", doc: "Convert a string or number to a floating point number." },
  { label: "bool", snippet: "bool(${1:x})", detail: "bool(x) -> bool", doc: "Returns True when the argument x is true, False otherwise." },
  { label: "list", snippet: "list(${1:iterable})", detail: "list(iterable) -> new list", doc: "Built-in mutable sequence." },
  { label: "dict", snippet: "dict()", detail: "dict() -> new empty dictionary", doc: "Built-in dictionary key-value mapping." },
  { label: "set", snippet: "set(${1:iterable})", detail: "set(iterable) -> new set", doc: "Built-in mutable unordered collection of unique elements." },
  { label: "tuple", snippet: "tuple(${1:iterable})", detail: "tuple(iterable) -> new tuple", doc: "Built-in immutable sequence." },
];

const PYTHON_METHODS = [
  // List methods
  { label: "append", snippet: "append(${1:item})", detail: "(method) list.append(object) -> None", doc: "Append object to the end of the list." },
  { label: "pop", snippet: "pop(${1:index})", detail: "(method) list/dict.pop() -> item", doc: "Remove and return item at index (default last)." },
  { label: "extend", snippet: "extend(${1:iterable})", detail: "(method) list.extend(iterable) -> None", doc: "Extend list by appending elements from the iterable." },
  { label: "insert", snippet: "insert(${1:index}, ${2:object})", detail: "(method) list.insert(index, object) -> None", doc: "Insert object before index." },
  { label: "remove", snippet: "remove(${1:value})", detail: "(method) list/set.remove(value) -> None", doc: "Remove first occurrence of value." },
  { label: "sort", snippet: "sort(key=${1:None}, reverse=${2:False})", detail: "(method) list.sort(*, key=None, reverse=False) -> None", doc: "Sort the list in ascending order and return None." },
  { label: "reverse", snippet: "reverse()", detail: "(method) list.reverse() -> None", doc: "Reverse *IN PLACE*." },
  { label: "count", snippet: "count(${1:value})", detail: "(method) count(value) -> int", doc: "Return number of occurrences of value." },
  { label: "index", snippet: "index(${1:value})", detail: "(method) index(value) -> int", doc: "Return first index of value." },

  // Dict methods
  { label: "get", snippet: "get(${1:key}, ${2:default})", detail: "(method) dict.get(key, default=None)", doc: "Return the value for key if key is in the dictionary, else default." },
  { label: "keys", snippet: "keys()", detail: "(method) dict.keys() -> dict_keys", doc: "Return a set-like object providing a view on D's keys." },
  { label: "values", snippet: "values()", detail: "(method) dict.values() -> dict_values", doc: "Return an object providing a view on D's values." },
  { label: "items", snippet: "items()", detail: "(method) dict.items() -> dict_items", doc: "Return a set-like object providing a view on D's items (key, value)." },
  { label: "update", snippet: "update(${1:dict})", detail: "(method) dict.update(other)", doc: "Update dictionary with key-value pairs from other." },
  { label: "setdefault", snippet: "setdefault(${1:key}, ${2:default})", detail: "(method) dict.setdefault(key, default=None)", doc: "Insert key with a value of default if key is not in the dictionary." },

  // Set methods
  { label: "add", snippet: "add(${1:element})", detail: "(method) set.add(element) -> None", doc: "Add an element to a set." },
  { label: "discard", snippet: "discard(${1:element})", detail: "(method) set.discard(element) -> None", doc: "Remove an element from a set if it is a member." },

  // String methods
  { label: "split", snippet: "split('${1: }')", detail: "(method) str.split(sep=None, maxsplit=-1) -> list[str]", doc: "Return a list of the substrings in the string, using sep as the delimiter string." },
  { label: "join", snippet: "join(${1:iterable})", detail: "(method) str.join(iterable) -> str", doc: "Concatenate any number of strings." },
  { label: "strip", snippet: "strip()", detail: "(method) str.strip([chars]) -> str", doc: "Return a copy of the string with leading and trailing whitespace removed." },
  { label: "replace", snippet: "replace('${1:old}', '${2:new}')", detail: "(method) str.replace(old, new[, count]) -> str", doc: "Return a copy with all occurrences of substring old replaced by new." },
  { label: "startswith", snippet: "startswith(${1:prefix})", detail: "(method) str.startswith(prefix) -> bool", doc: "Return True if S starts with the specified prefix, False otherwise." },
  { label: "endswith", snippet: "endswith(${1:suffix})", detail: "(method) str.endswith(suffix) -> bool", doc: "Return True if S ends with the specified suffix, False otherwise." },
  { label: "find", snippet: "find(${1:sub})", detail: "(method) str.find(sub[, start[, end]]) -> int", doc: "Return the lowest index in S where substring sub is found. Return -1 on failure." },
  { label: "lower", snippet: "lower()", detail: "(method) str.lower() -> str", doc: "Return a copy of the string converted to lowercase." },
  { label: "upper", snippet: "upper()", detail: "(method) str.upper() -> str", doc: "Return a copy of the string converted to uppercase." },
];

const PYTHON_MODULES = [
  { label: "collections.defaultdict", snippet: "collections.defaultdict(${1:list})", detail: "defaultdict(default_factory)", doc: "Returns a new dictionary-like object with default factory." },
  { label: "collections.Counter", snippet: "collections.Counter(${1:iterable})", detail: "Counter(iterable_or_mapping)", doc: "Dict subclass for counting hashable items." },
  { label: "collections.deque", snippet: "collections.deque()", detail: "deque([iterable[, maxlen]])", doc: "Double-ended queue with fast appends and pops on both sides." },
  { label: "heapq.heappush", snippet: "heapq.heappush(${1:heap}, ${2:item})", detail: "heappush(heap, item)", doc: "Push item onto heap, maintaining the heap invariant." },
  { label: "heapq.heappop", snippet: "heapq.heappop(${1:heap})", detail: "heappop(heap)", doc: "Pop and return the smallest item from the heap." },
  { label: "heapq.heapify", snippet: "heapq.heapify(${1:x})", detail: "heapify(x)", doc: "Transform list x into a heap, in-place, in O(len(x)) time." },
  { label: "bisect.bisect_left", snippet: "bisect.bisect_left(${1:a}, ${2:x})", detail: "bisect_left(a, x)", doc: "Locate the first insertion point for x in a to maintain sorted order." },
  { label: "bisect.bisect_right", snippet: "bisect.bisect_right(${1:a}, ${2:x})", detail: "bisect_right(a, x)", doc: "Locate the last insertion point for x in a to maintain sorted order." },
  { label: "math.sqrt", snippet: "math.sqrt(${1:x})", detail: "math.sqrt(x) -> float", doc: "Return the square root of x." },
  { label: "math.floor", snippet: "math.floor(${1:x})", detail: "math.floor(x) -> int", doc: "Return the floor of x as an Integral." },
  { label: "math.ceil", snippet: "math.ceil(${1:x})", detail: "math.ceil(x) -> int", doc: "Return the ceiling of x as an Integral." },
  { label: "math.gcd", snippet: "math.gcd(${1:a}, ${2:b})", detail: "math.gcd(*integers) -> int", doc: "Greatest Common Divisor." },
  { label: "math.inf", snippet: "float('inf')", detail: "float('inf')", doc: "Positive infinity representation." },
  { label: "sys.maxsize", snippet: "sys.maxsize", detail: "sys.maxsize", doc: "An integer giving the maximum value a variable of type Py_ssize_t can take." },
];

const PYTHON_SNIPPETS = [
  { label: "def function", snippet: "def ${1:function_name}(${2:args}):\n\t$0", detail: "Function definition" },
  { label: "class Solution", snippet: "class Solution:\n\tdef ${1:solve}(self, ${2:nums: list[int]}) -> ${3:int}:\n\t\t$0", detail: "LeetCode Solution class" },
  { label: "class ListNode", snippet: "class ListNode:\n\tdef __init__(self, val=0, next=None):\n\t\tself.val = val\n\t\tself.next = next", detail: "Singly-linked list node" },
  { label: "class TreeNode", snippet: "class TreeNode:\n\tdef __init__(self, val=0, left=None, right=None):\n\t\tself.val = val\n\t\tself.left = left\n\t\tself.right = right", detail: "Binary tree node" },
  { label: "for in range", snippet: "for ${1:i} in range(${2:n}):\n\t$0", detail: "For loop with range" },
  { label: "for enumerate", snippet: "for ${1:i}, ${2:val} in enumerate(${3:nums}):\n\t$0", detail: "For loop with enumerate" },
  { label: "if __name__ == '__main__'", snippet: "if __name__ == '__main__':\n\t$0", detail: "Main entry point check" },
];

/* ---------------------------------------------------------
   C++ INTELLISENSE
--------------------------------------------------------- */
const CPP_TYPES = [
  { label: "vector", snippet: "vector<${1:int}> ${2:v};", detail: "std::vector<T>", doc: "Sequence container representing arrays that can change in size." },
  { label: "string", snippet: "string ${1:s};", detail: "std::string", doc: "String of characters." },
  { label: "unordered_map", snippet: "unordered_map<${1:int}, ${2:int}> ${3:mp};", detail: "std::unordered_map<Key, Value>", doc: "Hash table associative container." },
  { label: "map", snippet: "map<${1:int}, ${2:int}> ${3:mp};", detail: "std::map<Key, Value>", doc: "Sorted associative container." },
  { label: "unordered_set", snippet: "unordered_set<${1:int}> ${2:st};", detail: "std::unordered_set<Key>", doc: "Hash table unique keys container." },
  { label: "set", snippet: "set<${1:int}> ${2:st};", detail: "std::set<Key>", doc: "Sorted unique keys container." },
  { label: "queue", snippet: "queue<${1:int}> ${2:q};", detail: "std::queue<T>", doc: "FIFO queue adapter." },
  { label: "deque", snippet: "deque<${1:int}> ${2:dq};", detail: "std::deque<T>", doc: "Double-ended queue." },
  { label: "stack", snippet: "stack<${1:int}> ${2:stk};", detail: "std::stack<T>", doc: "LIFO stack adapter." },
  { label: "priority_queue", snippet: "priority_queue<${1:int}> ${2:pq};", detail: "std::priority_queue<T>", doc: "Max heap priority queue." },
  { label: "priority_queue (min-heap)", snippet: "priority_queue<${1:int}, vector<${1:int}>, greater<${1:int}>> ${2:pq};", detail: "Min heap priority queue", doc: "Min heap using std::greater comparator." },
  { label: "pair", snippet: "pair<${1:int}, ${2:int}>", detail: "std::pair<T1, T2>", doc: "Pair of heterogeneous values." },
  { label: "ListNode", snippet: "ListNode* ${1:head} = nullptr;", detail: "ListNode*", doc: "LeetCode linked list node pointer." },
  { label: "TreeNode", snippet: "TreeNode* ${1:root} = nullptr;", detail: "TreeNode*", doc: "LeetCode binary tree node pointer." },
];

const CPP_METHODS = [
  { label: "push_back", snippet: "push_back(${1:val})", detail: "void push_back(const T& val)", doc: "Adds an element to the end." },
  { label: "pop_back", snippet: "pop_back()", detail: "void pop_back()", doc: "Erases the last element." },
  { label: "emplace_back", snippet: "emplace_back(${1:args})", detail: "template <class... Args> void emplace_back(Args&&... args)", doc: "Constructs element in-place at the end." },
  { label: "size", snippet: "size()", detail: "size_type size() const", doc: "Returns the number of elements." },
  { label: "empty", snippet: "empty()", detail: "bool empty() const", doc: "Checks whether the container is empty." },
  { label: "clear", snippet: "clear()", detail: "void clear()", doc: "Clears the contents." },
  { label: "begin", snippet: "begin()", detail: "iterator begin()", doc: "Returns an iterator to the beginning." },
  { label: "end", snippet: "end()", detail: "iterator end()", doc: "Returns an iterator to the end." },
  { label: "push", snippet: "push(${1:val})", detail: "void push(const value_type& val)", doc: "Inserts element into stack/queue." },
  { label: "pop", snippet: "pop()", detail: "void pop()", doc: "Removes top/front element from stack/queue." },
  { label: "top", snippet: "top()", detail: "const_reference top() const", doc: "Accesses the top element of stack/priority_queue." },
  { label: "front", snippet: "front()", detail: "reference front()", doc: "Accesses the first element of queue/deque/vector." },
  { label: "back", snippet: "back()", detail: "reference back()", doc: "Accesses the last element." },
  { label: "find", snippet: "find(${1:key})", detail: "iterator find(const Key& key)", doc: "Finds element with specific key." },
  { label: "insert", snippet: "insert(${1:val})", detail: "insert(val)", doc: "Inserts element into set/map." },
  { label: "erase", snippet: "erase(${1:it})", detail: "erase(position_or_key)", doc: "Erases elements." },
  { label: "count", snippet: "count(${1:key})", detail: "size_type count(const Key& key) const", doc: "Returns the number of elements matching specific key." },
  { label: "substr", snippet: "substr(${1:pos}, ${2:count})", detail: "string substr(size_t pos = 0, size_t count = npos) const", doc: "Returns a substring." },
  { label: "length", snippet: "length()", detail: "size_t length() const", doc: "Returns the length of the string." },
];

const CPP_ALGORITHMS = [
  { label: "sort", snippet: "sort(${1:v}.begin(), ${1:v}.end());", detail: "std::sort(first, last)", doc: "Sorts the elements in the range [first, last) in ascending order." },
  { label: "reverse", snippet: "reverse(${1:v}.begin(), ${1:v}.end());", detail: "std::reverse(first, last)", doc: "Reverses the order of the elements in the range." },
  { label: "max", snippet: "max(${1:a}, ${2:b})", detail: "std::max(a, b)", doc: "Returns the greater of the given values." },
  { label: "min", snippet: "min(${1:a}, ${2:b})", detail: "std::min(a, b)", doc: "Returns the smaller of the given values." },
  { label: "swap", snippet: "swap(${1:a}, ${2:b});", detail: "std::swap(a, b)", doc: "Exchanges the values of a and b." },
  { label: "accumulate", snippet: "accumulate(${1:v}.begin(), ${1:v}.end(), ${2:0})", detail: "std::accumulate(first, last, init)", doc: "Sums up the elements in the range." },
  { label: "binary_search", snippet: "binary_search(${1:v}.begin(), ${1:v}.end(), ${2:target})", detail: "std::binary_search(first, last, val)", doc: "Tests if value exists in sorted sequence." },
  { label: "lower_bound", snippet: "lower_bound(${1:v}.begin(), ${1:v}.end(), ${2:val})", detail: "std::lower_bound(first, last, val)", doc: "Returns an iterator to the first element not less than val." },
  { label: "upper_bound", snippet: "upper_bound(${1:v}.begin(), ${1:v}.end(), ${2:val})", detail: "std::upper_bound(first, last, val)", doc: "Returns an iterator to the first element greater than val." },
  { label: "cout", snippet: "cout << ${1:\"\"} << endl;", detail: "std::cout << val << std::endl", doc: "Standard output stream." },
  { label: "cin", snippet: "cin >> ${1:x};", detail: "std::cin >> var", doc: "Standard input stream." },
  { label: "INT_MAX", snippet: "INT_MAX", detail: "INT_MAX (2147483647)", doc: "Maximum value for a 32-bit signed integer." },
  { label: "INT_MIN", snippet: "INT_MIN", detail: "INT_MIN (-2147483648)", doc: "Minimum value for a 32-bit signed integer." },
];

const CPP_SNIPPETS = [
  { label: "for loop", snippet: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$0\n}", detail: "Indexed for loop" },
  { label: "for auto&", snippet: "for (auto& ${1:item} : ${2:container}) {\n\t$0\n}", detail: "Range-based for loop" },
  { label: "class Solution", snippet: "class Solution {\npublic:\n\t${1:int} ${2:solve}(${3:vector<int>& nums}) {\n\t\t$0\n\t}\n};", detail: "LeetCode Solution class" },
  { label: "struct ListNode", snippet: "struct ListNode {\n\tint val;\n\tListNode *next;\n\tListNode() : val(0), next(nullptr) {}\n\tListNode(int x) : val(x), next(nullptr) {}\n\tListNode(int x, ListNode *next) : val(x), next(next) {}\n};", detail: "Linked list node definition" },
  { label: "struct TreeNode", snippet: "struct TreeNode {\n\tint val;\n\tTreeNode *left;\n\tTreeNode *right;\n\tTreeNode() : val(0), left(nullptr), right(nullptr) {}\n\tTreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n\tTreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n};", detail: "Binary tree node definition" },
];

/* ---------------------------------------------------------
   JAVA INTELLISENSE
--------------------------------------------------------- */
const JAVA_CLASSES = [
  { label: "String", snippet: "String ${1:s} = \"$2\";", detail: "java.lang.String", doc: "Immutable sequence of characters." },
  { label: "StringBuilder", snippet: "StringBuilder ${1:sb} = new StringBuilder();", detail: "java.lang.StringBuilder", doc: "Mutable sequence of characters for efficient concatenation." },
  { label: "ArrayList", snippet: "List<${1:Integer}> ${2:list} = new ArrayList<>();", detail: "java.util.ArrayList<E>", doc: "Resizable-array implementation of the List interface." },
  { label: "HashMap", snippet: "Map<${1:Integer}, ${2:Integer}> ${3:map} = new HashMap<>();", detail: "java.util.HashMap<K, V>", doc: "Hash table based implementation of the Map interface." },
  { label: "HashSet", snippet: "Set<${1:Integer}> ${2:set} = new HashSet<>();", detail: "java.util.HashSet<E>", doc: "Set backed by a hash table." },
  { label: "PriorityQueue", snippet: "PriorityQueue<${1:Integer}> ${2:pq} = new PriorityQueue<>();", detail: "java.util.PriorityQueue<E>", doc: "An unbounded priority queue based on a priority heap." },
  { label: "LinkedList", snippet: "LinkedList<${1:Integer}> ${2:list} = new LinkedList<>();", detail: "java.util.LinkedList<E>", doc: "Doubly-linked list implementation." },
  { label: "ArrayDeque", snippet: "Deque<${1:Integer}> ${2:dq} = new ArrayDeque<>();", detail: "java.util.ArrayDeque<E>", doc: "Resizable-array implementation of the Deque interface." },
  { label: "Arrays", snippet: "Arrays", detail: "java.util.Arrays", doc: "Utility methods for manipulating arrays." },
  { label: "Collections", snippet: "Collections", detail: "java.util.Collections", doc: "Utility methods for collections." },
  { label: "Math", snippet: "Math", detail: "java.lang.Math", doc: "Mathematical functions and constants." },
  { label: "System.out.println", snippet: "System.out.println($0);", detail: "System.out.println()", doc: "Prints a message to standard output followed by newline." },
  { label: "Integer.MAX_VALUE", snippet: "Integer.MAX_VALUE", detail: "Integer.MAX_VALUE (2^31 - 1)", doc: "Constant holding the maximum value an int can have." },
  { label: "Integer.MIN_VALUE", snippet: "Integer.MIN_VALUE", detail: "Integer.MIN_VALUE (-2^31)", doc: "Constant holding the minimum value an int can have." },
];

const JAVA_METHODS = [
  // String methods
  { label: "length", snippet: "length()", detail: "int length()", doc: "Returns the length of this string." },
  { label: "charAt", snippet: "charAt(${1:index})", detail: "char charAt(int index)", doc: "Returns the char value at the specified index." },
  { label: "substring", snippet: "substring(${1:beginIndex}, ${2:endIndex})", detail: "String substring(int beginIndex, int endIndex)", doc: "Returns a substring." },
  { label: "equals", snippet: "equals(${1:other})", detail: "boolean equals(Object anObject)", doc: "Compares this string to the specified object." },
  { label: "toCharArray", snippet: "toCharArray()", detail: "char[] toCharArray()", doc: "Converts this string to a new character array." },
  { label: "indexOf", snippet: "indexOf(${1:str})", detail: "int indexOf(String str)", doc: "Returns the index within this string of the first occurrence." },
  { label: "toLowerCase", snippet: "toLowerCase()", detail: "String toLowerCase()", doc: "Converts all characters to lower case." },
  { label: "toUpperCase", snippet: "toUpperCase()", detail: "String toUpperCase()", doc: "Converts all characters to upper case." },
  { label: "trim", snippet: "trim()", detail: "String trim()", doc: "Removes leading and trailing whitespace." },

  // Collection methods
  { label: "add", snippet: "add(${1:element})", detail: "boolean add(E e)", doc: "Appends the specified element to this list/set." },
  { label: "get", snippet: "get(${1:index})", detail: "E get(int index) / V get(Object key)", doc: "Returns the element at the specified position/key." },
  { label: "set", snippet: "set(${1:index}, ${2:element})", detail: "E set(int index, E element)", doc: "Replaces the element at the specified position." },
  { label: "remove", snippet: "remove(${1:key_or_index})", detail: "remove(key_or_index)", doc: "Removes the element." },
  { label: "size", snippet: "size()", detail: "int size()", doc: "Returns the number of elements in this collection." },
  { label: "isEmpty", snippet: "isEmpty()", detail: "boolean isEmpty()", doc: "Returns true if this collection contains no elements." },
  { label: "contains", snippet: "contains(${1:obj})", detail: "boolean contains(Object o)", doc: "Returns true if this collection contains the specified element." },
  { label: "containsKey", snippet: "containsKey(${1:key})", detail: "boolean containsKey(Object key)", doc: "Returns true if this map contains a mapping for the specified key." },
  { label: "put", snippet: "put(${1:key}, ${2:value})", detail: "V put(K key, V value)", doc: "Associates the specified value with the specified key in this map." },
  { label: "getOrDefault", snippet: "getOrDefault(${1:key}, ${2:defaultValue})", detail: "V getOrDefault(Object key, V defaultValue)", doc: "Returns the value to which the specified key is mapped, or defaultValue." },
  { label: "keySet", snippet: "keySet()", detail: "Set<K> keySet()", doc: "Returns a Set view of the keys contained in this map." },
  { label: "values", snippet: "values()", detail: "Collection<V> values()", doc: "Returns a Collection view of the values contained in this map." },

  // Queue methods
  { label: "offer", snippet: "offer(${1:e})", detail: "boolean offer(E e)", doc: "Inserts the specified element into this queue." },
  { label: "poll", snippet: "poll()", detail: "E poll()", doc: "Retrieves and removes the head of this queue, or returns null if empty." },
  { label: "peek", snippet: "peek()", detail: "E peek()", doc: "Retrieves, but does not remove, the head of this queue." },

  // Math methods
  { label: "Math.max", snippet: "Math.max(${1:a}, ${2:b})", detail: "Math.max(a, b)", doc: "Returns the greater of two values." },
  { label: "Math.min", snippet: "Math.min(${1:a}, ${2:b})", detail: "Math.min(a, b)", doc: "Returns the smaller of two values." },
  { label: "Math.abs", snippet: "Math.abs(${1:a})", detail: "Math.abs(a)", doc: "Returns the absolute value." },
  { label: "Math.pow", snippet: "Math.pow(${1:a}, ${2:b})", detail: "Math.pow(double a, double b)", doc: "Returns the value of the first argument raised to the power of the second argument." },
  { label: "Math.sqrt", snippet: "Math.sqrt(${1:a})", detail: "Math.sqrt(double a)", doc: "Returns the correctly rounded positive square root." },
  { label: "Arrays.sort", snippet: "Arrays.sort(${1:arr});", detail: "Arrays.sort(a)", doc: "Sorts the specified array into ascending numerical order." },
  { label: "Arrays.fill", snippet: "Arrays.fill(${1:arr}, ${2:val});", detail: "Arrays.fill(a, val)", doc: "Assigns the specified value to each element of the array." },
  { label: "Collections.sort", snippet: "Collections.sort(${1:list});", detail: "Collections.sort(list)", doc: "Sorts the specified list into ascending order." },
];

const JAVA_SNIPPETS = [
  { label: "for loop", snippet: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$0\n}", detail: "Indexed for loop" },
  { label: "for each", snippet: "for (${1:int} ${2:num} : ${3:nums}) {\n\t$0\n}", detail: "Enhanced for loop" },
  { label: "class Solution", snippet: "class Solution {\n\tpublic ${1:int} ${2:solve}(${3:int[] nums}) {\n\t\t$0\n\t}\n}", detail: "LeetCode Solution class" },
  { label: "class ListNode", snippet: "public class ListNode {\n\tint val;\n\tListNode next;\n\tListNode() {}\n\tListNode(int val) { this.val = val; }\n\tListNode(int val, ListNode next) { this.val = val; this.next = next; }\n}", detail: "Linked list node definition" },
  { label: "class TreeNode", snippet: "public class TreeNode {\n\tint val;\n\tTreeNode left;\n\tTreeNode right;\n\tTreeNode() {}\n\tTreeNode(int val) { this.val = val; }\n\tTreeNode(int val, TreeNode left, TreeNode right) {\n\t\tthis.val = val;\n\t\tthis.left = left;\n\t\tthis.right = right;\n\t}\n}", detail: "Binary tree node definition" },
];

/* ---------------------------------------------------------
   REGISTER CODING LANGUAGES (Python, C++, Java, JS)
--------------------------------------------------------- */

let codingLanguagesRegistered = false;

export const setupCodingLanguages = (monaco) => {
  if (codingLanguagesRegistered) return;
  codingLanguagesRegistered = true;

  // 1. Python Completions
  monaco.languages.registerCompletionItemProvider("python", {
    triggerCharacters: [".", "(", " "],
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [];

      // Built-in functions
      PYTHON_BUILTINS.forEach((item) => {
        suggestions.push({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Function,
          detail: item.detail,
          documentation: item.doc,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: "0" + item.label,
        });
      });

      // Methods
      PYTHON_METHODS.forEach((item) => {
        suggestions.push({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Method,
          detail: item.detail,
          documentation: item.doc,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: "1" + item.label,
        });
      });

      // Modules
      PYTHON_MODULES.forEach((item) => {
        suggestions.push({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Module,
          detail: item.detail,
          documentation: item.doc,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: "2" + item.label,
        });
      });

      // Snippets
      PYTHON_SNIPPETS.forEach((item) => {
        suggestions.push({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          detail: item.detail,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: "3" + item.label,
        });
      });

      return { suggestions };
    },
  });

  // 2. C++ Completions
  monaco.languages.registerCompletionItemProvider("cpp", {
    triggerCharacters: [":", ".", ">", "<", "(", " "],
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [];

      CPP_TYPES.forEach((item) => {
        suggestions.push({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Class,
          detail: item.detail,
          documentation: item.doc,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: "0" + item.label,
        });
      });

      CPP_METHODS.forEach((item) => {
        suggestions.push({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Method,
          detail: item.detail,
          documentation: item.doc,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: "1" + item.label,
        });
      });

      CPP_ALGORITHMS.forEach((item) => {
        suggestions.push({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Function,
          detail: item.detail,
          documentation: item.doc,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: "2" + item.label,
        });
      });

      CPP_SNIPPETS.forEach((item) => {
        suggestions.push({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          detail: item.detail,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: "3" + item.label,
        });
      });

      return { suggestions };
    },
  });

  // 3. Java Completions
  monaco.languages.registerCompletionItemProvider("java", {
    triggerCharacters: [".", "(", " "],
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [];

      JAVA_CLASSES.forEach((item) => {
        suggestions.push({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Class,
          detail: item.detail,
          documentation: item.doc,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: "0" + item.label,
        });
      });

      JAVA_METHODS.forEach((item) => {
        suggestions.push({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Method,
          detail: item.detail,
          documentation: item.doc,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: "1" + item.label,
        });
      });

      JAVA_SNIPPETS.forEach((item) => {
        suggestions.push({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          detail: item.detail,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: "2" + item.label,
        });
      });

      return { suggestions };
    },
  });
};

