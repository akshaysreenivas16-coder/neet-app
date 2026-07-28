import { useNavigate } from "react-router-dom";

function Terms(){
    const navigate = useNavigate()

    return(
        <div className="max-w-md mx-auto px-6 py-8">
            <button onClick={() => navigate(-1)} className="text-[#1b4965] underline mb-6 block">← Back</button>
            <h1 className="text-2xl font-bold text-[#1b4965] mb-6">Terms</h1>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                <p>Terms of Service

                    Last updated: July 2026

                    By using Neetly, you agree to these terms.

                    1. Use of Service
                    Neetly is an educational platform for NEET exam preparation. You must be at least 13 years old to use this service.

                    2. User Accounts
                    You are responsible for maintaining the security of your account. Do not share your credentials.

                    3. Content
                    All questions and content on Neetly are for educational purposes only.

                    4. Prohibited Activities
                    You may not use Neetly to advertise, sell goods, or transfer your account to others.

                    5. Limitation of Liability
                    Neetly is not liable for any damages arising from use of the platform.

                    6. Changes to Terms
                    We may update these terms. Continued use means you accept the changes.

                    7. Contact
                    For questions: akshaysreenivas16@gmail.com
                </p>
            </div>
        </div>
    )

}

export default Terms