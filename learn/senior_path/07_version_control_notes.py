"""
07_version_control_notes.py

Section 7: Version Control & Collaboration

Git isn't really something you "run" as a Python demo — it's a workflow.
This file is a runnable CHEAT SHEET: it prints the actual commands with
explanations, grouped by topic, so you have one place to look them up.

Directly relevant to this project: RecentTabList has 11 files named
main*.py (main_fixed.py, main_optimized.py, main_sqlite_backup.py, ...)
used as manual "backups" instead of git branches/commits. Everything in
this file is the alternative to that pattern.

Run: python 07_version_control_notes.py
"""


def section(title, body):
    print(f"\n--- {title} ---")
    print(body.strip("\n"))
    # New words in this line:
    #   .strip("\n")  -> strip() called WITH an argument removes only the
    #        characters you list (here, leading/trailing newlines), instead
    #        of the no-argument form, which strips all whitespace (spaces,
    #        tabs, newlines)


def demo_branching():
    section("Feature Branches (instead of main_fixed.py, main_optimized.py, ...)", """
# Instead of copying main.py to main_optimized.py to try something safely:

git checkout -b optimize-query-caching   # create + switch to a new branch
# ... make your changes to main.py directly ...
git add main.py
git commit -m "Cache leaderboard query for 5 minutes"
git push -u origin optimize-query-caching
# Open a PR. If it doesn't work out, delete the branch — main.py is untouched.
git checkout main
git branch -D optimize-query-caching     # discard the experiment entirely

# The killer feature: git never loses history. main_sqlite_backup2.py sitting
# in the repo forever is worse than a deleted branch, because deleted branches
# still exist in reflog/remote history if you ever need them back.
""")


def demo_rebase_vs_merge():
    section("Rebase vs. Merge", """
# MERGE: combines two branches, keeps both histories, adds a merge commit.
git checkout main
git merge feature-branch
#   main:    A---B---C-------M
#                    \\      /
#   feature:          D----E

# REBASE: replays your commits on top of main, rewriting history into a
# straight line. Cleaner log, but rewrites commit hashes — never rebase
# commits that have already been pushed and shared with others.
git checkout feature-branch
git rebase main
#   main:    A---B---C
#   feature:          \\D'---E'   (D and E replayed on top of C)

# Rule of thumb: rebase your own local, unpushed commits to keep history
# clean; merge when combining shared/team branches.
""")


def demo_conflicts():
    section("Resolving Conflicts", """
git merge feature-branch
# CONFLICT (content): Merge conflict in main.py
# Git marks the conflicting section in the file itself:
#
#   <<<<<<< HEAD
#   SECRET_KEY = os.environ.get('SECRET_KEY')
#   =======
#   SECRET_KEY = os.environ['SECRET_KEY']
#   >>>>>>> feature-branch
#
# Edit the file to keep the correct version, remove the <<<<<<< markers,
# then:
git add main.py
git commit    # completes the merge
""")


def demo_commit_messages():
    section("Good Commit Messages", """
# Bad (seen constantly in solo/early-career repos):
git commit -m "fix"
git commit -m "fix again"
git commit -m "asdf"

# Good: imperative mood, explains WHY not just WHAT, ~50 char summary line
git commit -m "Fix N+1 query in leaderboard route

Previously fetched each user's record count in a separate query inside
a loop. Batches them into a single aggregation instead, cutting the
route's DB round-trips from ~150 to 1 on a 150-user leaderboard."
""")


def demo_pr_and_review():
    section("Pull Requests & Code Review", """
# A PR description should answer three questions:
#   1. What does this change?
#   2. Why was it needed?
#   3. How was it tested?
#
# Giving review feedback — be specific and suggest, don't just criticize:
#   Bad:  "this is wrong"
#   Good: "This raises BookNotFoundError, but the route only catches
#          ValueError, so it'll 500 instead of returning a 404. Maybe
#          add `except BookNotFoundError` alongside it?"
#
# Receiving review feedback: treat it as catching bugs before users do,
# not as a personal judgment. The best senior engineers get the MOST
# review comments over their career, not the fewest — they just fix them fast.
""")


def demo_useful_commands():
    section("Useful Debugging Commands", """
git log --oneline --graph --all   # visualize branch history
git blame main.py                 # who last touched each line, and when
git bisect start                  # binary-search commit history for a bug
git reflog                        # recover "lost" commits/branches
git stash                         # shelve uncommitted changes temporarily
git diff --stat                   # quick summary of what changed, file by file
""")


if __name__ == "__main__":
    demo_branching()
    demo_rebase_vs_merge()
    demo_conflicts()
    demo_commit_messages()
    demo_pr_and_review()
    demo_useful_commands()
