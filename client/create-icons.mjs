import sharp from "sharp";

const source = "./public/malaria-icon.jpg";

await sharp(source)
  .resize(192, 192, {
    fit: "cover",
  })
  .png()
  .toFile("./public/pwa-192x192.png");

await sharp(source)
  .resize(512, 512, {
    fit: "cover",
  })
  .png()
  .toFile("./public/pwa-512x512.png");

console.log("PWA icons created successfully.");