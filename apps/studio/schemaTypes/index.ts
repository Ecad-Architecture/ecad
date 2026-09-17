import {aboutPage} from './documents/about-page'
import {privacyPage} from './documents/privacy-page'
import {project} from './documents/project'
import {teamMember} from './documents/team-member'
import {teamPage} from './documents/team-page'
import {topology} from './documents/topology'
import {workPage} from './documents/work-page'
import {callToAction} from './objects/call-to-action'
import {contentImage} from './objects/content-image'
import {contentMedia} from './objects/content-media'
import {contentVideo} from './objects/content-video'
import {heroMedia} from './objects/hero-media'
import {richText} from './objects/rich-text'

export const schemaTypes = [
  richText,
  contentImage,
  contentMedia,
  contentVideo,
  heroMedia,
  callToAction,
  aboutPage,
  privacyPage,
  teamPage,
  teamMember,
  workPage,
  topology,
  project,
]
