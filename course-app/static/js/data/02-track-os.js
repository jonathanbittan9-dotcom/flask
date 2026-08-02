COURSE.os = {
  name: "Python os",
  side: "server",
  lessons: [

/* ── 01 ─────────────────────────────────────────────── */
{
  t: "What os actually is",
  sub: "The module that lets Python touch the machine it is running on — files, folders, environment, processes.",
  blocks: [
    ['p', "`os` is Python's doorway to the operating system. Anything outside the program itself — the filesystem, environment variables, other processes — goes through it. Your `hello.py` already uses three pieces of it."],
    ['code', 'python', `import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.join(BASE_DIR, "logs")

os.makedirs(LOG_DIR, exist_ok=True)
os.environ.get("WERKZEUG_RUN_MAIN")`],
    ['h', "Three namespaces, often confused"],
    ['tbl',
      ["Name", "What it is", "Typical use"],
      [
        ["`os`", "The OS interface itself", "`os.makedirs`, `os.listdir`, `os.remove`, `os.environ`"],
        ["`os.path`", "A **sub-module** for path *strings*", "`os.path.join`, `os.path.exists`, `os.path.dirname`"],
        ["`pathlib`", "A modern object-oriented replacement for `os.path`", "`Path(...) / \"logs\"`, `.exists()`, `.read_text()`"]
      ]
    ],
    ['note', "`os.path` manipulates strings and asks questions about the disk. `os` *changes* the disk. When a function creates, deletes or moves something, it lives on `os` — not `os.path`."],
    ['h', "Why it matters for Flask"],
    ['p', "Every non-trivial web app touches the OS: writing logs, reading configuration from the environment, saving uploads, locating templates. The two tracks are not separate subjects — your `logs/app.log` code is exactly where they meet."],
    ['h', "It is deliberately thin"],
    ['p', "`os` functions map almost one-to-one onto system calls. That is why the errors are blunt and specific rather than friendly:"],
    ['tbl',
      ["Exception", "Means"],
      [
        ["`FileNotFoundError`", "The path does not exist"],
        ["`FileExistsError`", "It exists and you asked to create it"],
        ["`PermissionError`", "The OS refused"],
        ["`NotADirectoryError` / `IsADirectoryError`", "Right path, wrong kind of thing"],
        ["`OSError`", "The parent class of all of the above"]
      ]
    ],
    ['warn', "Catching `OSError` catches all of them at once, which is usually too broad. Catch the specific one you expect, so an unexpected `PermissionError` is not silently swallowed by a handler you wrote for a missing file."]
  ],
  ex: [
    { q: "In a Python shell, run `import os; print(os.name)` and `import sys; print(sys.platform)`. What do you get on Windows?",
      a: "`os.name` is `'nt'` and `sys.platform` is `'win32'`. On Linux and macOS `os.name` is `'posix'`, while `sys.platform` is `'linux'` or `'darwin'` — so `sys.platform` is the more precise of the two when you need to branch." },
    { q: "Which of these three change something on disk? `os.path.join`, `os.makedirs`, `os.path.exists`.",
      hint: "Look at which namespace each lives in.",
      a: "Only `os.makedirs`. `os.path.join` builds a string and never touches the disk at all — it will happily join paths to things that do not exist. `os.path.exists` reads the disk but changes nothing." },
    { q: "Run `os.makedirs(\"testdir\")` twice in a row. What happens the second time, and which argument in your `hello.py` prevents it?",
      hint: "Look at the `exist_ok` argument.",
      a: "The second call raises `FileExistsError`. `os.makedirs(LOG_DIR, exist_ok=True)` suppresses exactly that error, which is why the `/about` route can call it on every single request without blowing up. Clean up with `os.rmdir(\"testdir\")`." },
    { q: "Predict which exception each of these raises: opening a file that does not exist for reading; `os.rmdir` on a folder that still has files in it.",
      a: "`FileNotFoundError` for the first. `OSError` for the second — on Windows the message is “The directory is not empty”. `os.rmdir` only removes empty directories; `shutil.rmtree` is the one that removes a folder and its contents." },
    { q: "Explain why `os.path` is written as a sub-module rather than being folded into `os` directly.",
      hint: "Think about what has to change between Windows and Linux.",
      a: "Path *syntax* differs by platform — backslashes and drive letters on Windows, forward slashes on POSIX — while the OS *operations* are largely the same. Python ships several implementations (`ntpath`, `posixpath`) and binds `os.path` to whichever matches the current system at import time. So `os.path.join` produces the right separator for the machine you are on without you asking." }
  ]
},

/* ── 02 ─────────────────────────────────────────────── */
{
  t: "Paths that do not break",
  sub: "Why `\"logs/app.log\"` is a bug waiting to happen, and what to write instead.",
  blocks: [
    ['p', "Hardcoding a path with slashes works on your machine until it does not: a different OS, a different working directory, a space in a folder name. `os.path` exists so you never have to think about separators again."],
    ['h', "`os.path.join` — build, never concatenate"],
    ['code', 'python', `import os

os.path.join("logs", "app.log")
# Windows -> 'logs\\\\app.log'
# Linux   -> 'logs/app.log'

os.path.join("C:\\\\Users\\\\jonat", "workspace", "flask")
# 'C:\\\\Users\\\\jonat\\\\workspace\\\\flask'`],
    ['p', "It inserts the correct separator for the current platform, and it does not double up if a piece already ends in one."],
    ['warn', "`join` has a sharp edge: if any argument is **absolute**, everything before it is discarded. `os.path.join(\"logs\", \"C:\\\\temp\")` returns `'C:\\\\temp'`. This is intentional, and it is how user input can escape a directory you meant to confine it to."],
    ['h', "Taking a path apart"],
    ['code', 'python', `p = "C:\\\\Users\\\\jonat\\\\workspace\\\\flask\\\\learn\\\\hello.py"

os.path.dirname(p)    # 'C:\\\\Users\\\\jonat\\\\workspace\\\\flask\\\\learn'
os.path.basename(p)   # 'hello.py'
os.path.split(p)      # (dirname, basename) in one call
os.path.splitext(p)   # ('C:\\\\...\\\\hello', '.py')`],
    ['h', "Absolute versus relative"],
    ['ul', [
      "**Absolute** — starts from the root: `C:\\\\Users\\\\...` or `/home/...`. Unambiguous everywhere.",
      "**Relative** — resolved against the **current working directory**, which is wherever the terminal happened to be when you launched Python. Not where your script lives.",
      "`os.path.abspath(p)` converts relative to absolute using the current working directory.",
      "`os.path.normpath(p)` cleans up `..` and doubled separators without touching the disk."
    ]],
    ['p', "That distinction is the whole reason for the `BASE_DIR` line at the top of your `hello.py` — the next lesson is entirely about it."],
    ['h', "Forward slashes on Windows"],
    ['p', "Windows accepts `/` in most APIs, so `open(\"logs/app.log\")` usually works. It is still worth using `join`: the moment you print a path, compare two paths, or hand one to another program, mixed separators cause real confusion."]
  ],
  ex: [
    { q: "Predict the output of `os.path.join(\"a\", \"b\", \"c.txt\")` on Windows, then run it.",
      a: "The string `a\\b\\c.txt`. Note that the REPL displays it as `'a\\\\b\\\\c.txt'` — that doubling is the escaped repr, not extra characters. `print()` it and you see the single backslashes." },
    { q: "Predict `os.path.join(\"logs\", \"/etc/passwd\")` before running it. Why is the result a security concern?",
      hint: "What does an absolute second argument do?",
      a: "It returns `'/etc/passwd'` — the `logs` prefix vanishes because the second argument is absolute. If a filename comes from a user and you join it onto an upload folder, they can escape that folder entirely. This is why real code validates with `secure_filename` and then re-checks that the resolved path is still inside the intended directory." },
    { q: "Given `p = \"reports/2026/summary.tar.gz\"`, get the folder, the filename, and the extension.",
      hint: "`splitext` splits at the **last** dot.",
      a: "Note that `splitext` gives `.gz`, not `.tar.gz` — it only ever splits one extension off the end.",
      code: ['python', `os.path.dirname(p)     # 'reports/2026'
os.path.basename(p)    # 'summary.tar.gz'
os.path.splitext(p)    # ('reports/2026/summary.tar', '.gz')`] },
    { q: "Run `os.path.abspath(\"app.log\")` from two different folders in PowerShell. Explain the two different results.",
      hint: "`abspath` resolves against the current working directory.",
      a: "You get a different absolute path each time, because `abspath` prefixes the *current working directory* — where your terminal is, not where your script is. This is precisely the failure mode that would put `app.log` in a random folder if `hello.py` used a bare relative path." },
    { q: "Write a one-liner that turns `\"notes.txt\"` into `\"notes.bak\"`, whatever folder the file is in.",
      hint: "Split the extension off, then reattach a different one.",
      a: "Keeping the directory part intact matters — `splitext` returns the full path minus the extension, so joining is unnecessary here.",
      code: ['python', `def backup_name(path):
    root, _ext = os.path.splitext(path)
    return root + ".bak"

backup_name("reports/2026/notes.txt")   # 'reports/2026/notes.bak'`] }
  ]
},

/* ── 03 ─────────────────────────────────────────────── */
{
  t: "__file__ and anchoring your app",
  sub: "The three-line pattern at the top of your `hello.py`, explained properly — and why it is not optional.",
  blocks: [
    ['p', "This is already in your file. By the end of this lesson you should be able to rebuild it from memory and explain why each layer is there:"],
    ['code', 'python', `BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.join(BASE_DIR, "logs")
LOG_FILE = os.path.join(LOG_DIR, "app.log")`],
    ['h', "The problem it solves"],
    ['p', "Relative paths resolve against the **current working directory** — the folder your terminal is sitting in — not against the script. So:"],
    ['code', 'shell', `# from learn/  -> writes learn/logs/app.log
python hello.py

# from the parent folder -> writes flask/logs/app.log (!)
python learn/hello.py`],
    ['p', "Same code, two different log files, depending on where you happened to be standing. With a web app that is a genuinely nasty bug: logs scatter, config goes missing, and it only shows up when someone launches the app a different way."],
    ['h', "Reading the pattern inside-out"],
    ['ul', [
      "`__file__` — a built-in name holding the path to the current source file. It may be relative, depending on how Python was invoked.",
      "`os.path.abspath(__file__)` — force it absolute, so the result no longer depends on the working directory.",
      "`os.path.dirname(...)` — strip `hello.py` off the end, leaving the folder the script lives in.",
      "`os.path.join(BASE_DIR, \"logs\")` — build every other path from that anchor."
    ]],
    ['note', "Compute `BASE_DIR` at **import time**, at the top of the module. If you compute it inside a function after something has called `os.chdir()`, you are back to the same class of bug."],
    ['h', "The Flask connection"],
    ['p', "`Flask(__name__)` does its own version of this: it uses the module name to find your package's folder, and that is how `templates/` and `static/` are located. Same idea, done for you."],
    ['h', "The pathlib equivalent"],
    ['code', 'python', `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
LOG_FILE = BASE_DIR / "logs" / "app.log"`],
    ['p', "`.resolve()` covers both `abspath` and symlink resolution; `.parent` replaces `dirname`; the `/` operator replaces `join`. Same pattern, less typing. The full pathlib lesson comes later in this track."]
  ],
  ex: [
    { q: "Add `print(__file__)` at the top of `hello.py` and run it two ways: `python hello.py` from `learn/`, and `python learn/hello.py` from the parent folder. Compare.",
      a: "The printed value differs between the two runs — it reflects the path you gave on the command line. That is exactly why `abspath` is wrapped around it before anything else uses it." },
    { q: "Temporarily change `LOG_FILE` to the bare string `\"logs/app.log\"`, then run the app from the parent directory. Where does the log file appear?",
      hint: "Relative to the terminal, not the script.",
      a: "A new `logs/` folder appears in the **parent** directory, not in `learn/`. Restore the `BASE_DIR` version afterwards — you have just reproduced the bug the pattern prevents." },
    { q: "What does `os.path.dirname(os.path.abspath(__file__))` return for your `hello.py`?",
      a: "The absolute path of the `learn` folder — `C:\\Users\\jonat\\OneDrive\\...\\workspace\\flask\\learn` on your machine. Note it is the folder, with no trailing separator and no filename." },
    { q: "Rewrite the three-line anchor block using `pathlib` instead of `os.path`, keeping the same variable names.",
      hint: "`Path` objects support `/` for joining.",
      a: "`open()`, `os.makedirs` and essentially every stdlib function that takes a path also accept a `Path`, so this is a drop-in replacement:",
      code: ['python', `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
LOG_DIR = BASE_DIR / "logs"
LOG_FILE = LOG_DIR / "app.log"`] },
    { q: "Why does `os.getcwd()` return something different from `BASE_DIR` when you run `python learn/hello.py` from the parent folder?",
      a: "`os.getcwd()` reports where the *terminal* is — the parent folder. `BASE_DIR` reports where the *script* is — `learn/`. They coincide only when you happen to launch from the script's own directory, which is why relying on `getcwd()` for app paths is fragile." }
  ]
},

/* ── 04 ─────────────────────────────────────────────── */
{
  t: "Environment variables",
  sub: "Configuration that lives outside your code — how `os.environ` works and why secrets belong there.",
  blocks: [
    ['p', "Every process starts with a dictionary of strings handed to it by whatever launched it. In Python that dictionary is `os.environ`. Your `hello.py` already reads one:"],
    ['code', 'python', `if os.environ.get("WERKZEUG_RUN_MAIN") != "true":
    # only the reloader's parent process gets here`],
    ['h', "Reading"],
    ['code', 'python', `os.environ["PATH"]                     # KeyError if missing
os.environ.get("PORT")                # None if missing
os.environ.get("PORT", "5000")        # default if missing
int(os.environ.get("PORT", "5000"))   # always convert explicitly`],
    ['warn', "Everything in `os.environ` is a **string**. There is no integer 5000 and no boolean `True` — `os.environ.get(\"DEBUG\") == \"true\"` is a comparison you have to write yourself. The string `\"False\"` is truthy in Python, which is a classic source of accidentally-enabled debug modes."],
    ['h', "Setting"],
    ['code', 'shell', `# PowerShell — this session only
$env:SECRET_KEY = "dev-only-key"
$env:FLASK_APP = "hello.py"
python hello.py

# Bash / macOS / Linux
export SECRET_KEY="dev-only-key"`],
    ['p', "Setting `os.environ[\"X\"] = \"1\"` from inside Python affects the current process and any child process it launches — it does not reach back into the shell that started you."],
    ['h', "Why secrets go here"],
    ['ul', [
      "Code goes into git; environment variables do not. A `SECRET_KEY` in a committed file is public the moment you push.",
      "The same code can run in dev, test and production with different values and no edits.",
      "Deployment platforms all provide a way to set them.",
      "Locally, `python-dotenv` reads a `.env` file into `os.environ` — and `.env` goes in `.gitignore`."
    ]],
    ['code', 'python', `import os

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set")

app.config["SECRET_KEY"] = SECRET_KEY`],
    ['note', "Failing loudly at startup beats defaulting to something insecure. A missing secret should stop the app, not quietly fall back to `\"dev\"`."]
  ],
  ex: [
    { q: "Print the number of environment variables your Python process has, and the first five names.",
      a: "You will typically see 30–60 on Windows, including `PATH`, `USERNAME` and `TEMP`.",
      code: ['python', `import os
print(len(os.environ))
print(list(os.environ)[:5])`] },
    { q: "Set `$env:GREETING = \"shalom\"` in PowerShell, then run a script that reads it. Now open a *new* PowerShell window and run the same script. Explain the difference.",
      hint: "How long does `$env:` last?",
      a: "The first run prints `shalom`; the new window prints the default, because `$env:` only affects that shell session and processes it launches. Persisting it requires `[Environment]::SetEnvironmentVariable(\"GREETING\", \"shalom\", \"User\")` or the System Properties dialog." },
    { q: "Add a route `/env` that returns the value of a `GREETING` variable, or “not set” when it is absent. Why should you never write a route that dumps all of `os.environ`?",
      a: "Because `os.environ` holds secrets — API keys, database passwords, `SECRET_KEY`. A route that prints it hands them to anyone who finds the URL. This has caused real breaches.",
      code: ['python', `@app.route("/env")
def env():
    return os.environ.get("GREETING", "not set")`] },
    { q: "Write a `read_bool(name, default=False)` helper that correctly turns `\"true\"`, `\"1\"`, `\"yes\"` and `\"on\"` into `True`, case-insensitively.",
      hint: "Remember that `bool(\"False\")` is `True`.",
      a: "The naive `bool(os.environ.get(\"DEBUG\"))` returns `True` for the string `\"False\"` — which is how debug mode ends up on in production.",
      code: ['python', `def read_bool(name, default=False):
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}`] },
    { q: "Your `hello.py` checks `os.environ.get(\"WERKZEUG_RUN_MAIN\") != \"true\"`. Who sets that variable, and what would break without the check?",
      hint: "Think about the reloader's two processes.",
      a: "Werkzeug's reloader sets it to `\"true\"` in the **child** process — the one that actually serves requests. The parent process, which only watches files, does not have it. Without the check, the startup log line would be written twice on every launch, once per process. Comparing against the string `\"true\"` rather than a boolean is required, because environment values are always strings." }
  ]
},

/* ── 05 ─────────────────────────────────────────────── */
{
  t: "Listing a directory",
  sub: "`listdir`, `scandir` and `glob` — seeing what is actually on disk.",
  blocks: [
    ['p', "Three ways to ask “what is in this folder?”, each better than the last for a different job."],
    ['h', "`os.listdir` — names only"],
    ['code', 'python', `import os

os.listdir(".")
# ['hello.py', 'logs', 'templates', 'server_out.log']`],
    ['p', "Returns a flat list of **names**, not paths. To do anything with an entry you must join it back onto the folder yourself — forgetting this is the single most common `os` mistake."],
    ['code', 'python', `folder = "logs"
for name in os.listdir(folder):
    full = os.path.join(folder, name)     # <- required
    print(name, os.path.getsize(full))`],
    ['h', "`os.scandir` — names plus metadata, faster"],
    ['p', "Each entry already knows whether it is a file or a directory, without a second trip to disk. For large folders this is dramatically quicker:"],
    ['code', 'python', `with os.scandir(".") as entries:
    for e in entries:
        kind = "dir " if e.is_dir() else "file"
        print(kind, e.name, e.path)`],
    ['note', "Use `scandir` in a `with` block — it holds an open OS handle. `listdir` does not, which is why it is fine for quick one-liners."],
    ['h', "`glob` — filter by pattern"],
    ['code', 'python', `import glob

glob.glob("*.py")                     # ['hello.py']
glob.glob("templates/*.html")         # ['templates/home.html']
glob.glob("**/*.log", recursive=True) # every .log at any depth`],
    ['p', "`glob` returns **paths**, not bare names, which makes it the least error-prone of the three. `*` matches within one path segment; `**` with `recursive=True` matches across segments."],
    ['h', "Choosing"],
    ['tbl',
      ["Use", "When"],
      [
        ["`os.listdir`", "You want every name in one folder and nothing more"],
        ["`os.scandir`", "You need file/dir type or size, or the folder is large"],
        ["`glob.glob`", "You want to match a pattern, and you want real paths back"],
        ["`os.walk`", "You need to descend into subfolders — lesson 08"]
      ]
    ]
  ],
  ex: [
    { q: "List every entry in your `learn` folder, marking directories with a trailing slash.",
      a: "`os.path.isdir` needs the joined path — passing the bare name only works when the current working directory happens to be that folder.",
      code: ['python', `import os

for name in sorted(os.listdir(".")):
    print(name + ("/" if os.path.isdir(name) else ""))`] },
    { q: "Print the size in bytes of every `.log` file under your project, at any depth.",
      hint: "`glob` with `recursive=True` returns usable paths.",
      a: "This finds both `server_out.log` and `logs/app.log`.",
      code: ['python', `import glob, os

for path in glob.glob("**/*.log", recursive=True):
    print(path, os.path.getsize(path), "bytes")`] },
    { q: "Why does `os.path.getsize(name)` fail inside a `for name in os.listdir(\"logs\")` loop?",
      hint: "What exactly is in `name`?",
      a: "`listdir` yields bare names like `'app.log'`, but `getsize` needs a path Python can actually find. Unless your working directory is already `logs/`, it raises `FileNotFoundError`. Fix it with `os.path.join(\"logs\", name)`." },
    { q: "Rewrite the size listing using `os.scandir` so it makes no extra `stat` calls, and skips directories.",
      hint: "`DirEntry` objects carry a `.stat()` and an `.is_file()`.",
      a: "`e.stat()` on Windows uses information the OS already returned during the scan, so this avoids a second disk round-trip per entry.",
      code: ['python', `import os

with os.scandir(".") as entries:
    for e in entries:
        if e.is_file():
            print(e.name, e.stat().st_size)`] },
    { q: "Write a `newest(folder)` function returning the most recently modified file in a folder, or `None` if it is empty.",
      hint: "`os.path.getmtime` returns a number you can sort by.",
      a: "`max` with a `key` avoids sorting the whole list. The `default=None` argument handles the empty folder without a separate check.",
      code: ['python', `import os

def newest(folder):
    paths = [os.path.join(folder, n) for n in os.listdir(folder)]
    files = [p for p in paths if os.path.isfile(p)]
    return max(files, key=os.path.getmtime, default=None)`] }
  ]
},

/* ── planned ─────────────────────────────────────────── */
{ t: "Creating and deleting", sub: "`makedirs`, `remove`, `rmdir`, `shutil.rmtree` — and doing it idempotently.",
  plan: "Everything that changes the shape of the filesystem, plus the habits that stop a cleanup script from deleting the wrong thing.",
  covers: ["`os.mkdir` vs `os.makedirs` and `exist_ok`", "`os.remove` vs `os.rmdir` vs `shutil.rmtree`", "Idempotent operations you can run twice safely", "`missing_ok=True` on `Path.unlink`", "Dry-run flags before destructive scripts"] },

{ t: "Checking what exists", sub: "`exists`, `isfile`, `isdir`, `stat` — and the race condition hiding in all of them.",
  plan: "Reading metadata: size, timestamps, permissions. Plus why “check then act” is unreliable and what to do instead.",
  covers: ["`os.path.exists/isfile/isdir/islink`", "`os.stat` and the `st_*` fields", "Timestamps: mtime, atime, ctime", "EAFP vs LBYL — try/except over pre-checks", "TOCTOU race conditions in file code"] },

{ t: "Walking a whole tree", sub: "`os.walk` — visiting every file in every subfolder.",
  plan: "The generator that powers most real file scripts, including how to prune folders you do not want to descend into.",
  covers: ["The `(dirpath, dirnames, filenames)` tuple", "Mutating `dirnames` in place to skip folders", "Top-down vs bottom-up walks", "Counting, searching and summing across a tree", "`Path.rglob` as the pathlib equivalent"] },

{ t: "Moving, renaming, copying", sub: "`os.rename`, `os.replace`, and where `shutil` takes over.",
  plan: "The difference between rename and replace, why moving across drives fails, and the copy functions that actually preserve metadata.",
  covers: ["`os.rename` vs `os.replace` on existing targets", "Cross-device moves and `shutil.move`", "`shutil.copy` vs `copy2` vs `copytree`", "Atomic rename as a safe-write technique", "Windows file-locking surprises"] },

{ t: "The current working directory", sub: "`getcwd`, `chdir`, and why changing it is usually a mistake.",
  plan: "What the CWD really is, how it affects every relative path, and safer alternatives to `os.chdir` in long-running programs.",
  covers: ["`os.getcwd()` and who sets it", "`os.chdir()` and its global blast radius", "Why a web app should never chdir", "`contextlib.chdir` for scoped changes", "Passing explicit paths instead"] },

{ t: "Running other programs", sub: "`subprocess` done properly — and why `os.system` is not the answer.",
  plan: "Launching external commands, capturing their output, checking exit codes, and avoiding shell injection.",
  covers: ["`subprocess.run` with a list, not a string", "`capture_output`, `text`, `check`", "Exit codes and `CalledProcessError`", "Why `shell=True` is dangerous", "`os.system` and when it is acceptable (rarely)"] },

{ t: "Safe writes and temp files", sub: "Not corrupting a file when the program dies halfway through writing it.",
  plan: "The write-temp-then-rename pattern, the `tempfile` module, and file locking basics.",
  covers: ["Why a partial write is worse than no write", "`tempfile.NamedTemporaryFile` and `mkstemp`", "Atomic replace with `os.replace`", "Encoding: always pass `encoding='utf-8'`", "Append mode and concurrent writers"] },

{ t: "pathlib: the modern replacement", sub: "The object-oriented API that makes most `os.path` code shorter and clearer.",
  plan: "A full pass over `Path`, translating every `os.path` idiom you have learned into its pathlib equivalent — and noting the few places `os` is still required.",
  covers: ["`Path` construction and the `/` operator", "`.parent`, `.name`, `.stem`, `.suffix`", "`.exists()`, `.mkdir(parents=True, exist_ok=True)`", "`.read_text()` / `.write_text()`", "`.glob()` and `.rglob()`", "When you still need `os` and `shutil`"] },

{ t: "Project: a file organiser", sub: "Everything on this track, assembled into a script you would actually run.",
  plan: "Build a tool that scans a messy folder, sorts files into subfolders by extension and date, logs every action, and supports a `--dry-run` flag. This is the capstone.",
  covers: ["Walking a tree and classifying entries", "Planning moves before performing any", "Dry-run mode and confirmation prompts", "Structured logging of every action", "Handling collisions and read-only files", "Wrapping it in an `argparse` CLI"] }

  ]
};

