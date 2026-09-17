import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

export const contentVideo = defineType({
  name: 'contentVideo',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'Video URL',
      description:
        'Use a hosted streaming video URL from Vimeo, YouTube, Mux, or another provider.',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}).required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      description:
        'Choose the image people will see before the video starts or while it is loading.',
      type: 'contentImage',
    }),
    defineField({
      name: 'title',
      title: 'Video title',
      type: 'string',
      description:
        'Give the video a short, clear name. This identifies it in the Studio and helps screen-reader users understand what the video contains.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'url', media: 'thumbnail.asset'}},
})
