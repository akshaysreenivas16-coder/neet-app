import { useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../supabase"

function ProfileSetup() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [age, setAge] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit() {
        if (!name || !username || !age) {
            setError("Please fill all fields")
            return
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error: insertError } = await supabase.from('profiles').insert({
            id: user.id,
            username: username,
            name: name,
            age: parseInt(age)
        })

        if (insertError) {
            setError(insertError.message)
        } else {
            navigate('/subject')
        }
    }

    return (
        <div className="bg-[#cae9ff] min-h-screen px-2 py-8">
            <div className="bg-white p-4 rounded-2xl max-w-md mx-auto">
                <h1  className="text-xl font-bold text-[#1b4965] text-center mb-4">SetUp Your Profile</h1>
                <div className="mt-4">
                    <input
                        className="w-full border border-gray-300 rounded-xl mb-3 px-4 py-3 focus:outline-none focus:ring focus:ring-[#5fa8d3]"
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="w-full border border-gray-300 rounded-xl mb-3 px-4 py-3 focus:outline-none focus:ring focus:ring-[#5fa8d3]"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="w-full border border-gray-300 rounded-xl mb-3 px-4 py-3 focus:outline-none focus:ring focus:ring-[#5fa8d3]"
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                    <button 
                        className="w-full bg-[#1b4965] text-white py-3 rounded-xl hover:bg-[#0d1b2a] transition"
                        onClick={handleSubmit}>
                            Save Profile
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileSetup