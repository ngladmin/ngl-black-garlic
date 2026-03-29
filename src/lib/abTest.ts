export type ABGroup = 'A' | 'B';

export const getABGroup = (): ABGroup => {
  const storedGroup = localStorage.getItem('ab_group');
  if (storedGroup) return storedGroup as ABGroup;

  const newGroup: ABGroup = Math.random() < 0.5 ? 'A' : 'B';
  localStorage.setItem('ab_group', newGroup);
  return newGroup;
};
