import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

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
      name: 'name',
      title: 'Full name',
      type: 'string',
      group: 'profile',
      description:
        'The person’s name as it should appear on their team card or in the former-team list.',
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
        'The person’s job title, shown when a visitor opens a current team member’s profile. This is optional for former members.',
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
      description:
        'The image used on the current-team card and in the opened profile. It is optional for former members because only their name is shown publicly.',
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
        'The short profile shown when a visitor opens a current team member’s card. This is optional for former members.',
      validation: (rule) =>
        rule.custom((biography, context) =>
          context.document?.membershipStatus === 'current' && !biography
            ? 'Biography is required for current team members'
            : true,
        ),
    }),
    defineField({
      name: 'startYear',
      title: 'Start year',
      type: 'number',
      group: 'employment',
      description:
        'The four-digit year the person started at ECAD. This is kept for company records and may be shown in their current profile.',
      validation: (rule) => rule.required().integer().min(1900).max(new Date().getFullYear()),
    }),
    defineField({
      name: 'endYear',
      title: 'End year',
      type: 'number',
      group: 'employment',
      description:
        'The four-digit year the person left ECAD. This is required for former members and kept for company records, even if the public list shows only their name.',
      hidden: ({document}) => document?.membershipStatus !== 'former',
      validation: (rule) =>
        rule.custom((endYear, context) => {
          const document = context.document as
            {membershipStatus?: string; startYear?: number} | undefined

          if (document?.membershipStatus !== 'former') return true
          if (!endYear) return 'End year is required for former team members'
          if (!Number.isInteger(endYear)) return 'End year must be a whole four-digit year'
          if (endYear < 1900 || endYear > new Date().getFullYear()) {
            return `End year must be between 1900 and ${new Date().getFullYear()}`
          }
          if (document.startYear && endYear < document.startYear) {
            return 'End year must be the same as or later than the start year'
          }
          return true
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
    select: {title: 'name', role: 'role', status: 'membershipStatus', media: 'portrait.asset'},
    prepare: ({title, role, status, media}) => ({
      title,
      subtitle:
        status === 'former' ? 'Former team member' : `${role || 'Role not set'} · Current team`,
      media,
    }),
  },
})
