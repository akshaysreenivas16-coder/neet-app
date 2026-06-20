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
            navigate('/home')
        }
    }

    return (
        <div>
            <h1>Set Up Your Profile</h1>
            <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleSubmit}>Save Profile</button>
        </div>
    )
}

export default ProfileSetup