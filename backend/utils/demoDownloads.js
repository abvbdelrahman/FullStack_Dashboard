const demoFiles = {
  'auto-layout.pdf': {
    type: 'application/pdf',
    body: 'Auto-layout guide\n\nThis is a demo download file for the LMS dashboard.',
  },
  'research-interview-template.pdf': {
    type: 'application/pdf',
    body: 'Research interview template\n\nUse this demo file as a placeholder for interview notes.',
  },
  'prototype-walkthrough.mp4': {
    type: 'text/plain',
    body: 'Prototype walkthrough demo\n\nReplace this placeholder with a real video file in production.',
  },
  'persona-validation': {
    type: 'text/plain',
    body: 'Persona validation workshop recording\n\nThis is a demo recording placeholder.',
  },
}

export const getDemoDownload = (fileName) => demoFiles[fileName]

export const normalizeDemoUrl = (url = '') => {
  if (!url.includes('example.com')) return url

  const fileName = url.split('/').filter(Boolean).pop()
  return fileName && demoFiles[fileName] ? `/api/demo-downloads/${fileName}` : url
}
