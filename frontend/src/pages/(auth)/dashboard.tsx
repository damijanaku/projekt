import { Link } from "react-router"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../../components/ui/button"

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {user?.role === "salon_manager" && (
        <Button>
          <Link to="/dashboard/invite">Invite nail artist</Link>
        </Button>
      )}
    </div>
  )
}