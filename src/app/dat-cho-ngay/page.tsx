import React, { Suspense } from 'react'
import DatChoNgayPage from './DatChoNgayPage'

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DatChoNgayPage />
      </Suspense>
    </div>
  )
}
