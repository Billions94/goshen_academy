export function pictureRandomizer(count = 250, width = 40, height = 40) {
  const imageUrls: string[] = [];

  for (let i = 0; i < count; i++) {
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;

    imageUrls.push(imageUrl);
  }

  return imageUrls;
}
