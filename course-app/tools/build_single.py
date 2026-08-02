"""
Bundle the project back into one self-contained HTML file.

    python tools/build_single.py

Writes dist/course.html — no server, no internet, just double-click it.
Useful for sharing, or for working offline. The Python playground needs the
server, so in the single file that tab is editor-only; everything else works.

WHY THE </script> CHECK MATTERS
    A browser ends a <script> element at the first literal </script> it sees,
    even inside a JavaScript string. An unmatched <!-- does something equally
    nasty: it flips the parser into "escaped" state, where the real closing
    tag stops working and the script runs to end-of-file as a syntax error.
    Either one silently kills the whole page. Lesson content here talks about
    script tags and HTML comments, so both sequences appear in the source and
    must stay written as <\\/script> and <\\!--. This script refuses to write
    a bundle where that has gone wrong.
"""

import os
import re
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC = os.path.join(BASE_DIR, "static")
DIST = os.path.join(BASE_DIR, "dist")

CSS_ORDER = ["reset.css", "course.css"]


def read(*parts):
    with open(os.path.join(*parts), encoding="utf-8") as handle:
        return handle.read()


def js_files():
    """Data files in numeric order, then the engine."""
    data_dir = os.path.join(STATIC, "js", "data")
    names = sorted(n for n in os.listdir(data_dir) if n.endswith(".js"))
    paths = [os.path.join(data_dir, n) for n in names]
    paths.append(os.path.join(STATIC, "js", "engine.js"))
    return paths


def page_markup():
    """Everything between <body> and the first <script> in the template."""
    html = read(BASE_DIR, "templates", "index.html")
    body = html.split("<body>", 1)[1]
    return body.split("<script", 1)[0].strip()


def build():
    css = "\n".join(read(STATIC, "css", name) for name in CSS_ORDER)
    js = "\n".join(read(path) for path in js_files())
    title_match = re.search(r"<title>([\s\S]*?)</title>", read(BASE_DIR, "templates", "index.html"))
    title = title_match.group(1) if title_match else "Four Tracks to Mastery"

    page = (
        "<!doctype html>\n<html lang=\"en\">\n<head>\n"
        "<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
        "<meta name=\"color-scheme\" content=\"light dark\">\n"
        "<title>" + title + "</title>\n"
        "<style>\n" + css + "\n</style>\n"
        "</head>\n<body>\n\n" + page_markup() + "\n\n"
        "<script>\n" + js + "\n</script>\n"
        "</body>\n</html>\n"
    )

    closers = page.count("</script>")
    if closers != 1:
        sys.exit(
            "REFUSING TO WRITE: found %d literal </script> in the bundle, expected 1.\n"
            "Somewhere in the source a closing tag is written literally instead of\n"
            "as <\\/script>. Find it and escape it." % closers
        )

    if not page.rstrip().endswith("</html>"):
        sys.exit("REFUSING TO WRITE: the bundle does not end with </html>.")

    os.makedirs(DIST, exist_ok=True)
    out = os.path.join(DIST, "course.html")
    with open(out, "w", encoding="utf-8") as handle:
        handle.write(page)

    print("wrote %s" % out)
    print("  %s characters" % format(len(page), ","))
    print("  %d css files, %d js files" % (len(CSS_ORDER), len(js_files())))


if __name__ == "__main__":
    build()
