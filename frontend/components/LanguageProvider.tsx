"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Lang = 'en' | 'bn'

const LanguageContext = createContext({ lang: 'en' as Lang, setLang: (l: Lang) => {} })

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ax_lang') : null
    if (saved === 'bn' || saved === 'en') setLang(saved)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('ax_lang', lang)
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export default LanguageProvider
