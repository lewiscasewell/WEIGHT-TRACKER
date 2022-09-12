import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import {
  PencilIcon as PencilIconFilled,
  TrashIcon as TrashIconFilled,
} from '@heroicons/react/solid'
import {
  DotsHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/outline'
import { modalState } from '../../atoms/modalAtom'
import { useRecoilState } from 'recoil'
import { dateState } from '../../atoms/dateAtom'
import { deleteDoc, doc } from 'firebase/firestore'
import { auth, db } from '../../firebase'

export default function WeightOptionsMenu({ date, weightId }) {
  const [modalOpen, setModalOpen] = useRecoilState(modalState)
  const [value, setValue] = useRecoilState(dateState)

  async function deleteWeight() {
    await deleteDoc(
      doc(db, 'Weights', auth.currentUser.uid, 'Weight', weightId)
    )
  }

  return (
    <div className="h-[44px] w-[44px]">
      <Menu as="div" className="relative inline-block text-left">
        <div className="h-[44px] w-[44px]">
          <Menu.Button className=" inline-flex h-[44px] w-[44px] items-center justify-center rounded-full text-sm font-medium text-black transition-colors ease-in hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <DotsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    setModalOpen(true)
                    setValue(date)
                  }}
                  className={`${
                    active ? 'bg-red-400 text-white' : 'text-gray-900'
                  } flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <PencilIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  ) : (
                    <PencilIconFilled
                      className="mr-2 h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  )}
                  Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => deleteWeight()}
                  className={`${
                    active ? 'bg-red-400 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <TrashIcon
                      className="mr-2 h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  ) : (
                    <TrashIconFilled
                      className="mr-2 h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  )}
                  Delete
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
