import { EmojiHappyIcon, PhotographIcon, XIcon } from '@heroicons/react/outline'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import {useSession, signOut} from "next-auth/react"
import Image from 'next/image'
import { useRef, useState } from 'react'
import {db, storage} from "../firebase"

export default function Input() {
  const fileUploadRef = useRef(null)
  const { data: session } = useSession()
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (event) => {
    setText(event.target.value)
  }

  const handleTweetButtonClick = async () => {
    if (loading) {
      return
    }

    setLoading(true)

    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        id: session.user.uid,
        text,
        userImg: session.user.image,
        timestamp: serverTimestamp(),
        name: session.user.name,
        username: session.user.name
      })

      const imageRef = ref(storage, `posts/${docRef.id}/image`)

      if (file) {
        await uploadString(imageRef, file, 'data_url').then(async () => {
          const downloadUrl = await getDownloadURL(imageRef)
          await updateDoc(doc(db, 'posts', docRef.id), {
            image: downloadUrl
          })
        })
      }
    } catch (error) {
      console.log(error)
    }

    setText('')
    setFile(null)
    setLoading(false)
  }

  const handleUploadFileInputChange = (event) => {
    const reader = new FileReader()
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0])
    }

    reader.onload = (readerEvent) => {
      setFile(readerEvent.target.result)
    }
  }

  return (
    session ? (
      <div className="flex items-start border-b border-gray-200 p-3 space-x-3">
        <div>
          <Image
            onClick={signOut}
            src={session.user.image}
            alt="profile image"
            width={44}
            height={44}
            className="rounded-full cursor-pointer hover:brightness-95"
          />
        </div>
        <div className="w-full divide-y divide-gray-200">
          <div>
            <textarea
              value={text}
              onChange={handleInputChange}
              rows="2"
              placeholder="What`s happening?"
              className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
            />
          </div>
          {file && (
            <div className="relative">
              <XIcon
                className="h-7 text-white absolute cursor-pointer bg-black rounded-full"
                onClick={() => setFile(null)}
              />
              <img
                src={file}
                alt="upload file"
                className={`${loading && 'animate-pulse'}`}
              />
            </div>
          )}
          <div className="flex items-center justify-between pt-2.5">
            {!loading && (
              <>
                <div className="flex">
                  <div onClick={() => fileUploadRef.current.click()}>
                    <PhotographIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                    <input
                      type="file"
                      hidden
                      ref={fileUploadRef}
                      onChange={handleUploadFileInputChange}
                    />
                  </div>
                  <EmojiHappyIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                </div>
                <button
                  onClick={handleTweetButtonClick}
                  disabled={!text.trim()}
                  className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                >
                  Tweet
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    ) : null
  )
}
