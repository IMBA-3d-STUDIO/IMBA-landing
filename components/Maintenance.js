/**
 * Shown when Notion config (e.g. inline config) cannot be loaded.
 * All copy in English.
 */
export default function Maintenance() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-2 px-4'>
      <div className='max-w-md w-full text-center'>
        <h1 className='text-2xl font-bold text-dark dark:text-white mb-4'>
          Site Under Maintenance
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          We are temporarily unable to load site configuration. Please check
          back later.
        </p>
        <p className='text-gray-600 dark:text-gray-400 mb-2'>
          If you have urgent needs, you can:
        </p>
        <ul className='text-left list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 mb-6'>
          <li>
            Email us at{' '}
            <a
              href='mailto:info@imbastudio.ca'
              className='text-primary underline'>
              info@imbastudio.ca
            </a>
          </li>
          <li>
            Visit{' '}
            <a
              href='https://make.imbastudio.ca'
              target='_blank'
              rel='noreferrer'
              className='text-primary underline'>
              make.imbastudio.ca
            </a>
          </li>
        </ul>
        <p className='text-sm text-gray-500 dark:text-gray-500'>
          Thank you for your patience.
        </p>
      </div>
    </div>
  )
}
