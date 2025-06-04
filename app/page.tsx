import Viewer from '@/components/viewer';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='mx-auto px-4 sm:px-6 lg:px-4'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>Content Editing API POC</h1>
            </div>
            <nav className='hidden md:flex space-x-8'>
              <a href='#' className='text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'>
                Home
              </a>
              <a href='#' className='text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'>
                Documents
              </a>
              <a href='#' className='text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'>
                Settings
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className='flex flex-1'>
        {/* Sidebar */}
        <aside className='w-64 bg-white shadow-sm border-r border-gray-200'>
          <div className='h-full px-4 py-6'>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>Navigation</h2>
            <nav className='space-y-2'>
              <a href='#' className='bg-gray-100 text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md'>
                <svg className='text-gray-500 mr-3 h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                Documents
              </a>
              <a href='#' className='text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md'>
                <svg className='text-gray-400 mr-3 h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' />
                </svg>
                Archive
              </a>
              <a href='#' className='text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md'>
                <svg className='text-gray-400 mr-3 h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                  />
                </svg>
                Users
              </a>
              <a href='#' className='text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md'>
                <svg className='text-gray-400 mr-3 h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                  />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
                Settings
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 p-6'>
          <div className='max-w-7xl mx-auto'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 h-full min-h-[600px]'>
              <div className='p-6'>
                <div className='h-full'>
                  <Viewer document='Sample Doc with Google Fonts.pdf' />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='text-sm text-gray-500'>© 2025 Content Editing API POC. All rights reserved.</div>
            <div className='flex space-x-6'>
              <a href='#' className='text-sm text-gray-500 hover:text-gray-900'>
                Privacy Policy
              </a>
              <a href='#' className='text-sm text-gray-500 hover:text-gray-900'>
                Terms of Service
              </a>
              <a href='#' className='text-sm text-gray-500 hover:text-gray-900'>
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
