const STORAGE_KEY = 'saved_experiences';

export const saveExperience = (experience) => {
  const saved = getSavedExperiences();
  
  // Check if already saved
  if (!saved.find(exp => exp.id === experience.id)) {
    saved.push(experience);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }
};

export const getSavedExperiences = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const removeSavedExperience = (experienceId) => {
  const saved = getSavedExperiences();
  const filtered = saved.filter(exp => exp.id !== experienceId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const clearSavedExperiences = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const isExperienceSaved = (experienceId) => {
  const saved = getSavedExperiences();
  return saved.some(exp => exp.id === experienceId);
};
