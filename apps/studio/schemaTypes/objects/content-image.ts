import {defineField, defineType} from 'sanity'

export const contentImage = defineType({
  name: 'contentImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'asset',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Optionally describe the image for people using screen readers.',
    }),
    defineField({
      name: 'caption',
      type: 'string',
      description:
        'Optional text shown with the image, such as a short explanation, location, or photo credit.',
    }),
  ],
  preview: {select: {title: 'alt', media: 'asset'}},
})
