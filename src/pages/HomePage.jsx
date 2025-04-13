import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Clock, Edit, HelpCircle, ListChecks, Medal, Trophy } from "lucide-react"
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Edit className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Sentence Construction</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-mono leading-relaxed">
                Select the correct words to complete sentences by arranging the provided options in the right order.
                Build your vocabulary and grammar skills with each challenge.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center gap-2 p-3 bg-card rounded-lg border shadow-sm">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Time</span>
                <span className="font-semibold">30 sec</span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 bg-card rounded-lg border shadow-sm">
                <ListChecks className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Questions</span>
                <span className="font-semibold">10</span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 bg-card rounded-lg border shadow-sm">
                <Trophy className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Coins</span>
                <span className="font-semibold">0</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 font-bold">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Beginner</span>
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 font-bold">
                <Medal className="h-3.5 w-3.5" />
                <span>Points: 100</span>
              </Badge>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between gap-4">
            
            <Button className="w-full bg-black text-amber-50 cursor-pointer p-6" onClick={() => navigate('/game')}>Start Challenge</Button>
          </CardFooter>
        </Card>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Complete daily challenges to earn bonus coins!</p>
        </div>
      </div>
    </div>
  )
}

