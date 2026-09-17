import {defineArrayMember, defineField, defineType} from 'sanity'
import {LockIcon} from '@sanity/icons/Lock'

export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Privacy policy',
  description: 'Edit the published privacy notice, summary, and last-updated date.',
  type: 'document',
  icon: LockIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Privacy Policy',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'summary', type: 'text', rows: 3}),
    defineField({name: 'lastUpdated', type: 'date'}),
    defineField({
      name: 'body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {prepare: () => ({title: 'Privacy policy'})},
})
