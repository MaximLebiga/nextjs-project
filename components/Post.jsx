import { ChartBarIcon, ChatIcon, DotsHorizontalIcon, HeartIcon, ShareIcon, TrashIcon } from "@heroicons/react/outline"
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore"
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid"
import Moment from "react-moment"
import { db, storage } from "../firebase"
import {useSession, signIn} from "next-auth/react"
import { useEffect, useState } from "react"
import { deleteObject, ref } from "firebase/storage"
import Image from "next/image"
import {useRecoilState} from "recoil"
import {modalState, postIdState} from "../atom/modalAtom"
import { useRouter } from "next/router"

export default function Post({ post, id }) {
  const {data: session} = useSession()
  const [likes, setLikes] = useState([])
  const [comments, setComments] = useState([])
  const [isLiked, setIsLiked] = useState(false)
  const [, setIsOpen] = useRecoilState(modalState)
  const [, setPostId] = useRecoilState(postIdState)
  const router = useRouter()

  useEffect(() => {
    if (session) {
      setIsLiked(
        likes.findIndex((like) => like.id === session.user.uid) !== -1
      )
    }
  }, [likes, session])

  useEffect(() => {
    onSnapshot(collection(db, 'posts', id, "likes"), (snapshot) => setLikes(snapshot.docs))
  }, [id])

  useEffect(() => {
    onSnapshot(
      collection(db, 'posts', id, 'comments'),
      (snapshot) => setComments(snapshot.docs)
    )
  }, [id])

  const handleLikeButtonClick = async () => {
    if (session) {
      try {
        if (isLiked) {
          await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
        } else {
          await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
            username: session.user.username
          })
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      signIn()
    }
  }

  const handleChatButtonClick = async () => {
    if (session) {
      setPostId(id)
      setIsOpen((prevState) => !prevState)
    } else {
      try {
        await signIn()
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleDeleteButtonClick = async () => {
    try {
      if (window.confirm('Are you sure you want delete this post?')) {
        await deleteDoc(doc(db, 'posts', id))
        if (post.image) {
          await deleteObject(ref(storage, `posts/${id}/image`))
        }
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    post && (
      <div className="flex items-start p-3 cursor-pointer border-b border-gray-200">
        <div className="mr-4">
          <Image
            width={44}
            height={44}
            src={post.userImg}
            alt="profile image"
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <div onClick={() => router.push(`/posts/${id}`)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 whitespace-nowrap">
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                  {post.name}
                </h4>
                <span className="text-sm sm:text-[15px]">
                  @{post.username} &ndash;&thinsp;
                </span>
                {post.timestamp && (
                  <span className="text-sm sm:text-[15px] hover:underline">
                    <Moment fromNow>{post.timestamp.toDate()}</Moment>
                  </span>
                )}
              </div>
              <DotsHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2" />
            </div>
            <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
              {post.text}
            </p>
            <img
              src={post.image}
              alt="post image"
              className="rounded-2xl mr-2"
            />
          </div>
          <div className="flex justify-between text-gray-500 p-2">
            <div className="flex items-center">
              <ChatIcon
                onClick={handleChatButtonClick}
                className="h-9 w-9 hoverEffect p-2 hover:text-blue-500 hover:bg-sky-100"
              />
              {comments.length > 0 && (
                <span className="text-sm select-none">{comments.length}</span>
              )}
            </div>
            {session?.user.uid === post.id && (
              <TrashIcon
                onClick={handleDeleteButtonClick}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            <div className="flex items-center">
              {isLiked ? (
                <HeartIconFilled
                  onClick={handleLikeButtonClick}
                  className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
                />
              ) : (
                <HeartIcon
                  onClick={handleLikeButtonClick}
                  className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
                />
              )}
              {likes.length > 0 && (
                <span
                  className={`${isLiked && 'text-red-600'} text-sm select-none`}
                >
                  {likes.length}
                </span>
              )}
            </div>
            <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-blue-500 hover:bg-sky-100" />
            <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-blue-500 hover:bg-sky-100" />
          </div>
        </div>
      </div>
    )
  )
}