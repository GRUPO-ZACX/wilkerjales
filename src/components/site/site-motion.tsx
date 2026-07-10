"use client"

import { useEffect } from "react"

const animatedSelector = [
  ".site-animate-left",
  ".site-animate-right",
  ".site-animate-up",
  ".site-animate-down",
  ".site-animate-fade",
].join(", ")

export function SiteMotion() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(animatedSelector),
    )

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.14,
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  return null
}
