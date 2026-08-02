/* ═══════════════════════════════════════════════════════════
   PLACEMENT
   Derived from reading the learner's own repository — hello.py,
   os.txt, templates/, flask-project/main.py, app.py and the git
   history. "known" is pre-completed; "review" stays in the path
   but is flagged as probably-familiar. Evidence is shown in the
   UI so the judgement can be checked and overridden.
   ═══════════════════════════════════════════════════════════ */
const PLACEMENT = {
  "flask:0": { level: 'known',  why: "You have been starting and stopping the dev server and reading its status lines all along — flask-project/main.py, app.py and hello.py." },
  "flask:1": { level: 'known',  why: "hello.py has Flask(__name__), the route decorator and the __main__ guard, and you added the WERKZEUG_RUN_MAIN check on top." },
  "flask:2": { level: 'review', why: "You write routes fluently, but url_for and the trailing-slash rule only appear in app.py, which reads as supplied rather than written by you." },
  "flask:3": { level: 'known',  why: "You wrote /greet/<name>, /add/<int:number>/<int:number2> and /profile/<name>/<int:age>, and hit converter precedence yourself with /user/<name> vs /user/<int:age>." },
  "flask:4": { level: 'known',  why: "You wrote /search with request.args.get(\"q\", \"nothing\") this week." },
  "flask:5": { level: 'known',  why: "home.html, favorites.html and profile.html all pass variables in and loop over them with {% for %} and {% if %}." },
  "flask:9": { level: 'review', why: "app.py handles POST forms and request.form, but that file looks tutorial-supplied — worth confirming you could write it yourself." },
  "flask:10":{ level: 'review', why: "Same source: redirect, url_for and flash all appear in app.py's add/toggle/delete routes." },
  "flask:11":{ level: 'review', why: "app.py has a full session login with secret_key and a @wraps decorator — powerful stuff to have seen, worth cementing." },
  "flask:12":{ level: 'review', why: "app.py registers @app.errorhandler(404) and calls abort(404)." },

  "os:0": { level: 'known',  why: "os.txt opens with exactly the right idea: os finds the path and makes the folder, plain file operations do the writing." },
  "os:1": { level: 'known',  why: "Your notes explain os.path.join and the Windows-vs-POSIX separator problem better than most tutorials do." },
  "os:2": { level: 'known',  why: "hello.py anchors BASE_DIR with os.path.dirname(os.path.abspath(__file__)) and builds every path from it." },
  "os:3": { level: 'review', why: "You read one environment variable (WERKZEUG_RUN_MAIN) but have not used os.environ for configuration or secrets yet." }
};


