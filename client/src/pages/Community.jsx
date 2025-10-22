import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const Community = () => {

  const [creations, setCreations] = useState([])
  const { user, getToken } = useUser()
  const [loading, setLoading] = useState(true)

  const fetchCreations = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/creations/published-creations', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(`/api/creations/toggle-like/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      if (data.success) {
        toast.success(data.message)
        await fetchCreations()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  } // ✅ Fixed closing brace here (line 95)

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  

  return !loading ? (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      Creations
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {creations.map((creation, index) => (
          <div key={index} className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
            <img src={creation.content} alt="" className='w-full h-full object-cover rounded-lg' />

            <div className='absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg'>
              <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
              <div className='flex gap-1 items-center'>
                <p>{creation.likes.length}</p>
                <Heart
                  onClick={() => imageLikeToggle(creation.id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user.id)
                    ? 'fill-red-500 text-red-600'
                    : 'text-white'
                    }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex-1 h-full flex justify-center items-center'>
      <span className='w-6 h-6 rounded-full border-4 border-t-transparent border-blue-500 animate-spin'></span>
    </div>
  )
}

export default Community
