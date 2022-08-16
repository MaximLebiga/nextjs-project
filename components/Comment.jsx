import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon
} from '@heroicons/react/outline'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc
} from 'firebase/firestore'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid'
import Moment from 'react-moment'
import { db } from '../firebase'
import { useSession, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRecoilState } from 'recoil'
import { modalState } from '../atom/modalAtom'

export default function Comment({ comment, commentId, postId }) {
  const { data: session } = useSession()
  const [likes, setLikes] = useState([])
  const [isLiked, setIsLiked] = useState(false)
  const [, setIsOpen] = useRecoilState(modalState)

  useEffect(() => {
    if (session) {
      setIsLiked(
        likes.findIndex((like) => like.id === session.user.uid) !== -1
      )
    }
  }, [likes, session])

  useEffect(() => {
    onSnapshot(
      collection(db, 'posts', postId, 'comments', commentId, 'likes'),
      (snapshot) => setLikes(snapshot.docs)
    )
  }, [commentId, postId])

  const handleLikeButtonClick = async () => {
    if (session) {
      try {
        if (isLiked) {
          await deleteDoc(
            doc(
              db,
              'posts',
              postId,
              'comments',
              commentId,
              'likes',
              session.user.uid
            )
          )
        } else {
          await setDoc(
            doc(
              db,
              'posts',
              postId,
              'comments',
              commentId,
              'likes',
              session.user.uid
            ),
            {
              username: session.user.username
            }
          )
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      signIn()
    }
  }

  const handleChatButtonClick = () => {
    if (session) {
      setIsOpen((prevState) => !prevState)
    } else {
      signIn()
    }
  }

  const handleDeleteButtonClick = async () => {
    if (window.confirm('Are you sure you want delete this comment?')) {
      await deleteDoc(doc(db, 'posts', postId, 'comments', commentId))
    }
  }
  return (
    comment ? (
      <div className="pl-20 flex items-start p-3 cursor-pointer border-b border-gray-200">
        <div className="mr-4">
          <Image
            width={44}
            height={44}
            src={comment.userImg}
            alt="profile image"
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 whitespace-nowrap">
              <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                {comment.name}
              </h4>
              <span className="text-sm sm:text-[15px]">
                @{comment.username} -{' '}
              </span>
              {comment.timestamp && (
                <span className="text-sm sm:text-[15px] hover:underline">
                  <Moment fromNow>{comment.timestamp.toDate()}</Moment>
                </span>
              )}
            </div>
            <DotsHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2" />
          </div>
          <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
            {comment.comment}
          </p>
          <div className="flex justify-between text-gray-500 p-2">
            <div className="flex items-center">
              <ChatIcon
                onClick={handleChatButtonClick}
                className="h-9 w-9 hoverEffect p-2 hover:text-blue-500 hover:bg-sky-100"
              />
            </div>
            {session?.user.uid === comment.userId && (
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
    ) : null
  )
}
