import { defineQuery } from "next-sanity";

const projectCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  location,
  status,
  description,
  completionYear,
  "topology": topology->{
    _id,
    title,
    "slug": slug.current
  },
  heroMedia{
    mediaType,
    image{asset, alt},
    video{
      url,
      title,
      thumbnail{asset, alt}
    }
  }
`;

export const WORK_PROJECTS_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current)]
  | order(_createdAt asc, title asc){
    ${projectCardFields}
  }
`);

export const WORK_PROJECT_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    ${projectCardFields},
    plans[]{
      _key,
      _type,
      asset,
      alt,
      url,
      title,
      thumbnail{asset, alt}
    },
    renders[]{
      _key,
      _type,
      asset,
      alt,
      url,
      title,
      thumbnail{asset, alt}
    },
    "media": coalesce(media, gallery, [])[]{
      _key,
      _type,
      asset,
      alt,
      url,
      title,
      thumbnail{asset, alt}
    }
  }
`);

export const WORK_PROJECT_METADATA_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    title,
    description
  }
`);

export const WORK_PROJECT_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current)]{
    "slug": slug.current
  }
`);
