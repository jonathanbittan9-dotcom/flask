# 08_devops/Dockerfile
#
# Section 8: DevOps / Deployment — Containerization
#
# Packages the app + its exact dependencies into one portable image, so
# "works on my machine" stops being a real problem: dev, staging, and
# prod all run the identical environment.
#
# Build:  docker build -t rtl-app .
# Run:    docker run -p 5000:5000 --env-file .env rtl-app
#
# NEW (this whole file is new syntax — Dockerfile isn't Python, it's its
# own tiny language read top to bottom by `docker build`):
#   FROM     - the base image to start from (an existing OS + Python install)
#   RUN      - execute a shell command WHILE BUILDING the image (bakes the
#              result into the image, e.g. installing packages)
#   WORKDIR  - set the "current directory" for every instruction after it
#   COPY     - copy files from your machine into the image
#   ENV      - set an environment variable that exists INSIDE every
#              container started from this image
#   USER     - switch which user subsequent instructions (and the running
#              container) execute as
#   EXPOSE   - documentation: which port the container listens on (doesn't
#              actually open it — that's what `-p` on `docker run` does)
#   CMD      - the command that runs when a container STARTS (as opposed to
#              RUN, which only runs during the build)

FROM python:3.11-slim

# Don't run as root inside the container — least-privilege principle
RUN useradd --create-home appuser
WORKDIR /home/appuser/app

# Copy dependency list FIRST, install, THEN copy the rest of the code.
# Docker caches layers — this means `pip install` only reruns when
# requirements.txt actually changes, not on every code edit. Big rebuild
# time savings once the app has real dependencies.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chown -R appuser:appuser /home/appuser/app
USER appuser

# Never bake secrets into the image (no SECRET_KEY=... here) — they get
# injected at runtime via --env-file or the hosting platform's config.
ENV FLASK_APP=main.py
EXPOSE 5000

# Use a production WSGI server, not Flask's built-in dev server (app.run())
# NEW: CMD's ["array", "form"] runs the command directly (no shell involved),
# which is the recommended form — each element is one argument, exactly as
# if you'd typed: gunicorn --bind 0.0.0.0:5000 --workers 4 main:app
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "main:app"]
