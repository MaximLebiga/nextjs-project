import { SearchIcon } from "@heroicons/react/outline"
import { useState } from "react"
import News from "./News"
import { AnimatePresence, motion } from 'framer-motion'
import User from "./User"

export default function Widgets({ news, users }) {
  const [articleNum, setArticleNum] = useState(3)
  const [usersNum, setUsersNum] = useState(4)
  return (
    <div className="xl:w-[600px] hidden lg:inline ml-8 space-y-5">
      <div className="w-[90%] xl:w-[75%] sticky top-0 bg-white py-1.5 z-50">
        <div className="flex items-center p-3 rounded-full relative">
          <SearchIcon className="h-5 z-50 text-gray-500" />
          <input
            type="text"
            placeholder="Search Twitter"
            className="absolute inset-0 rounded-full pl-11 border-gray-500 text-gray-700 focus:shadow-lg focus:bg-white bg-gray-100"
          />
        </div>
      </div>
      <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[75%]">
        <h4 className="font-bold text-xl px-4">What`s happening</h4>
        <AnimatePresence>
          {news.slice(0, articleNum).map((article) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <News article={article} />
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => setArticleNum((prevState) => prevState + 3)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >
          Show more
        </button>
      </div>
      <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[75%] sticky top-16">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        <AnimatePresence>
          {users.slice(0, usersNum).map((user) => (
            <motion.div
              key={user.login.uuid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <User user={user} />
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => setUsersNum((prevState) => prevState + 3)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >
          Show more
        </button>
      </div>
    </div>
  )
}
