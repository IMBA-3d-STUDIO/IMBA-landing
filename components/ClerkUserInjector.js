import { SetClerkUserContext } from '@/lib/global'
import { useUser } from '@clerk/nextjs'
import { useContext, useEffect } from 'react'

const FALLBACK = { isLoaded: true, isSignedIn: false, user: null }

/**
 * 仅在客户端挂载，将 Clerk useUser() 结果写入全局上下文，避免 SSG 时调用 useUser 导致构建报错。
 * 必须在 SetClerkUserContext 和 ClerkProvider 内部使用。
 */
export default function ClerkUserInjector() {
  const setClerkUser = useContext(SetClerkUserContext)
  const clerkUser = useUser()

  useEffect(() => {
    if (setClerkUser) {
      setClerkUser(clerkUser ?? FALLBACK)
    }
  }, [setClerkUser, clerkUser])

  return null
}
