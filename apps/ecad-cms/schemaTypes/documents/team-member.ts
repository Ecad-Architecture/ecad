import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

const MAX_BIOGRAPHY_WORDS = 30

type PortableTextBlock = {
  children?: Array<{text?: string}>
}

const countWords = (blocks: PortableTextBlock[] = []) => {
  const text = blocks
    .flatMap((block) => block.children ?? [])
    .map((child) => child.text ?? '')
    .join(' ')

  return text.match(/[\p{L}\p{N}]+(?:[\u2019'][\p{L}\p{N}]+)*/gu)?.length ?? 0
}

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  description:
    'Manage a current or former team member. Changing Team status determines which Team-page section includes this person.',
  type: 'document',
  icon: UserIcon,
  groups: [
    {name: 'profile', title: 'Profile', default: true},
    {name: 'employment', title: 'Employment record'},
    {name: 'display', title: 'Display settings'},
  ],
  fields: [
    defineField({
      name: 'firstName',
      title: 'First name',
      type: 'string',
      group: 'profile',
      description: 'The person’s first name.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'surname',
      title: 'Surname',
      type: 'string',
      group: 'profile',
      description: 'The person’s surname (last name).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'membershipStatus',
      title: 'Team status',
      type: 'string',
      group: 'employment',
      description:
        'Choose Current while the person works at ECAD. Change this to Former when they leave; their card will leave the current-team directory and their name will appear in the former-team section.',
      initialValue: 'current',
      options: {
        layout: 'radio',
        list: [
          {title: 'Current team member', value: 'current'},
          {title: 'Former team member', value: 'former'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'profile',
      description:
        'The person’s job title, shown when a visitor opens a current team member’s profile.',
      hidden: ({document}) => document?.membershipStatus === 'former',
      validation: (rule) =>
        rule.custom((role, context) =>
          context.document?.membershipStatus === 'current' && !role
            ? 'Role is required for current team members'
            : true,
        ),
    }),
    defineField({
      name: 'portrait',
      title: 'Profile image',
      type: 'contentImage',
      group: 'profile',
      description: 'The image used on the current-team card and in the opened profile.',
      hidden: ({document}) => document?.membershipStatus === 'former',
      validation: (rule) =>
        rule.custom((portrait, context) =>
          context.document?.membershipStatus === 'current' && !portrait
            ? 'A profile image is required for current team members'
            : true,
        ),
    }),
    defineField({
      name: 'biography',
      title: 'Profile / biography',
      type: 'richText',
      group: 'profile',
      description:
        'The short profile shown when a visitor opens a current team member’s card. Maximum 30 words.',
      hidden: ({document}) => document?.membershipStatus === 'former',
      validation: (rule) =>
        rule.custom((biography, context) => {
          const blocks = Array.isArray(biography) ? (biography as PortableTextBlock[]) : []

          if (context.document?.membershipStatus === 'current' && blocks.length === 0) {
            return 'Biography is required for current team members'
          }

          const wordCount = countWords(blocks)

          return wordCount > MAX_BIOGRAPHY_WORDS
            ? `Biography must be ${MAX_BIOGRAPHY_WORDS} words or fewer (currently ${wordCount})`
            : true
        }),
    }),
    defineField({
      name: 'visibility',
      title: 'Website visibility',
      type: 'string',
      group: 'display',
      description:
        'Choose Visible to include this person on the website, or Hidden to keep the record in Sanity without displaying it publicly.',
      initialValue: 'visible',
      options: {
        layout: 'radio',
        list: [
          {title: 'Visible', value: 'visible'},
          {title: 'Hidden', value: 'hidden'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      group: 'display',
      description:
        'Controls this person’s position within the current or former team section. Lower numbers appear first; use 10, 20, 30 to leave room for later additions.',
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [{title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {
      firstName: 'firstName',
      surname: 'surname',
      role: 'role',
      status: 'membershipStatus',
      media: 'portrait.asset',
    },
    prepare: ({firstName, surname, role, status, media}) => ({
      title: `${firstName || ''} ${surname || ''}`.trim(),
      subtitle:
        status === 'former' ? 'Former team member' : `${role || 'Role not set'} · Current team`,
      media,
    }),
  },
})
