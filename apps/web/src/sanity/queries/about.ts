import { defineQuery } from "next-sanity";

export const ABOUT_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "aboutPage"][0] {
    "hero": {
      "mediaType": hero.mediaType,
      "imageUrl": hero.image.asset.asset->url,
      "imageAlt": hero.image.alt,
      "videoUrl": hero.video.url,
      "videoThumbnailUrl": hero.video.thumbnail.asset.asset->url,
      "videoTitle": hero.video.title
    },
    aboutTitle,
    "introduction": pt::text(introduction), 
    resources[] {
      title,
      "body": pt::text(body)
    },
    beliefs[] {
      title,
      "body": pt::text(body)
    },
    principles[] {
      "primaryMedia": {
        "mediaType": primaryMedia.mediaType,
        "imageUrl": primaryMedia.image.asset.asset->url,
        "imageAlt": primaryMedia.image.alt,
        "videoUrl": primaryMedia.video.url,
        "videoThumbnailUrl": primaryMedia.video.thumbnail.asset.asset->url,
        "videoTitle": primaryMedia.video.title
      },
      story {
        "media": {
          "mediaType": media.mediaType,
          "imageUrl": media.image.asset.asset->url,
          "imageAlt": media.image.alt,
          "videoUrl": media.video.url,
          "videoThumbnailUrl": media.video.thumbnail.asset.asset->url,
          "videoTitle": media.video.title
        },
        label,
        statement,
        description,
        link {
          label,
          href
        }
      }
    },
    callToAction {
      title,
      description,
      label,
      href,
      "backgroundUrl": backgroundMedia.image.asset.asset->url,
      "backgroundAlt": backgroundMedia.image.alt,
      "insetUrl": insetMedia.image.asset.asset->url,
      "insetAlt": insetMedia.image.alt
    }
  }
`);
