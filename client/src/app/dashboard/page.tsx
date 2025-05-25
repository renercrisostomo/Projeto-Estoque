"use client";

import {
  // useContext,
  useEffect 
} from 'react'
import Head from 'next/head'

// import { AuthContext } from '../contexts/AuthContext'
// import { GetServerSideProps } from 'next'
// import { getAPIClient } from '../../services/axios'

// const navigation = ['Dashboard', 'Team', 'Projects', 'Calendar', 'Reports']
// const profile = ['Your Profile', 'Settings']

// interface ClassNames {
//   (...classes: (string | undefined | null | false)[]): string;
// }

// const classNames: ClassNames = (...classes) => {
//   return classes.filter(Boolean).join(' ')
// }

export default function Dashboard() {
  // const { user } = useContext(AuthContext)

  useEffect(() => {
    // api.get('/users');
  }, [])

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
          </div>
          {/* /End replace */}
        </div>
      </main>
    </div>
  )
}

// A FUNÇÃO getServerSideProps FOI REMOVIDA DAQUI