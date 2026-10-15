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
  isHighlighted: boolean;
  title?: string;
}

const formerMemberNames = [
  ["Ade", "Laoye", true, "Managing Partner"],
  ["Wole", "Goyea", true, "International Consultant"],
  ["Ade", "Obasa", false],
  ["Muyiwa", "Joshua", false],
  ["Kunle", "Oke", false],
  ["Christy", "Chinwe", true],
  ["Ronke", "Salami", false],
  ["Bola", "Ladokun", false],
  ["Kayode", "Bamisile", false],
  ["Abiodun", "Akanni", false, "Partner"],
  ["Funmi", "Fajolu", false],
  ["Bidemi", "Olawoyin", false],
  ["Ayo", "Ajayi", false],
  ["Teni", "Shodipe", false],
  ["Damilola", "Adekoya", false],
  ["Funke", "Akintemi", false, "Associate"],
  ["Jide", "Onanuga", false],
  ["Vivian", "Onuoha", false],
  ["Peter", "Olayori", true],
  ["Efiok", "Ekwere", true],
  ["Bukola", "Ogunnaya", false, "Accountant"],
  ["Dimeji", "Williams", false],
  ["Claude", "Opara", false],
  ["Segun", "Oluwaleti", false],
  ["Ronke", "Opoola", false],
  ["Azuka", "Opute", false, "Associate"],
  ["Olaniyi", "Gbolahan", false],
  ["Fisade", "Akinyemi", false],
  ["Rotimi", "Ajjola", false],
  ["Obinna", "Ezeobika", false],
  ["Oghogho", "Kamah", false],
  ["Adeleke", "Adekanbi", true, "Partner"],
  ["Yusuf", "Salako", false],
  ["Dolapo", "Falola", false],
  ["Moniba", "Omagbemi", false],
  ["Olusegun", "Omodele", false],
  ["Adetokunbo", "Towobola", false],
  ["Femi", "Dada", false],
  ["Nneka", "Igboh", false],
  ["Hakeem", "Kekere-Ekun", false],
  ["Taiwo", "Allison", false],
  ["Adesola", "Adeyemi", false],
  ["Adejoke", "Adewuyi", true, "Associate"],
  ["Demola", "Fadeyibi", false],
  ["Olamide", "Mofe", false],
  ["Tayo", "Omosanya", true, "Associate"],
  ["Ibiyemi", "Unuigbe", false],
  ["Oiza", "Osho", false],
  ["Patrick", "Monye", true, "Associate"],
  ["Damilola", "Fasoranti", false],
  ["Mayowa", "Ogunlesi", false],
  ["Tomi", "Akanni", false],
  ["Joy", "Boeligha", false],
  ["Taiwo", "Oyelayo", true, "Accountant"],
  ["Taiwo", "Aiyepe", false],
  ["Dedunni", "Roberts", false],
  ["Chris", "Chime", false],
  ["Morenike", "Young", false],
  ["Nwamaka", "Onyenokwe", false],
  ["Busola", "Ogunbowale", false],
  ["Bolawole", "Andu", false],
  ["Modupe", "Ogunsakin", false],
  ["Asiriuwa", "Uwugibe", false],
  ["Oyeloyin", "Oyewumi", false],
  ["Olumofe", "Olamide", true],
  ["Kolufunsho", "Ajala", false],
  ["Ekom", "Ebong", false],
  ["Eniayo", "Oyebolu", false],
  ["Aikenosi", "Akhigbe", false],
  ["Paul", "Adesina", false],
  ["Keren", "Anjorin", false],
  ["Oladipo", "Shorinola", false],
  ["Wunmi", "Williams", true],
  ["Pelumi", "Akinpelu", false],
  ["Tamilore", "Adelabu", false],
  ["Anuoluwa", "Teriba", false],
  ["Folarin", "Ayoola", false],
  ["Odilile", "Lawal", false],
  ["Pedro", "Peter-Dzoho", true],
  ["Marvelous", "Onyemuwa", true],
  ["John", "Akintunde Taiwo", true],
  ["Femi", "Aduroja", true],
  ["Adeoluwa", "Adedipe", true],
  ["Victor", "Kolade", true],
  ["Korede", "Malizu", true],
  ["Kingsley", "Ekezie", false],
  ["Israel", "Okon", true],
  ["Debo", "Laoye", true],
  ["Comfort", "Audu", true],
  ["Iletutu", "Awosika", true],
  ["Ayomide", "Adeoti", false],
  ["Fareedah", "Oladunni", false],
  ["Obinna", "Adewole", true],
  ["Azad", "Ali", true],
  ["Eniola", "Alonge", true],
] as const;

const formerMembersFromImage: FormerTeamMember[] = formerMemberNames.map(
  ([firstName, surname, isHighlighted, title], index) => ({
    _id: `former-image-${index}`,
    firstName,
    surname,
    isHighlighted,
    title,
  }),
);

export const getTeamMembers = cache(async () => {
  const members = await sanityFetch<SanityTeamMemberRecord[]>({
    query: TEAM_MEMBERS_QUERY,
    tags: ["teamMember"],
  });

  const currentMembers: CurrentTeamMember[] = [];
  const formerMembers = formerMembersFromImage;

  for (const member of members) {
    if (member.membershipStatus !== "former") {
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
  title: string;
  heroUrl: string;
  heroAlt: string;
  callToAction: {
    title: string;
    description: string;
    label: string;
    href: string;
    backgroundUrl: string;
    backgroundAlt: string;
    insetUrl: string;
    insetAlt: string;
  };
}

interface RawTeamPageData {
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

export const getTeamPageData = cache(async (): Promise<TeamPageData> => {
  const data = await sanityFetch<RawTeamPageData | null>({
    query: TEAM_PAGE_QUERY,
    tags: ["teamPage"],
  });

  return {
    title: data?.title || "",
    heroUrl: data?.heroUrl || "",
    heroAlt: data?.heroAlt || "",
    callToAction: {
      title: data?.callToAction?.title || "",
      description: data?.callToAction?.description || "",
      label: data?.callToAction?.label || "",
      href: data?.callToAction?.href || "",
      backgroundUrl: data?.callToAction?.backgroundUrl || "",
      backgroundAlt: data?.callToAction?.backgroundAlt || "",
      insetUrl: data?.callToAction?.insetUrl || "",
      insetAlt: data?.callToAction?.insetAlt || "",
    },
  };
});
