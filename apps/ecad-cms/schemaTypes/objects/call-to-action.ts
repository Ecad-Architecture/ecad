import {defineField, defineType} from 'sanity'

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Closing callout',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      description: 'The main message displayed over the background image.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Supporting text',
      type: 'text',
      rows: 5,
      description: 'The paragraph displayed below the heading.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Button text',
      type: 'string',
      description: 'The words shown inside the button, for example “Work With ECAD”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Button destination',
      type: 'string',
      description:
        'The page the button should open, for example “/contact?form=project#contact-form”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'backgroundMedia',
      title: 'Background media',
      type: 'contentMedia',
      description: 'Choose the large image or video displayed behind the callout content.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'insetMedia',
      title: 'Inset media',
      type: 'contentMedia',
      description: 'Choose the smaller image or video displayed over the background media.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'label',
      backgroundMediaType: 'backgroundMedia.mediaType',
      backgroundImage: 'backgroundMedia.image.asset',
      backgroundVideoThumbnail: 'backgroundMedia.video.thumbnail.asset',
    },
    prepare: ({
      title,
      subtitle,
      backgroundMediaType,
      backgroundImage,
      backgroundVideoThumbnail,
    }) => ({
      title,
      subtitle,
      media: backgroundMediaType === 'video' ? backgroundVideoThumbnail : backgroundImage,
    }),
  },
})
