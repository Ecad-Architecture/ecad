import {defineField, defineType} from 'sanity'
import {ProjectsIcon} from '@sanity/icons/Projects'

export const workPage = defineType({
  name: 'workPage',
  title: 'Work page',
  description: 'Manage the work landing page hero, introduction, and project discovery copy.',
  type: 'document',
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'All Projects',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({name: 'hero', type: 'heroMedia', validation: (rule) => rule.required()}),
    defineField({name: 'exploreMoreIntroduction', type: 'richText'}),
    defineField({
      name: 'featuredProjects',
      type: 'array',
      description: 'Optional hand-picked projects. Their order here controls their curated order.',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {prepare: () => ({title: 'Work page'})},
})
