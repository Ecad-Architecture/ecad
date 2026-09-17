import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const heroMedia = defineType({
  name: 'heroMedia',
  title: 'Hero media',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      description: 'Choose whether the hero displays an image or a video.',
      initialValue: 'image',
      options: {
        layout: 'radio',
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Hero image',
      type: 'contentImage',
      description: 'Upload or select the image to display in the hero section.',
      hidden: ({parent}) => parent?.mediaType === 'video',
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.parent as {mediaType?: string})?.mediaType === 'video' || value
            ? true
            : 'An image is required',
        ),
    }),
    defineField({
      name: 'video',
      title: 'Hero video',
      type: 'contentVideo',
      description:
        'Add the hosted video and thumbnail to display in the hero section.',
      hidden: ({parent}) => parent?.mediaType !== 'video',
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.parent as {mediaType?: string})?.mediaType !== 'video' || value
            ? true
            : 'A video is required',
        ),
    }),
  ],
  preview: {
    select: {
      mediaType: 'mediaType',
      image: 'image.asset',
      videoTitle: 'video.title',
      videoThumbnail: 'video.thumbnail.asset',
    },
    prepare: ({image, mediaType, videoTitle, videoThumbnail}) => ({
      title: mediaType === 'video' ? videoTitle || 'Video hero' : 'Image hero',
      media: mediaType === 'video' ? videoThumbnail : image,
    }),
  },
})

