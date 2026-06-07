export const countLessons = (sections = []) =>
  sections.reduce((total, section) => total + (section.items?.length || 0), 0)

export const getLessonKey = (sectionIndex, lectureIndex) => `${sectionIndex}:${lectureIndex}`

export const calculateProgress = (completedLessons = [], totalLessons = 0) => {
  if (!totalLessons) return 0
  return Math.round((completedLessons.length / totalLessons) * 100)
}
