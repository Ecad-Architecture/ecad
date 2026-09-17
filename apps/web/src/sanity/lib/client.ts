import "server-only";

import { createClient, type QueryParams } from "next-sanity";

import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/sanity/env";

const readToken = process.env.SANITY_API_READ_TOKEN;

export const sanityClient = createClient({
  apiVersion: sanityApiVersion,
  dataset: sanityDataset,
  perspective: "published",
  projectId: sanityProjectId,
  token: readToken,
  useCdn: true,
});

export function sanityFetch<TResult>({
  params = {},
  query,
  revalidate = 60,
  tags = [],
}: {
  params?: QueryParams;
  query: string;
  revalidate?: number | false;
  tags?: string[];
}) {
  return sanityClient.fetch<TResult>(query, params, {
    next: { revalidate, tags },
  });
}
