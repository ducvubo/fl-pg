'use client'
import React, { useState, useCallback, useEffect } from 'react'
import clsx from 'clsx'
// import { Button } from '@/components/ui/button'
import { Button } from 'antd'
import _ from 'lodash'
import { addTag, getTag } from '../restaurant.api'
import { IAmenity, IRestaurantType } from '../restaurant.interface'
import { useRouter } from 'next/navigation'
import { Toast } from '@/app/components/Notification'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default function Tag({
  data,
  setData,
  tag,
  type,
  className, // Nhận thêm prop className để tuỳ chỉnh CSS
  inputClassName, // Tuỳ chỉnh CSS cho Input
  listClassName // Tuỳ chỉnh CSS cho list
}: {
  data: { name: string; _id: string }[]
  setData: React.Dispatch<React.SetStateAction<{ name: string; _id: string }[]>>
  tag?: string
  type: string
  className?: string
  inputClassName?: string
  listClassName?: string
}) {
  const [inputValue, setInputValue] = useState('')
  const [tagArr, setTagArr] = useState<IAmenity[] | IRestaurantType[]>([])
  const router = useRouter()

  const deleteArr = (index: number) => {
    const newData = [...data]
    newData.splice(index, 1)
    setData(newData)
  }

  const addToArr = async () => {
    if (inputValue.trim() !== '') {
      const res = await addTag({ tag_name: inputValue }, type)
      if (res.statusCode === 201) {
        let name = ''
        switch (type) {
          case 'amenity':
            name = res.data.amenity_name
            break
          case 'restaurent-type':
            name = res.data.restaurant_type_name
            break
          default:
            throw new Error('Invalid type')
        }

        setData([...data, { name, _id: res.data._id }])
        setInputValue('')
      } else if (res.code === -10) {
        Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
        // router.push('/login')
        await deleteCookiesAndRedirect()
      } else if (res.code === -11) {
        Toast('Thông báo', res.message, 'warning')
      } else {
        Toast('Thông báo', res.message, 'warning')
      }
    }
  }

  const getTags = async (value: string) => {
    const res = await getTag(value, type)
    if (res.statusCode === 200) {
      setTagArr(res.data)
    } else if (res.statusCode === 404) {
      setTagArr([])
    } else if (res.code === -10) {
      Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
      // router.push('/login')
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      Toast('Thông báo', res.message, 'warning')
    }
  }

  // sử dụng deboune delay call api
  const debouncedGetTags = useCallback(_.debounce(getTags, 300), [])

  const handleOnChangeInput = (value: string) => {
    setInputValue(value)
    debouncedGetTags(value)
  }

  const addTagOld = (tag_item: any, id: string) => {
    let name = ''
    switch (type) {
      case 'amenity':
        name = tag_item.amenity_name
        break
      case 'restaurent-type':
        name = tag_item.restaurant_type_name
        break
      default:
        throw new Error('Invalid type')
    }
    if (name.trim() !== '') {
      setData([...data, { name: name, _id: id }])
      setInputValue('')
    }
  }

  return (
    <React.Fragment>
      <div
        className={clsx(
          'relative rounded border border-solid border-[#e2e8f0] bg-white p-2 shadow-sm  min-w-[10rem] flex',
          className
        )}
      >
        <div className={clsx('flex flex-1 flex-wrap items-center gap-2 pl-2', listClassName)}>
          <ul className='flex flex-wrap items-center gap-2'>
            {data.map((item, index) => {
              return (
                <li key={index}>
                  <span className='whitespace-nowrap rounded border border-solid font-normal transition-all group/tw-chip inline-flex items-center justify-center gap-0 overflow-hidden hover:gap-2 border-gray-200 bg-gray-200 text-gray-600 h-[1.625rem] px-2 text-xs md:h-7 md:px-2 md:text-sm lg:h-[2.375rem] lg:px-3 lg:text-base'>
                    {item.name}
                    <span
                      className='transition-all group-hover/tw-chip:max-w-none cursor-pointer max-w-none overflow-auto'
                      onClick={() => deleteArr(index)}
                    >
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
          <input
            type='text'
            className={clsx(
              ' w-full min-w-[20rem] flex-1 border-none text-sm outline-none focus:border-none focus:outline-none focus:ring-0 lg:text-base relative',
              inputClassName
            )}
            placeholder={tag ? `${tag}` : 'Thêm tag...'}
            value={inputValue}
            onChange={(e) => {
              handleOnChangeInput(e.target.value)
            }}
          />
        </div>
        {tagArr.length < 1 ? (
          <Button type='primary' onClick={addToArr}>
            Thêm
          </Button>
        ) : (
          <span className='opacity-0 cursor-default'></span>
        )}
      </div>
      {inputValue && tagArr && (
        <div className='h-32 w-[97%] z-10  bg-white'>
          <ScrollArea className='h-32 w-full rounded-md border'>
            <div className='px-4'>
              {tagArr?.map((item: any, _) => (
                <>
                  <div
                    key={_}
                    className='text-lg h-10 flex items-center hover:text-[#00b14f] hover:cursor-pointer '
                    onClick={() => addTagOld(item, item._id)}
                  >
                    {/* {item.tag_profession_name} */}
                    {type === 'amenity' ? item.amenity_name : item.restaurant_type_name}
                  </div>
                  <Separator />
                </>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </React.Fragment>
  )
}
