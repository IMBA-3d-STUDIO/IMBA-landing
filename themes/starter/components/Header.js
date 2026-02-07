/* eslint-disable no-unreachable */
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import throttle from 'lodash.throttle'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { DarkModeButton } from './DarkModeButton'
import { Logo } from './Logo'
import { MenuList } from './MenuList'

const ClerkAuthNav = dynamic(() => import('@/components/ClerkAuthNav'), { ssr: false })

/**
 * 顶部导航栏
 */
export const Header = props => {
  const router = useRouter()
  const { isDarkMode } = useGlobal()
  const [buttonTextColor, setColor] = useState(
    router.route === '/' ? 'text-white' : ''
  )

  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  useEffect(() => {
    if (isDarkMode || router.route === '/') {
      setColor('text-white')
    } else {
      setColor('')
    }
    // ======= Sticky
    window.addEventListener('scroll', navBarScollListener)
    return () => {
      window.removeEventListener('scroll', navBarScollListener)
    }
  }, [isDarkMode])

  // 滚动监听
  const throttleMs = 200
  const navBarScollListener = useCallback(
    throttle(() => {
      // eslint-disable-next-line camelcase
      const ud_header = document.querySelector('.ud-header')
      const scrollY = window.scrollY
      // 控制台输出当前滚动位置和 sticky 值
      if (scrollY > 0) {
        ud_header?.classList?.add('sticky')
      } else {
        ud_header?.classList?.remove('sticky')
      }
    }, throttleMs)
  )

  return (
    <>
      {/* <!-- ====== Navbar Section Start --> */}
      <div className='ud-header absolute left-0 top-0 z-50 flex w-full items-center bg-transparent'>
        <div className='container'>
          <div className='relative -mx-4 flex items-center justify-between'>
            {/* Logo */}
            <Logo {...props} />

            <div className='flex w-full items-center justify-between px-4'>
              {/* 中间菜单 */}
              <MenuList {...props} buttonTextColor={buttonTextColor} enableClerk={enableClerk} />

              {/* 右侧功能 - 桌面端显示 */}
              <div className='hidden lg:flex items-center gap-4 justify-end pr-16 lg:pr-0'>
                {/* 深色模式切换 */}
                <DarkModeButton />
                {/* 注册登录功能（Clerk 仅客户端渲染，避免 SSG 报错） */}
                {enableClerk && (
                  <ClerkAuthNav variant='header' buttonTextColor={buttonTextColor} />
                )}
                {!enableClerk && (
                  <div className='flex gap-4'>
                    <SmartLink
                      href='https://make.imbastudio.ca/dashboard/'
                      target='_blank'
                      rel='noreferrer'
                      className={`signUpBtn ${buttonTextColor} p-2 rounded-md bg-white bg-opacity-20 py-2 text-base font-medium duration-300 ease-in-out hover:bg-opacity-100 hover:text-dark`}>
                      Dashboard
                    </SmartLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- ====== Navbar Section End --> */}
    </>
  )
}
