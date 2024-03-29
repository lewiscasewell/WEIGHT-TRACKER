import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useRecoilState } from 'recoil'

export default function ProfileListbox({
  options,
  value,
  field,
  state,
  setState,
}) {
  // const [selected, setSelected] = useState(state)

  return (
    <div className="w-full">
      <Listbox
        value={!value ? '-' : value}
        onChange={(e) => setState({ ...state, [field]: e })}
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left text-lg shadow-md focus:outline-none focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-red-300">
            <span className="block truncate">{!value ? '-' : value}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                className="h-5 w-5 text-slate-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="text-md absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-lg">
              {options.map((option, valueIdx) => (
                <Listbox.Option
                  key={valueIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-red-100 text-red-900' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ value }) => (
                    <>
                      <span
                        className={`block truncate ${
                          value ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option}
                      </span>
                      {value ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
