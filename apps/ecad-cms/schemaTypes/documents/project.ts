import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  description: 'Create and manage portfolio projects.',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'heroMedia',
      title: 'Hero media',
      type: 'heroMedia',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Project name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description:
        'This becomes the project’s web address. Click Generate to create it from the project name.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      type: 'string',
      description: 'City and state, for example: Victoria Island, Lagos State.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'topology',
      type: 'reference',
      to: [{type: 'topology'}],
      description: 'Select an existing topology or create a new one.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {list: ['Completed', 'In progress', 'Concept'], layout: 'radio'},
      initialValue: 'Completed',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Project description',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'completionYear',
      title: 'Year of completion',
      type: 'number',
      description:
        'Enter the completion year. For in-progress or concept projects, use the expected completion year.',
      validation: (rule) => rule.required().integer().min(1000).max(9999),
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      of: [
        defineArrayMember({type: 'contentImage'}),
        defineArrayMember({type: 'contentVideo'}),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
      topology: 'topology.title',
      heroMediaType: 'heroMedia.mediaType',
      heroImage: 'heroMedia.image.asset',
      heroVideoThumbnail: 'heroMedia.video.thumbnail.asset',
    },
    prepare: ({title, location, topology, heroMediaType, heroImage, heroVideoThumbnail}) => ({
      title,
      subtitle: [location, topology].filter(Boolean).join(' · '),
      media: heroMediaType === 'video' ? heroVideoThumbnail : heroImage,
    }),
  },
})
