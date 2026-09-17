import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

export const contentMedia = defineType({
  name: 'contentMedia',
  title: 'Media',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      description: 'Choose whether this area displays an image or a video.',
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
      title: 'Image',
      type: 'contentImage',
      description: 'Upload or select the image to display in this area.',
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
      title: 'Video',
      type: 'contentVideo',
      description: 'Add the hosted video and the thumbnail shown before it plays.',
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
      title: mediaType === 'video' ? videoTitle || 'Video' : 'Image',
      media: mediaType === 'video' ? videoThumbnail : image,
    }),
  },
})

