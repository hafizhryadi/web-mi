import { getPayload } from 'payload'
import React from 'react'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import RichText from '@/components/richtext'
import Image from 'next/image'
import { Media } from '@/payload-types'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import RecommendedNews from '../../_sections/news/recomended-news'
import { getMessages } from 'next-intl/server'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const payload = await getPayload({ config })

  const {
    docs: { 0: post },
  } = await payload.find({
    collection: 'news',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!post) {
    notFound()
  }

  if (locale === 'en' && !post.global) {
    notFound()
  }

  return {
    title: post.name,
    openGraph: {
      images: [
        { url: `https://manajemeninformatika.polsri.ac.id${(post.thumbnail as Media).url!}` },
      ],
    },
  }
}

async function NewsPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const {
    pages: { newsPage: t },
  } = await getMessages({ locale })

  const payload = await getPayload({ config })

  const {
    docs: { 0: post },
  } = await payload.find({
    collection: 'news',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!post) {
    notFound()
  }

  if (locale === 'en' && !post.global) {
    notFound()
  }

  return (
    <div className="container max-w-7xl mx-auto mt-20 grid grid-cols-1 p-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`}>{t.breadcrumbs.home}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/news`}>{t.breadcrumbs.news}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <article>
        <div className="flex gap-1 items-center mb-2">
          {post.tags &&
            post.tags?.length > 0 &&
            post.tags.map((tag, idx) => <Badge key={idx}>{tag.tag}</Badge>)}
        </div>
        <h1 className="text-4xl font-bold">{post.name}</h1>
        <div>
          <div className="mb-2 text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
        <Image
          src={(post.thumbnail as Media).url || '/placeholder.png'}
          alt={post.name}
          width={1280}
          height={720}
          className="w-full aspect-video object-cover rounded-lg mb-6"
        />
        <div className="w-full text-lg">
          <RichText data={post.content!} className="w-full text-lg" enableGutter={false} />
        </div>
      </article>
      <div className="my-8">
        <RecommendedNews />
      </div>
    </div>
  )
}

export default NewsPage
