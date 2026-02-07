import DashboardButton from '@/components/ui/dashboard/DashboardButton'
import SmartLink from '@/components/SmartLink'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

/**
 * Clerk 登录/用户 UI，仅在客户端渲染（SSG 时不加载，避免 Clerk hook 报错）。
 * @param {{ variant: 'header' | 'menu', buttonTextColor?: string, onMenuClose?: () => void }} props
 */
export default function ClerkAuthNav({ variant = 'header', buttonTextColor = '', onMenuClose }) {
  const dashboardLink = (
    <SmartLink
      href='https://make.imbastudio.ca/dashboard/'
      target='_blank'
      rel='noreferrer'
      onClick={onMenuClose}
      className={
        variant === 'header'
          ? `signUpBtn ${buttonTextColor} p-2 rounded-md bg-white bg-opacity-20 py-2 text-base font-medium duration-300 ease-in-out hover:bg-opacity-100 hover:text-dark`
          : 'block w-full rounded-md bg-primary py-3 text-center text-sm font-medium text-white duration-300 ease-in-out hover:bg-blue-dark'
      }>
      Dashboard
    </SmartLink>
  )

  if (variant === 'header') {
    return (
      <>
        <SignedOut>
          <div className='flex gap-4'>
            {dashboardLink}
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
          <DashboardButton className='hidden md:block' />
        </SignedIn>
      </>
    )
  }

  // variant === 'menu' (mobile side panel)
  return (
    <>
      <SignedOut>{dashboardLink}</SignedOut>
      <SignedIn>
        <div className='mb-3 flex items-center justify-center'>
          <UserButton />
        </div>
        <DashboardButton />
      </SignedIn>
    </>
  )
}
