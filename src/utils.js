export function daysUntil(date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function subjectsProgress(subjects) {
  const allTopics = subjects.flatMap((s) => s.topics);
  const done = allTopics.filter((t) => t.done).length;
  const total = allTopics.length || 1;
  return { done, total, percent: Math.round((done / total) * 100) };
}
