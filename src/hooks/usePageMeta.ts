import { useEffect } from 'react'

const BASE_TITLE = 'HariPrabodham Annakut'

export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE_TITLE}` : BASE_TITLE

    if (description) {
      const tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (tag) tag.content = description
    }

    return () => {
      document.title = BASE_TITLE
    }
  }, [title, description])
}
