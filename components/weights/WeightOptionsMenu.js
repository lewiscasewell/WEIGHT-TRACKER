import { Menu, Transition, Dialog } from '@headlessui/react'
import { Fragment, useState } from 'react'
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function deleteWeight() {
    await deleteDoc(
      doc(db, 'Weights', auth.currentUser.uid, 'Weight', weightId)
    )
    setIsDeleteModalOpen(false);
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
                  onClick={() => setIsDeleteModalOpen(true)}
                  className={`${
                    active ? 'bg-red-400 text-white' : 'text-gray-900'
                  } group flex w-full
                  items-center rounded-md px-2 py-2 text-sm`}
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
      
          {/* Delete confirmation modal */}
          <Transition appear show={isDeleteModalOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={() => setIsDeleteModalOpen(false)}
            >
              <div className="min-h-screen px-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                </Transition.Child>
      
                {/* Delete confirmation dialog */}
                <span
                  className="inline-block h-screen align-middle"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Delete weight?
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this weight? This action
                        cannot be undone.
                      </p>
                    </div>
      
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={() => setIsDeleteModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 ml-4 text-sm font-medium text-red-700 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                        onClick={() => {
                          deleteWeight();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </Menu>
      </div>
      );
    }