import { useRecoilState } from "recoil"
import {modalState, postIdState} from "../atom/modalAtom"
import Modal from "react-modal"
import { EmojiHappyIcon, PhotographIcon, XIcon } from "@heroicons/react/outline"
import { useEffect, useState } from "react"
import { db } from "../firebase"
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from "firebase/firestore"
import Image from "next/image"
import Moment from "react-moment"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function CommentModal() {
  const [isOpen, setIsOpen] = useRecoilState(modalState)
  const [postId] = useRecoilState(postIdState)
  const [post, setPost] = useState({})
  const { data: session } = useSession()
  const [text, setText] = useState("")
  const router = useRouter()

  useEffect(() => {
    onSnapshot(doc(db, 'posts', postId), (snapshot => {
      setPost(snapshot)
    }))
  }, [postId])

  const handleCommentButtonClick = async () => {
    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        comment: text,
        name: session.user.name,
        username: session.user.username,
        userImg: session.user.image,
        timestamp: serverTimestamp(),
        userId: session.user.uid
      })
    } catch (error) {
      console.error(error)
    }

    setIsOpen(false)
    setText('')
    router.push(`/posts/${postId}`)
  }
  
  const handleInputChange = (event) => {
    setText(event.target.value)
  }

  return (
    <div>
      {isOpen && (
        <Modal
          ariaHideApp={false}
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          className="max-w-lg w-[90%] absolute top-24 left-1/2 translate-x-[-50%] bg-white border-2 border-gray-400 rounded-xl shadow-md"
        >
          {post?.data() && (
            <div className="p-1">
              <div className="border-b border-gray-200 py-2 px-1.5">
                <div
                  onClick={() => setIsOpen(false)}
                  className="hoverEffect w-9 h-9 flex items-center justify-center "
                >
                  <XIcon className="h-5 text-gray-700 p-0" />
                </div>
              </div>
              <div className="p-2 flex items-center space-x-1 relative">
                <span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300" />
                <div>
                  <Image
                    width={44}
                    height={44}
                    src={post.data().userImg}
                    alt="profile image"
                    className="rounded-full"
                  />
                </div>
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                  {post.data().name}
                </h4>
                <span className="text-sm sm:text-[15px]">
                  @{post.data().username}&nbsp;&ndash;&nbsp;
                </span>
                <span className="text-sm sm:text-[15px] hover:underline">
                  <Moment fromNow>{post.data().timestamp.toDate()}</Moment>
                </span>
              </div>
              <p className="text-gray-500 text-[15px] sm:text-4 ml-16 mb-2">
                {post.data().text}
              </p>
              <div className="flex items-start p-3 space-x-3">
                <div>
                  <Image
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
                      placeholder="Tweet your reply"
                      className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2.5">
                    <>
                      <div className="flex">
                        <div onClick={() => fileUploadRef.current.click()}>
                          <PhotographIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                        </div>
                        <EmojiHappyIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                      </div>
                      <button
                        onClick={handleCommentButtonClick}
                        disabled={!text.trim()}
                        className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                      >
                        Reply
                      </button>
                    </>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}