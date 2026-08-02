/* Attach quizzes and drills to their lessons. */
Object.entries(QUIZ).forEach(([key, questions]) => {
  const [track, idx] = key.split(':');
  const lesson = COURSE[track] && COURSE[track].lessons[+idx];
  if (lesson) lesson.quiz = questions;
});
Object.entries(FILL).forEach(([key, drills]) => {
  const [track, idx] = key.split(':');
  const lesson = COURSE[track] && COURSE[track].lessons[+idx];
  if (lesson) lesson.fill = drills;
});


