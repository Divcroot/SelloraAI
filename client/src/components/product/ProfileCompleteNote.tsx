import { UserRound } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"

const ProfileCompleteNote = () => {
  return (
    <div>
        <Card>
            <CardHeader>
                <div>
                    <UserRound />
                </div>

                <CardTitle>
                    Complete Your Profile First
                </CardTitle>

                <CardDescription>
                    Before creating your product, please complete your partner profile and payments details.
                </CardDescription>
            </CardHeader>
        </Card>
    </div>
  )
}

export default ProfileCompleteNote