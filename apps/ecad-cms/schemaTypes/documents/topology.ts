import {TagIcon} from '@sanity/icons/Tag'
import {defineField, defineType} from 'sanity'

export const topology = defineType({
  name: 'topology',
  title: 'Topology',
  description: 'Create and manage the topologies that can be assigned to projects.',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Optional internal context about the kinds of projects in this topology.',
    }),
  ],
  orderings: [{title: 'Name', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})

