import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { MenuItem } from './MenuItem'
import { DarkModeButton } from './DarkModeButton'
import SmartLink from '@/components/SmartLink'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import DashboardButton from '@/components/ui/dashboard/DashboardButton'

/**
 * 响应式 折叠菜单
 */
export const MenuList = props => {
  const { customNav, customMenu, buttonTextColor, enableClerk } = props
  const { locale, isDarkMode, toggleDarkMode } = useGlobal()

  const [showMenu, setShowMenu] = useState(false) // 控制菜单展开/收起状态
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [canScrollLeftDesktop, setCanScrollLeftDesktop] = useState(false)
  const [canScrollRightDesktop, setCanScrollRightDesktop] = useState(false)
  const scrollContainerRef = useRef(null)
  const scrollContainerDesktopRef = useRef(null)
  const router = useRouter()

  let links = [
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('HEO_MENU_ARCHIVE')
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('HEO_MENU_SEARCH')
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('HEO_MENU_CATEGORY')
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('HEO_MENU_TAG')
    }
  ]

  if (customNav) {
    links = customNav.concat(links)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU', BLOG.CUSTOM_MENU)) {
    links = customMenu
  }

  // 过滤掉 show: false 的菜单项
  const visibleLinks = links?.filter(link => link?.show !== false) || []

  const toggleMenu = () => {
    setShowMenu(!showMenu) // 切换菜单状态
  }

  useEffect(() => {
    setShowMenu(false)
  }, [router])

  // 检查滚动状态（移动端）
  const checkScrollability = () => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    )
  }

  // 检查滚动状态（桌面端）
  const checkScrollabilityDesktop = () => {
    if (!scrollContainerDesktopRef.current) return
    const container = scrollContainerDesktopRef.current
    setCanScrollLeftDesktop(container.scrollLeft > 0)
    setCanScrollRightDesktop(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    )
  }

  // 滚动函数（移动端）
  const scroll = direction => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const scrollAmount = container.clientWidth * 0.8
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  // 滚动函数（桌面端）
  const scrollDesktop = direction => {
    if (!scrollContainerDesktopRef.current) return
    const container = scrollContainerDesktopRef.current
    const scrollAmount = container.clientWidth * 0.8
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  // 监听滚动事件（移动端）
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    checkScrollability()
    container.addEventListener('scroll', checkScrollability)
    window.addEventListener('resize', checkScrollability)

    return () => {
      container.removeEventListener('scroll', checkScrollability)
      window.removeEventListener('resize', checkScrollability)
    }
  }, [visibleLinks])

  // 监听滚动事件（桌面端）
  useEffect(() => {
    const container = scrollContainerDesktopRef.current
    if (!container) return

    checkScrollabilityDesktop()
    container.addEventListener('scroll', checkScrollabilityDesktop)
    window.addEventListener('resize', checkScrollabilityDesktop)

    return () => {
      container.removeEventListener('scroll', checkScrollabilityDesktop)
      window.removeEventListener('resize', checkScrollabilityDesktop)
    }
  }, [visibleLinks])

  if (!visibleLinks || visibleLinks.length === 0) {
    return null
  }

  return (
    <div className='relative w-full'>
      {/* 移动端菜单切换按钮 */}
      <button
        id='navbarToggler'
        onClick={toggleMenu}
        className={`absolute right-2 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden z-50 ${
          showMenu ? 'navbarTogglerActive' : ''
        }`}>
        <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
        <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
        <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
      </button>

      {/* 新的侧边菜单 - 全屏覆盖 */}
      {showMenu && (
        <>
          {/* 背景遮罩 */}
          <div
            className='fixed inset-0 z-[100] bg-black bg-opacity-50 lg:hidden'
            onClick={toggleMenu}
          />
          {/* 侧边菜单面板 */}
          <div className='fixed right-0 top-0 z-[101] h-screen w-[280px] bg-white shadow-xl dark:bg-dark-2 lg:hidden transform transition-transform duration-300 ease-in-out overflow-hidden'>
            <div className='flex h-full flex-col'>
              {/* 关闭按钮 */}
              <div className='flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-600'>
                <span className='text-lg font-semibold text-dark dark:text-white'>Menu</span>
                <button
                  onClick={toggleMenu}
                  className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-3'>
                  <i className='fas fa-times text-xl'></i>
                </button>
              </div>

              {/* 菜单内容区域 - 可滚动 */}
              <div className='flex-1 overflow-y-auto'>
                {/* 所有菜单项 */}
                {visibleLinks && visibleLinks.length > 0 ? (
                  <ul className='py-2'>
                    {visibleLinks.map((link, index) => (
                      <li key={index} className='group relative'>
                        <SmartLink
                          href={link?.href}
                          target={link?.target}
                          onClick={toggleMenu}
                          className='ud-menu-scroll mx-4 flex items-center px-4 py-3 text-base font-medium text-dark hover:bg-gray-100 hover:text-primary dark:text-white dark:hover:bg-dark-3 dark:hover:text-primary'>
                          {link?.icon && <i className={link.icon + ' mr-3'} />}
                          {link?.name}
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className='flex items-center justify-center py-8 text-gray-500 dark:text-gray-400'>
                    <span>No menu items</span>
                  </div>
                )}
              </div>

              {/* 底部固定区域 - 夜间模式和 Dashboard */}
              <div className='border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-dark-3'>
                {/* 深色模式切换 */}
                <div 
                  onClick={toggleDarkMode}
                  className='mb-4 flex items-center justify-between rounded-lg bg-white px-4 py-3 dark:bg-dark-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors'>
                  <span className='text-sm font-medium text-dark dark:text-white'>
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </span>
                  <DarkModeButton inSideMenu={true} />
                </div>
                
                {/* Dashboard 按钮 */}
                {enableClerk && (
                  <>
                    <SignedOut>
                      <SmartLink
                        href='https://make.imbastudio.ca/dashboard/'
                        target='_blank'
                        rel='noreferrer'
                        onClick={toggleMenu}
                        className='block w-full rounded-md bg-primary py-3 text-center text-sm font-medium text-white duration-300 ease-in-out hover:bg-blue-dark'>
                        Dashboard
                      </SmartLink>
                    </SignedOut>
                    <SignedIn>
                      <div className='mb-3 flex items-center justify-center'>
                        <UserButton />
                      </div>
                      <DashboardButton />
                    </SignedIn>
                  </>
                )}
                {!enableClerk && (
                  <SmartLink
                    href='https://make.imbastudio.ca/dashboard/'
                    target='_blank'
                    rel='noreferrer'
                    onClick={toggleMenu}
                    className='block w-full rounded-md bg-primary py-3 text-center text-sm font-medium text-white duration-300 ease-in-out hover:bg-blue-dark'>
                    Dashboard
                  </SmartLink>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 移动端横向滚动菜单 */}
      <nav
        id='navbarCollapse'
        className='relative lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:px-4 lg:py-0 lg:shadow-none dark:lg:bg-transparent xl:px-6'>
        {/* 移动端：横向滚动容器 */}
        <div className='relative flex items-center overflow-hidden min-h-[48px] lg:hidden pr-[60px]'>
          {/* 左箭头 - 贴近屏幕最左边 */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className='flex-shrink-0 flex h-full w-6 items-center justify-center text-white opacity-70 hover:opacity-100'>
              <i className='fas fa-chevron-left text-xs'></i>
            </button>
          )}

          {/* 菜单项容器 - 使用 flex-1 占据剩余空间，设置 overflow: hidden */}
          <div className='flex-1 overflow-hidden px-[3px]'>
            <ul
              ref={scrollContainerRef}
              className='flex overflow-x-auto scrollbar-hide py-2 text-[10px] lg:blcok lg:flex 2xl:ml-20'
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {visibleLinks?.map((link, index) => (
                <MenuItem key={index} link={link} />
              ))}
            </ul>
          </div>

          {/* 右箭头 - 在侧边菜单按钮和菜单项中间 */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className='flex-shrink-0 flex h-full w-6 items-center justify-center text-white opacity-70 hover:opacity-100 pl-[3px]'>
              <i className='fas fa-chevron-right text-xs'></i>
            </button>
          )}
        </div>


        {/* 桌面端：带箭头的滚动菜单 */}
        <div className='hidden lg:flex items-center w-full relative'>
          {/* 左箭头 - 只在超过4个且可滚动时显示 */}
          {visibleLinks.length > 4 && canScrollLeftDesktop && (
            <button
              onClick={() => scrollDesktop('left')}
              className='flex-shrink-0 flex h-full w-8 items-center justify-center text-white opacity-70 hover:opacity-100 z-10'>
              <i className='fas fa-chevron-left text-sm'></i>
            </button>
          )}

          {/* 菜单项容器 - 平均分配空间 */}
          <div className={`flex-1 overflow-hidden ${visibleLinks.length > 4 ? 'px-2' : ''}`}>
            <ul
              ref={scrollContainerDesktopRef}
              className={`flex scrollbar-hide ${visibleLinks.length > 4 ? 'overflow-x-auto' : ''}`}
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                width: visibleLinks.length > 4 ? 'auto' : '100%'
              }}>
              {visibleLinks?.map((link, index) => (
                <MenuItem 
                  key={index} 
                  link={link} 
                  isEqualWidth={visibleLinks.length <= 4}
                />
              ))}
            </ul>
          </div>

          {/* 右箭头 - 只在超过4个且可滚动时显示 */}
          {visibleLinks.length > 4 && canScrollRightDesktop && (
            <button
              onClick={() => scrollDesktop('right')}
              className='flex-shrink-0 flex h-full w-8 items-center justify-center text-white opacity-70 hover:opacity-100 z-10'>
              <i className='fas fa-chevron-right text-sm'></i>
            </button>
          )}
        </div>
      </nav>
    </div>
  )
}
