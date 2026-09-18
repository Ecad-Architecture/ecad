import "server-only";

import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/client";
import { TEAM_MEMBERS_QUERY, TEAM_PAGE_QUERY } from "@/sanity/queries/team";

export interface SanityTeamMemberRecord {
  _id: string;
  firstName?: string | null;
  surname?: string | null;
  membershipStatus?: "current" | "former" | string | null;
  role?: string | null;
  portrait?: string | null;
  biography?: string | null;
  startYear?: number | null;
  endYear?: number | null;
}

export interface CurrentTeamMember {
  _id: string;
  firstName: string;
  surname: string;
  role: string;
  portraitUrl: string;
  biography: string;
}

export interface FormerTeamMember {
  _id: string;
  firstName: string;
  surname: string;
  startYear?: number;
  endYear?: number;
}

export const getTeamMembers = cache(async () => {
  const members = await sanityFetch<SanityTeamMemberRecord[]>({
    query: TEAM_MEMBERS_QUERY,
    tags: ["teamMember"],
  });

  const currentMembers: CurrentTeamMember[] = [];
  const formerMembers: FormerTeamMember[] = [];

  for (const member of members) {
    if (member.membershipStatus === "former") {
      formerMembers.push({
        _id: member._id,
        firstName: member.firstName?.trim() || "",
        surname: member.surname?.trim() || "",
        startYear: member.startYear || undefined,
        endYear: member.endYear || undefined,
      });
    } else {
      currentMembers.push({
        _id: member._id,
        firstName: member.firstName?.trim() || "",
        surname: member.surname?.trim() || "",
        role: member.role?.trim() || "",
        portraitUrl: member.portrait || "",
        biography: member.biography?.trim() || "",
      });
    }
  }

  return { currentMembers, formerMembers };
});

export interface TeamPageData {
  title?: string | null;
  heroUrl?: string | null;
  heroAlt?: string | null;
  callToAction?: {
    title?: string | null;
    description?: string | null;
    label?: string | null;
    href?: string | null;
    backgroundUrl?: string | null;
    backgroundAlt?: string | null;
    insetUrl?: string | null;
    insetAlt?: string | null;
  } | null;
}

export const getTeamPageData = cache(async () => {
  const data = await sanityFetch<TeamPageData>({
    query: TEAM_PAGE_QUERY,
    tags: ["teamPage"],
  });
  return data;
});
