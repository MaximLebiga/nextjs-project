import Image from "next/image";

export default function User({ user }) {
  return (
    <div className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200 transition duration-500 ease-out">
      <Image
        src={user.picture.thumbnail}
        width={40}
        height={40}
        className="rounded-full"
        alt="profile image"
      />
      <div className="truncate ml-4 leading-5">
        <h4 className="text-bold hover:underline text-[14px] truncate">
          {user.login.username}
        </h4>
        <h5 className="text-[13px] text-gray-500 truncate">{`${user.name.first} ${user.name.last}`}</h5>
      </div>
      <button className="ml-auto bg-black text-white rounded-full text-sm px-3.5 py-1.5 font-bold">
        Follow
      </button>
    </div>
  )
}