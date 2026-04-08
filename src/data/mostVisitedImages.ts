const mostVisitedImages: Record<string, any> = {
  'cristo-redentor': require('../../assets/most-visited/cristo-redentor.png'),
  'parque-lage': require('../../assets/most-visited/parque-lage.png'),
};

export function getMostVisitedImage(imageKey?: string) {
  if (imageKey && mostVisitedImages[imageKey]) {
    return mostVisitedImages[imageKey];
  }

  return require('../../assets/images/guide-hero.png');
}