import { defineQuery } from "next-sanity";

export const TEAM_MEMBERS_QUERY = defineQuery(/* groq */ `
  *[_type == "teamMember" && visibility == "visible"]
  | order(order asc) {
    _id,
    firstName,
    surname,
    membershipStatus,
    role,
    "portrait": portrait.asset.asset->url,
    "biography": pt::text(biography)
  }
`);

export const TEAM_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "teamPage"][0] {
    title,
    "heroUrl": hero.image.asset.asset->url,
    "heroAlt": hero.image.alt,
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
