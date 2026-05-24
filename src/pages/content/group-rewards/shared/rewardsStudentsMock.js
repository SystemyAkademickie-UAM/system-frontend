const STUDENT_NAMES = [
  'Soren Valerius', 'Elena Vance', 'The Architect', 'Kaelen Sun',
  'Mira Blackwood', 'Dante Reyes', 'Luna Sterling', 'Atlas Knight',
  'Nova Chen', 'Zephyr Blake', 'Iris Thorne', 'Orion Fox',
  'Sage Rivera', 'Phoenix Ward', 'Jasper Cole', 'Aria Stone',
  'Leo Martinez', 'Ivy Cross', 'Felix Hart', 'Maya Frost',
  'Theo Nash', 'Stella Park', 'River Quinn', 'Jade Liu',
  'Miles Carter', 'Violet Hayes', 'Ash Morgan', 'Ruby Kim',
  'Quinn Taylor', 'Skye Brooks', 'Cleo James', 'Ezra West',
  'Piper Lane', 'Kai Nakamura', 'Willow Dean', 'Axel Storm',
  'Hazel Wright', 'Finn O\'Brien', 'Aurora Bell', 'Silas Reed',
  'Ember Shaw', 'Rowan Price', 'Lyra Webb', 'Atlas Vega',
  'Eden Moore',
];

/**
 * @param {string[]} badgeIds
 * @param {string[]} rankIds
 */
export function generateRewardsStudents(badgeIds, rankIds) {
  return STUDENT_NAMES.map((name, index) => {
    const earnedCount = Math.floor(Math.random() * Math.min(6, badgeIds.length));

    return {
      id: `student-${index + 1}`,
      name,
      earnedBadgeIds: badgeIds.slice(0, earnedCount).map((_, i) => (
        badgeIds[(index + i * 2) % badgeIds.length]
      )).filter((id, i, arr) => arr.indexOf(id) === i),
      rankId: rankIds.length > 0 ? rankIds[index % rankIds.length] : null,
    };
  });
}

export { STUDENT_NAMES };
