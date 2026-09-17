import {defineArrayMember, defineField, defineType} from 'sanity'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Culture page',
  description: 'Manage ECAD’s culture, beliefs, resources, principles, media, and call to action.',
  type: 'document',
  icon: InfoOutlineIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'overview', title: 'About ECAD'},
    {name: 'principles', title: 'Design principles'},
    {name: 'closing', title: 'Closing callout'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero media',
      type: 'heroMedia',
      group: 'hero',
      description:
        'Choose the image or video that appears at the top of the Culture page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'aboutTitle',
      title: 'Section Title',
      type: 'string',
      description: 'The heading displayed at the start of the About ECAD section.',
      initialValue: 'About ECAD',
      group: 'overview',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introduction',
      type: 'richText',
      group: 'overview',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'resources',
      type: 'array',
      group: 'overview',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'body', type: 'richText', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({
      name: 'beliefs',
      title: 'Culture beliefs',
      description: 'Use for “Design With Purpose” and “Better Together”.',
      type: 'array',
      group: 'overview',
      validation: (rule) => rule.length(2),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'body', type: 'richText', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({
      name: 'principles',
      title: 'Design principles',
      type: 'array',
      group: 'principles',
      description:
        'Add one row for each principle. Rows appear in this order and alternate between left and right on the page.',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Principle row',
          fields: [
            defineField({
              name: 'primaryMedia',
              title: 'Primary media',
              type: 'contentMedia',
              description:
                'Choose the large standalone image or video shown beside the principle story.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'story',
              title: 'Principle story',
              type: 'object',
              description: 'Add the second media item and the text displayed beneath it.',
              fields: [
                defineField({
                  name: 'media',
                  title: 'Story media',
                  type: 'contentMedia',
                  description: 'Choose the image or video displayed above the story text.',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'label',
                  title: 'Short label',
                  type: 'string',
                  description: 'A short theme such as “Context”, “Craft”, or “Progression”.',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'statement',
                  title: 'Main statement',
                  type: 'string',
                  description: 'The green statement paired with the short label.',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Supporting text',
                  type: 'text',
                  rows: 4,
                  description: 'The paragraph that explains this design principle.',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'link',
                  title: 'Link',
                  type: 'object',
                  description: 'Add the link displayed below the supporting text.',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Link text',
                      type: 'string',
                      description: 'The words visitors click, for example “Explore Our Work”.',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'href',
                      title: 'Link destination',
                      type: 'string',
                      description: 'The page address, for example “/work” or “/team”.',
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  validation: (rule) => rule.required(),
                }),
              ],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'story.label',
              subtitle: 'story.statement',
              primaryMediaType: 'primaryMedia.mediaType',
              primaryImage: 'primaryMedia.image.asset',
              primaryVideoThumbnail: 'primaryMedia.video.thumbnail.asset',
            },
            prepare: ({
              title,
              subtitle,
              primaryMediaType,
              primaryImage,
              primaryVideoThumbnail,
            }) => ({
              title: title || 'Untitled principle',
              subtitle,
              media: primaryMediaType === 'video' ? primaryVideoThumbnail : primaryImage,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'callToAction',
      title: 'Closing callout',
      type: 'callToAction',
      group: 'closing',
      description:
        'Manage the final Culture-page message, media, and button shown above the footer.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {prepare: () => ({title: 'Customize Culture page'})},
})
