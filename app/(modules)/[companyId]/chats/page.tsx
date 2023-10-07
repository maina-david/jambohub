import Image from 'next/image'
import React from 'react'

export const metadata = {
  title: "Chats",
}

function ChatsPage() {
  return (
    <div className="container mx-auto rounded-lg shadow-lg">
      <div className="flex items-center justify-between border-b-2 bg-white p-5">
        <div className="text-2xl font-semibold">GoingChat</div>
        <div className="w-1/2">
          <input
            type="text"
            name=""
            id=""
            placeholder="search IRL"
            className="w-full rounded-2xl bg-gray-100 px-5 py-3"
          />
        </div>
        <div
          className="flex items-center justify-center rounded-full bg-yellow-500 p-2 font-semibold text-white"
        >
          RA
        </div>
      </div>

      <div className="flex flex-row justify-between bg-white">
        <div className="flex w-2/5 flex-col overflow-y-auto border-r-2">

          <div className="border-b-2 px-2 py-4">
            <input
              type="text"
              placeholder="search chatting"
              className="w-full rounded-2xl border-2 border-gray-200 p-2"
            />
          </div>
          <div
            className="flex flex-row items-center justify-center border-b-2 px-2 py-4"
          >
            <div className="w-1/4">
              <Image
                src="https://source.unsplash.com/_7LbC5J-jw4/600x600"
                className="rounded-full object-cover"
                alt=""
                height={12}
                width={12}
              />
            </div>
            <div className="w-full">
              <div className="text-lg font-semibold">Luis1994</div>
              <span className="text-gray-500">Pick me at 9:00 Am</span>
            </div>
          </div>
          <div className="flex flex-row items-center border-b-2 px-2 py-4">
            <div className="w-1/4">
              <Image
                src="https://source.unsplash.com/otT2199XwI8/600x600"
                className="rounded-full object-cover"
                alt=""
                height={12}
                width={12}
              />
            </div>
            <div className="w-full">
              <div className="text-lg font-semibold">Everest Trip 2021</div>
              <span className="text-gray-500">Hi Sam, Welcome</span>
            </div>
          </div>
          <div
            className="flex flex-row items-center border-b-2 border-l-4 border-blue-400 px-2 py-4"
          >
            <div className="w-1/4">
              <Image
                src="https://source.unsplash.com/L2cxSuKWbpo/600x600"
                className="rounded-full object-cover"
                alt=""
                height={12}
                width={12}
              />
            </div>
            <div className="w-full">
              <div className="text-lg font-semibold">MERN Stack</div>
              <span className="text-gray-500">Lusi : Thanks Everyone</span>
            </div>
          </div>
          <div className="flex flex-row items-center border-b-2 px-2 py-4">
            <div className="w-1/4">
              <Image
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="rounded-full object-cover"
                alt=""
                height={12}
                width={12}
              />
            </div>
            <div className="w-full">
              <div className="text-lg font-semibold">Javascript Indonesia</div>
              <span className="text-gray-500">Evan : some one can fix this</span>
            </div>
          </div>
          <div className="flex flex-row items-center border-b-2 px-2 py-4">
            <div className="w-1/4">
              <Image
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="rounded-full object-cover"
                alt=""
                height={12}
                width={12}
              />
            </div>
            <div className="w-full">
              <div className="text-lg font-semibold">Javascript Indonesia</div>
              <span className="text-gray-500">Evan : some one can fix this</span>
            </div>
          </div>

          <div className="flex flex-row items-center border-b-2 px-2 py-4">
            <div className="w-1/4">
              <Image
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="rounded-full object-cover"
                alt=""
                height={12}
                width={12}
              />
            </div>
            <div className="w-full">
              <div className="text-lg font-semibold">Javascript Indonesia</div>
              <span className="text-gray-500">Evan : some one can fix this</span>
            </div>
          </div>

        </div>

        <div className="flex w-full flex-col justify-between px-5">
          <div className="mt-5 flex flex-col">
            <div className="mb-4 flex justify-end">
              <div
                className="mr-2 rounded-l-3xl rounded-tr-xl bg-blue-400 px-4 py-3 text-white"
              >
                Welcome to group everyone !
              </div>
              <Image
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="h-8 w-8 rounded-full object-cover"
                alt=""
                height={12}
                width={12}
              />
            </div>
            <div className="mb-4 flex justify-start">
              <Image
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="h-8 w-8 rounded-full object-cover"
                alt=""
                height={12}
                width={12}
              />
              <div
                className="ml-2 rounded-r-3xl rounded-tl-xl bg-gray-400 px-4 py-3 text-white"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
                at praesentium, aut ullam delectus odio error sit rem. Architecto
                nulla doloribus laborum illo rem enim dolor odio saepe,
                consequatur quas?
              </div>
            </div>
            <div className="mb-4 flex justify-end">
              <div>
                <div
                  className="mr-2 rounded-l-3xl rounded-tr-xl bg-blue-400 px-4 py-3 text-white"
                >
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Magnam, repudiandae.
                </div>

                <div
                  className="mr-2 mt-4 rounded-l-3xl rounded-tr-xl bg-blue-400 px-4 py-3 text-white"
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Debitis, reiciendis!
                </div>
              </div>
              <Image
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="h-8 w-8 rounded-full object-cover"
                alt=""
                height={12}
                width={12}
              />
            </div>
            <div className="mb-4 flex justify-start">
              <Image
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="h-8 w-8 rounded-full object-cover"
                alt=""
                height={12}
                width={12}
              />
              <div
                className="ml-2 rounded-r-3xl rounded-tl-xl bg-gray-400 px-4 py-3 text-white"
              >
                happy holiday guys!
              </div>
            </div>
          </div>
          <div className="py-5">
            <input
              className="w-full rounded-xl bg-gray-300 px-3 py-5"
              type="text"
              placeholder="type your message here..."
            />
          </div>
        </div>
        <div className="w-2/5 border-l-2 px-5">
          <div className="flex flex-col">
            <div className="py-4 text-xl font-semibold">Mern Stack Group</div>
            <Image
              src="https://source.unsplash.com/L2cxSuKWbpo/600x600"
              className="h-64 rounded-xl object-cover"
              alt=""
              height={12}
              width={12}
            />
            <div className="py-4 font-semibold">Created 22 Sep 2021</div>
            <div className="font-light">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt,
              perspiciatis!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatsPage
