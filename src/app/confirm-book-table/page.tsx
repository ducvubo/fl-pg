import React, { Suspense } from 'react'
import ConFirmBookTabel from './ConfirmBookTable'

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ConFirmBookTabel />
      </Suspense>
    </div>
  )
}
