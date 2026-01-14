/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import LazyImage from '@/components/LazyImage'

/**
 * Footer Logo 组件
 * 使用 footer-feature-logo 图片
 */
export const FooterLogo = () => {
  const router = useRouter()

  return (
    <div className='mb-6 inline-block'>
      <div
        className='cursor-pointer'
        onClick={() => {
          router.push('/')
        }}>
        <LazyImage
          priority
          src='/images/starter/footer/footer-feature-logo.png'
          alt='IMBA STUDIO'
          className='h-auto max-w-[160px]'
          onError={e => {
            // 如果 PNG 不存在，尝试其他格式
            const img = e.target
            if (img.src.endsWith('.png')) {
              img.src = '/images/starter/footer/footer-feature-logo.svg'
            } else if (img.src.endsWith('.svg')) {
              img.src = '/images/starter/footer/footer-feature-logo.webp'
            }
          }}
        />
      </div>
    </div>
  )
}
