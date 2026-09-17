import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { sanityDataset, sanityProjectId } from "@/sanity/env";

const imageBuilder = createImageUrlBuilder({
  dataset: sanityDataset,
  projectId: sanityProjectId,
});

export function getSanityImageUrl(
  source: SanityImageSource | null | undefined,
  width: number,
) {
  if (!source) {
    return null;
  }

  return imageBuilder
    .image(source)
    .width(width)
    .fit("max")
    .auto("format")
    .quality(90)
    .url();
}
