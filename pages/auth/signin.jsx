import {getProviders, signIn} from "next-auth/react"

export default function SignIn({ providers }) {
  return (
    <div className="flex justify-center mt-20 space-x-4">
      <div className="md:w-44 md:h-80">
        <img
          src="https://cdn.cms-twdigitalassets.com/content/dam/help-twitter/en/twitter-tips/desktop-assets/ch-01/ch12findphone.png.twimg.1920.png"
          alt="twitter image"
          className="object-cover w-full h-full hidden rotate-6 md:inline-flex"
        />
      </div>
      <div>
        {Object.values(providers).map((provider) => (
          <div key={provider.name} className="flex flex-col items-center">
            <img
              src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
              alt="twitter logo"
              className="w-36 object-cover"
            />
            <p className="text-center text-sm italic my-10">
              This app is created for learning purposes
            </p>
            <button
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
              className="bg-red-400 rounded-lg p-3 text-white hover:bg-red-500"
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: {
      providers
    }
  }
}