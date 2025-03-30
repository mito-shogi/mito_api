import info from '@/../package.json'
import { lowerCase, startCase } from 'lodash'

export const reference = {
  pageTitle: startCase(info.name),
  url: '/openapi.json',
  hideModels: false,
  showSidebar: true,
  hideDownloadButton: true,
  darkMode: true,
  metaData: {
    title: startCase(info.name),
    description: info.description
  },
  info: {
    title: startCase(info.name),
    version: info.version
  }
}

export const specification = {
  openapi: '3.1.0',
  info: {
    title: startCase(lowerCase(info.name)),
    version: info.version,
    description: info.description,
    license: {
      name: info.license
    }
  }
}
