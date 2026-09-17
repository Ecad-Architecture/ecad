import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

export const teamPage = defineType({
  name: 'teamPage',
  title: 'Customize Teams Page',
  description: 'Manage the Team page hero and closing callout.',
  type: 'document',
  icon: UsersIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'closing', title: 'Closing callout'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      group: 'hero',
      description:
        'The Team page heading. Keep this as “Team” unless the page heading should change.',
      initialValue: 'Team',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero media',
      type: 'heroMedia',
      group: 'hero',
      description: 'Choose the image or video displayed at the top of the Team page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'callToAction',
      title: 'Closing callout',
      type: 'callToAction',
      group: 'closing',
      description:
        'Manage the final Team-page message, media, and button shown above the footer. This uses the same reusable callout format as the Culture page.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {prepare: () => ({title: 'Customize Teams Page'})},
})
